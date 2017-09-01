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
		needsCollection.create(
			{
				nameOfNeed: nameOfNeed,
				postedBy: postedById
			},
			{ wait: true, success: successCallback }
		);

		function successCallback(response, nextModel, somethingElse) {
			console.log(response.collection, nextModel, somethingElse);

			dispatch({
				type: ADD_SUBMITTED_NEED,
				payload: {
					collection: response.collection,
					arrayOfNeeds: response.collection.models
				}
			});
		}
	};
}

export function fetchNeeds() {
	return function(dispatch) {
		var needsCollection = new CollectionOfNeeds();

		needsCollection.fetch().then(
			response => {
				dispatch({
					type: FETCH_NEEDS,
					payload: needsCollection
				});
			},
			error => {
				console.log(error);
			}
		);
	};
}

// reducers

const init_needs_poll = {
	collectionOfNeeds: null,
	arrayOfNeeds: null
};

export default function needsPollReducer(state = init_needs_poll, action) {
	switch (action.type) {
		case FETCH_NEEDS:
			return _.extend({}, state, {
				collectionOfNeeds: action.payload
			});

		case ADD_SUBMITTED_NEED:
			return _.extend({}, state, {
				arrayOfNeeds: action.payload.arrayOfNeeds
			});
	}

	return state;
}

// selectors

const collectionOfNeeds = state => state.needsPoll.collectionOfNeeds,
	arrayOfNeeds = state => state.needsPoll.arrayOfNeeds;

export const selector = createStructuredSelector({
	collectionOfNeeds,
	arrayOfNeeds
});
