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

import { updateItem, removeItem, fetchItems } from "../shelters/duck.js";
export { updateItem, removeItem, fetchItems };

import { CollectionOfNeeds, NeedModel } from "../../models/needsPoll/need.js";
import { CollectionOfItems, ItemModel } from "../../models/shelters/shelter.js";
import { CollectionOfOneItem } from "../../models/shelters/oneShelter.js";

const ADD_SUBMITTED_NEED = "add_submitted_need",
	FETCH_NEEDS = "fetch_needs",
	FETCH_NEEDS_VISITOR = "fetch_needs_visitor",
	REMOVE_NEED = "remove_need",
	UPDATE_NEED = "update_need",
	EDIT_NEED = "edit_need",
	FETCH_USER = "fetch_user",
	FETCH_SHELTERS = "fetch_shelters",
	FILTER_NEEDS = "filter_needs",
	SHOW_SPINNER = "show_spinner";

export function submitNewNeed(values, postedById, needsCollection, shelterId) {
	return function(dispatch) {
		if (shelterId) {
			dispatch({
				type: ADD_SUBMITTED_NEED,
				payload: {
					status: "active"
				}
			});

			dispatch({ type: SHOW_SPINNER, payload: { show: true } });

			needsCollection.create(
				{
					nameOfNeed: values.nameOfNeed,
					postedBy: postedById,
					degreeOfNeed: 0,
					numberOfPeople: Number(values.numberOfPeople),
					description: values.description,
					shelter: shelterId
				},
				{ wait: true, success: successCallback, error: errorCallback }
			);
		} else {
			console.log(shelterId);
			dispatch({
				type: ADD_SUBMITTED_NEED,
				payload: {
					status: "error"
				}
			});
		}

		function successCallback(response) {
			// var shelter = sheltersCollection.get(shelterId);
			// shelter.set({ needs: shelter.needs.push(response._id) });

			// shelter
			// 	.save()
			// 	.done(() => {
			// 		dispatch({
			// 			type: ADD_SUBMITTED_NEED,
			// 			payload: {
			// 				collection: response.collection,
			// 				arrayOfNeeds: response.collection.models,
			// 				status: "success"
			// 			}
			// 		});
			// 	})
			// 	.fail(function(err) {
			// 		dispatch({
			// 			type: UPDATE_NEED,
			// 			payload: {
			// 				status: "error",
			// 				idOfUpdatedNeed: idOfNeed
			// 			}
			// 		});
			// 	});
			dispatch({ type: SHOW_SPINNER, payload: { show: false } });
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

			dispatch({ type: SHOW_SPINNER, payload: { show: false } });
		}
	};
}

export function fetchShelter(shelterId) {
	return function(dispatch) {
		if (shelterId) {
			dispatch({
				type: FETCH_SHELTERS,
				payload: { status: "active" }
			});
			var sheltersCollection = new CollectionOfOneItem();
			sheltersCollection.fetch({
				data: shelterId,
				wait: true,
				success: fetchedShelter,
				error: didNotFetchShelter
			});

			dispatch({ type: SHOW_SPINNER, payload: { show: true } });

			function fetchedShelter(collection, response, options) {
				dispatch({ type: SHOW_SPINNER, payload: { show: false } });
				var shelter = response[0];
				var shelterModel = collection.get(shelterId);

				dispatch({
					type: FETCH_SHELTERS,
					payload: {
						status: "success",
						shelter: shelter,
						shelterModel: shelterModel
					}
				});
			}

			function didNotFetchShelter(collection, response, options) {
				dispatch({ type: SHOW_SPINNER, payload: { show: false } });
				dispatch({
					type: FETCH_SHELTERS,
					payload: {
						status: "error"
					}
				});
			}
		}
	};
}

export function fetchNeeds(shelterId, notLoggedIn) {
	return function(dispatch) {
		if (shelterId) {
			var needsCollection = new CollectionOfNeeds();

			dispatch({
				type: FETCH_NEEDS,
				payload: { status: "active" }
			});

			needsCollection.fetch({
				data: { currentShelter: shelterId },
				wait: true,
				success: fetchedNeeds,
				error: didNotFetchNeeds
			});

			dispatch({ type: SHOW_SPINNER, payload: { show: true } });

			function fetchedNeeds(collection, response, options) {
				var status = "inactive";
				console.log("done");
				console.log(collection, needsCollection);
				if (notLoggedIn) {
					dispatch({
						type: FETCH_NEEDS,
						payload: {
							collection: needsCollection,
							arrayOfNeeds: needsCollection.models,
							status: status
						}
					});
					dispatch({ type: SHOW_SPINNER, payload: { show: false } });
				} else {
					dispatch({
						type: FETCH_NEEDS,
						payload: {
							collection: needsCollection,
							arrayOfNeeds: needsCollection.models,
							status: status
						}
					});
					dispatch({ type: SHOW_SPINNER, payload: { show: false } });
				}
			}

			function didNotFetchNeeds(collection, response, options) {
				dispatch({
					type: FETCH_NEEDS,
					payload: {
						status: "error"
					}
				});
				dispatch({ type: SHOW_SPINNER, payload: { show: false } });
			}
		}
	};
}

