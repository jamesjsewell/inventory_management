import { combineReducers } from "redux";
import { createStructuredSelector } from "reselect";
import _ from "underscore";
import axios from "axios";
import {
	API_URL,
	fetchUser,
	postData,
	getData,
	putData,
	deleteData,
	getAPIkey,
	getToken
} from "../../util/index.js";

import { CollectionOfNeeds, NeedModel } from "../../models/needsPoll/need.js";

const ADD_SUBMITTED_NEED = "add_submitted_need",
	FETCH_NEEDS = "fetch_needs",
	REMOVE_NEED = "remove_need",
	UPDATE_NEED = "update_need",
	EDIT_NEED = "edit_need";

export function submitNewNeed(values, postedById, needsCollection) {
	return function(dispatch) {
		dispatch({
			type: ADD_SUBMITTED_NEED,
			payload: {
				status: "active"
			}
		});

		needsCollection.create(
			{
				nameOfNeed: values.nameOfNeed,
				postedBy: postedById,
				degreeOfNeed: 0,
				numberOfPeople: Number(values.numberOfPeople),
				description: values.description
			},
			{ wait: true, success: successCallback, error: errorCallback }
		);

		function successCallback(response) {
			dispatch({
				type: ADD_SUBMITTED_NEED,
				payload: {
					collection: response.collection,
					arrayOfNeeds: response.collection.models,
					status: "success"
				}
			});
		}

		function errorCallback(response) {
			dispatch({
				type: ADD_SUBMITTED_NEED,
				payload: {
					status: "error"
				}
			});
		}
	};
}

export function removeNeed(idOfNeed, needsCollection, prompt) {
	return function(dispatch) {
		if (!prompt) {
			dispatch({
				type: REMOVE_NEED,
				payload: {
					status: "active"
				}
			});

			var model = needsCollection.get(idOfNeed);

			model
				.destroy()
				.done(
					dispatch({
						type: REMOVE_NEED,
						payload: {
							collection: needsCollection,
							arrayOfNeeds: needsCollection.models,
							status: "success"
						}
					})
				)
				.fail(function(err) {
					dispatch({
						type: REMOVE_NEED,
						payload: {
							status: "error"
						}
					});
				});
		} else if (prompt) {
			dispatch({
				type: REMOVE_NEED,
				payload: {
					status: "prompt",
					idOfNeedToRemove: idOfNeed
				}
			});
		}
	};
}

export function updateNeed(
	idOfNeed,
	needsCollection,
	update,
	people,
	userInput
) {
	return function(dispatch) {
		dispatch({
			type: UPDATE_NEED,
			payload: {
				status: "active"
			}
		});

		var model = needsCollection.get(idOfNeed);

		var updatedInfo = {};

		if (update === "needs" && model.get("degreeOfNeed") > 0) {
			updatedInfo.degreeOfNeed = Number(model.get("degreeOfNeed")) - 1;
		}

		if (update === "has" && model.get("degreeOfNeed") < people) {
			updatedInfo.degreeOfNeed = Number(model.get("degreeOfNeed")) + 1;
		}

		if (update === "edit") {
			updatedInfo.numberOfPeople = userInput.numberOfPeople;
			updatedInfo.nameOfNeed = userInput.nameOfNeed;
			updatedInfo.degreeOfNeed = userInput.degreeOfNeed;
			updatedInfo.description = userInput.description;
		}

		model.set(updatedInfo);

		model
			.save()
			.done(() => {
				needsCollection.reset(needsCollection.models, model);

				var updatedModel = needsCollection.get(idOfNeed);

				dispatch({
					type: UPDATE_NEED,
					payload: {
						collection: needsCollection,
						arrayOfNeeds: needsCollection.models,
						status: "success",
						idOfUpdatedNeed: idOfNeed
					}
				});
			})
			.fail(function(err) {
				console.log(err);
				dispatch({
					type: UPDATE_NEED,
					payload: {
						status: "error",
						idOfUpdatedNeed: idOfNeed
					}
				});
			});
	};
}

