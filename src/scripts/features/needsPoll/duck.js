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

const ADD_SUBMITTED_NEED = "add_submitted_need", FETCH_NEEDS = "fetch_needs";

export function submitNewNeed(nameOfNeed, postedById, needsCollection) {
	return function(dispatch) {
		dispatch({
			type: ADD_SUBMITTED_NEED,
			payload: {
				status: "active"
			}
		});

		needsCollection.create(
			{
				nameOfNeed: nameOfNeed,
				postedBy: postedById
			},
			{ wait: true, success: successCallback }
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
	errorLoadingNeeds: false
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
			extendObj.statusOfCreateNeed = action.payload.status;
			extendObj.addingNeed = action.payload.status == "active"
				? true
				: false;
			extendObj.addedNeed = action.payload.status == "success"
				? true
				: false;

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
	addedNeed = state => state.needsPoll.addedNeed;

export const selector = createStructuredSelector({
	collectionOfNeeds,
	arrayOfNeeds,
	loadingNeeds,
	errorLoadingNeeds,
	addingNeed,
	addedNeed
});