export function updateNeed(
	idOfNeed,
	needsCollection,
	update,
	people,
	userInput,
	sheltersCollection
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

		dispatch({ type: SHOW_SPINNER, payload: { show: true } });

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

				dispatch({ type: SHOW_SPINNER, payload: { show: false } });
			})
			.fail(function(err) {
				dispatch({ type: SHOW_SPINNER, payload: { show: false } });
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

export function removeNeed(idOfNeed, needsCollection, prompt) {
	return function(dispatch) {
		if (!prompt) {
			dispatch({
				type: REMOVE_NEED,
				payload: {
					status: "active"
				}
			});

			dispatch({ type: SHOW_SPINNER, payload: { show: true } });

			var model = needsCollection.get(idOfNeed);

			model.destroy({
				success: (response, something, somethingElse) => {
					dispatch({
						type: REMOVE_NEED,
						payload: {
							collection: needsCollection,
							arrayOfNeeds: needsCollection.models,
							status: "success"
						}
					});

					dispatch({ type: SHOW_SPINNER, payload: { show: false } });
				},
				error: onError,
				wait: true
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

		function onError(response) {
			dispatch({ type: SHOW_SPINNER, payload: { show: false } });
			dispatch({
				type: REMOVE_NEED,
				payload: {
					status: "error"
				}
			});
		}
	};
}

export function findNeeds(value, collectionOfNeeds) {
	return function(dispatch) {
		if (value && collectionOfNeeds) {
			var filtered = _.filter(collectionOfNeeds.models, function(model) {
				() => {
					if (model.attributes.name.includes(value)) {
						return;
					}
					if (model.attributes.description.includes(value)) {
						return;
					}
				};
			});
		}
		console.log(filtered);
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

		if (type === "removingNeed") {
			dispatch({
				type: REMOVE_NEED,
				payload: { status: "inactive" }
			});
		}

		if (type === "shelter") {
			dispatch({
				type: FETCH_SHELTERS,
				payload: {
					status: "clear",
					shelter: undefined
				}
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
	statusOfFetchShelters: null,
	shelter: null,
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
	idOfUpdatedNeed: null,
	visitorShelterId: null,
	userInfo: null,
	fullUser: null,
	showSpinner: false	
};

export default function needsPollReducer(state = init_needs_poll, action) {
	switch (action.type) {
		case FETCH_SHELTERS:
			var extendObj = {};

			if (action.payload.status === "success") {
				extendObj.shelter = action.payload.shelter;
				extendObj.statusOfFetchShelters = action.payload.status;
				if (action.payload.shelterModel) {
					extendObj.shelterModel = action.payload.shelterModel;
				}
			}

			if (action.payload.status === "clear") {
				extendObj.shelterDidReset = true;
				extendObj.shelter = undefined;
				extendObj.statusOfFetchShelters = "inactive";
			}

			return _.extend({}, state, extendObj);

		case FETCH_NEEDS_VISITOR:
			return _.extend({}, state, {
				visitorShelterId: action.payload.currentShelterId,
				collectionOfNeeds: action.payload.collection,
				arrayOfNeeds: action.payload.arrayOfNeeds,
				statusOfFetchNeeds: action.payload.status,
				loadingNeeds: action.payload.status == "active" ? true : false,
				errorLoadingNeeds: action.payload.status == "error"
					? true
					: false
			});

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

			if (
				action.payload.collection &&
				action.payload.status === "success"
			) {
				extendObj.collectionOfNeeds = action.payload.collection;
			}

			if (
				action.payload.arrayOfNeeds &&
				action.payload.status === "success"
			) {
				extendObj.arrayOfNeeds = action.payload.arrayOfNeeds;
			}
			extendObj.statusOfRemoveNeed = action.payload.status;
			extendObj.removingNeed = action.payload.status == "active"
				? true
				: false;
			extendObj.removedNeed = action.payload.status == "success"
				? true
				: false;
			extendObj.errorRemovingNeed = action.payload.status === "error"
				? true
				: false;

			extendObj.needRemovalPrompt = action.payload.status == "prompt"
				? true
				: false;
			extendObj.idOfNeedToRemove = action.payload.idOfNeedToRemove;

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

		case FILTER_NEEDS:
			var extendObj = {};
			if (action.payload.filteredNeeds) {
				extendObj.filteredArrayOfNeeds = action.payload.filteredNeeds;
			}

			return _.extend({}, state, extendObj);

		case SHOW_SPINNER:
			var extendObj = {};

			if (action.payload.show === true) {
				extendObj.showSpinner = true;
			} else {
				extendObj.showSpinner = false;
			}

			return _.extend({}, state, extendObj);
	}

	return state;
}

// selectors

const statusOfFetchShelters = state => state.needsPoll.statusOfFetchShelters,
	shelter = state => state.needsPoll.shelter,
	collectionOfNeeds = state => state.needsPoll.collectionOfNeeds,
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
	idOfUpdatedNeed = state => state.needsPoll.idOfUpdatedNeed,
	currentShelterId = state => state.shelters.currentShelterId,
	collectionOfShelters = state => state.shelters.collectionOfItems,
	user = state => state.auth.userSession.user,
	shelterCookie = state => state.auth.userSession.shelterCookie,
	shelterDidReset = state => state.needsPoll.shelterDidReset,
	didEnterShelter = state => state.shelters.didEnterShelter,
	shelterModel = state => state.needsPoll.shelterModel,
	statusOfUpdateItem = state => state.shelters.statusOfUpdateItem,
	statusOfRemoveItem = state => state.shelters.statusOfRemoveItem,
	sheltersMapPath = state => state.nav.navLink.routes.sheltersMapPath,
	filteredArrayOfNeeds = state => state.needsPoll.filteredArrayOfNeeds,
	showSpinner = state => state.needsPoll.showSpinner;

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
	idOfUpdatedNeed,
	currentShelterId,
	collectionOfShelters,
	user,
	shelter,
	shelterCookie,
	shelterDidReset,
	didEnterShelter,
	shelterModel,
	statusOfUpdateItem,
	statusOfRemoveItem,
	sheltersMapPath,
	filteredArrayOfNeeds,
	showSpinner
});