export function fetchNeeds() {
	return function(dispatch) {
		var needsCollection = new CollectionOfNeeds();

		dispatch({
			type: FETCH_NEEDS,
			payload: { status: "active" }
		});

		needsCollection.fetch().then(
			response => {
				var status = "inactive";

				if (response.error) {
					status = "error";
				}
				dispatch({
					type: FETCH_NEEDS,
					payload: {
						collection: needsCollection,
						arrayOfNeeds: needsCollection.models,
						status: status
					}
				});
			},
			error => {
				dispatch({
					type: FETCH_NEEDS,
					payload: {
						status: "error"
					}
				});
			}
		);
	};
}

export function resetStatus(type) {
	return function(dispatch) {
		if (type === "addingNeed") {
			dispatch({
				type: ADD_SUBMITTED_NEED,
				payload: { status: "inactive" }
			});
		}

		if (type === "updatingNeed") {
			dispatch({
				type: UPDATE_NEED,
				payload: { status: "inactive" }
			});
		}

		if (type === "removingNeed"){
			dispatch({
				type: REMOVE_NEED,
				payload: { status: "inactive" }
			});
		}
	};
}

export function editNeed(idOfNeed, close) {
	return function(dispatch) {
		if (!close) {
			dispatch({
				type: EDIT_NEED,
				payload: { status: "active", idOfNeed: idOfNeed }
			});
		} else {
			dispatch({
				type: EDIT_NEED,
				payload: { status: "inactive" }
			});
		}
	};
}

// reducers

const init_needs_poll = {
	collectionOfNeeds: null,
	arrayOfNeeds: null,
	statusOfFetchNeeds: "inactive",
	loadingNeeds: false,
	statusOfCreateNeed: "inactive",
	addingNeed: false,
	addedNeed: false,
	errorAddingNeed: false,
	errorLoadingNeeds: false,
	removingNeed: false,
	removedNeed: false,
	errorRemovingNeed: false,
	needRemovalPrompt: false,
	idOfNeedToRemove: null,
	statusOfRemoveNeed: "inactive",
	totalOfOccupants: 20,
	editingNeed: false,
	idOfEditedNeed: null,
	idOfUpdatedNeed: null
};

export default function needsPollReducer(state = init_needs_poll, action) {
	switch (action.type) {
		case FETCH_NEEDS:
			return _.extend({}, state, {
				collectionOfNeeds: action.payload.collection,
				arrayOfNeeds: action.payload.arrayOfNeeds,
				statusOfFetchNeeds: action.payload.status,
				loadingNeeds: action.payload.status == "active" ? true : false,
				errorLoadingNeeds: action.payload.status == "error"
					? true
					: false
			});

		case ADD_SUBMITTED_NEED:
			var extendObj = {};
			if (action.payload.collection) {
				extendObj.collectionOfNeeds = action.payload.collection;
			}

			if (action.payload.arrayOfNeeds) {
				extendObj.arrayOfNeeds = action.payload.arrayOfNeeds;
			}
			if (action.payload.status === "error") {
				extendObj.errorAddingNeed = true;
			}
			extendObj.statusOfCreateNeed = action.payload.status;
			extendObj.addingNeed = action.payload.status == "active"
				? true
				: false;
			extendObj.addedNeed = action.payload.status == "success"
				? true
				: false;

			return _.extend({}, state, extendObj);

		case REMOVE_NEED:
			var extendObj = {};
			if (action.payload.collection) {
				extendObj.collectionOfNeeds = action.payload.collection;
			}

			if (action.payload.arrayOfNeeds) {
				extendObj.arrayOfNeeds = action.payload.arrayOfNeeds;
			}
			extendObj.statusOfRemoveNeed = action.payload.status;
			extendObj.removingNeed = action.payload.status == "active"
				? true
				: false;
			extendObj.removedNeed = action.payload.status == "success"
				? true
				: false;
			extendObj.errorRemovingNeed = action.payload.status == "error"
				? true
				: false;
			extendObj.needRemovalPrompt = action.payload.status == "prompt"
				? true
				: false;
			extendObj.idOfNeedToRemove = action.payload.idOfNeedToRemove

			return _.extend({}, state, extendObj);

		case UPDATE_NEED:
			var extendObj = {};
			if (action.payload.collection) {
				extendObj.collectionOfNeeds = action.payload.collection;
			}

			if (action.payload.arrayOfNeeds) {
				extendObj.arrayOfNeeds = action.payload.arrayOfNeeds;
			}
			extendObj.statusOfUpdateNeed = action.payload.status;
			extendObj.updatingNeed = action.payload.status == "active"
				? true
				: false;
			extendObj.updatedNeed = action.payload.status == "success"
				? true
				: false;
			extendObj.errorUpdatingNeed = action.payload.status == "error"
				? true
				: false;
			extendObj.idOfUpdatedNeed = action.payload.idOfUpdatedNeed;

			return _.extend({}, state, extendObj);

		case EDIT_NEED:
			var extendObj = {};
			if (action.payload.status === "active") {
				extendObj.editingNeed = true;
				extendObj.idOfEditedNeed = action.payload.idOfNeed;
			} else {
				extendObj.editingNeed = false;
			}

			return _.extend({}, state, extendObj);
	}

	return state;
}

// selectors

const collectionOfNeeds = state => state.needsPoll.collectionOfNeeds,
	arrayOfNeeds = state => state.needsPoll.arrayOfNeeds,
	statusOfFetchNeeds = state => state.needsPoll.statusOfFetchNeeds,
	loadingNeeds = state => state.needsPoll.loadingNeeds,
	errorLoadingNeeds = state => state.needsPoll.errorLoadingNeeds,
	statusOfCreateNeed = state => state.needsPoll.statusOfCreateNeed,
	addingNeed = state => state.needsPoll.addingNeed,
	addedNeed = state => state.needsPoll.addedNeed,
	errorAddingNeed = state => state.needsPoll.errorAddingNeed,
	statusOfRemoveNeed = state => state.needsPoll.statusOfRemoveNeed,
	removingNeed = state => state.needsPoll.removingNeed,
	removedNeed = state => state.needsPoll.removedNeed,
	errorRemovingNeed = state => state.needsPoll.errorRemovingNeed,
	needRemovalPrompt = state => state.needsPoll.needRemovalPrompt,
	idOfNeedToRemove = state => state.needsPoll.idOfNeedToRemove,
	statusOfUpdateNeed = state => state.needsPoll.statusOfUpdateNeed,
	updatingNeed = state => state.needsPoll.updatingNeed,
	updatedNeed = state => state.needsPoll.updatedNeed,
	errorUpdatingNeed = state => state.needsPoll.errorUpdatingNeed,
	totalOfOccupants = state => state.needsPoll.totalOfOccupants,
	editingNeed = state => state.needsPoll.editingNeed,
	idOfEditedNeed = state => state.needsPoll.idOfEditedNeed,
	idOfUpdatedNeed = state => state.needsPoll.idOfUpdatedNeed;

export const selector = createStructuredSelector({
	collectionOfNeeds,
	arrayOfNeeds,
	loadingNeeds,
	errorLoadingNeeds,
	addingNeed,
	addedNeed,
	errorAddingNeed,
	statusOfRemoveNeed,
	removingNeed,
	removedNeed,
	errorRemovingNeed,
	needRemovalPrompt,
	idOfNeedToRemove,
	statusOfUpdateNeed,
	updatingNeed,
	updatedNeed,
	errorUpdatingNeed,
	errorRemovingNeed,
	totalOfOccupants,
	editingNeed,
	idOfEditedNeed,
	idOfUpdatedNeed
});
