import { combineReducers } from "redux";
import { createStructuredSelector } from "reselect";
import _ from "underscore";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
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

import { CollectionOfItems, ItemModel } from "../../models/shelters/shelter.js";
import { CollectionOfUsers, UserModel } from "../../models/user/UserModel.js";


const NEW_ITEM = "new_item",
	FETCH_ITEMS = "fetch_items",
	REMOVE_ITEM = "remove_item",
	REMOVE_ITEM_PROMPT = "remove_item_prompt",
	UPDATE_ITEM = "update_item",
	EDIT_ITEM = "edit_item",
	USER_CHOSE_LOCATION = "user_chose_location",
	ITEM_EXISTS = "item_exists",
	USER_ENTERED_SHELTER = "user_entered_shelter",
	FETCH_USER = "fetch_user";

export { getAPIkey };

export function getEntireUser(uid) {
	return function(dispatch) {
		if (uid) {
			axios
				.get(`${API_URL}/user/${uid}`, {
					headers: { Authorization: getToken() }
				})
				.then(response => {
					console.log(response);
					dispatch({
						type: FETCH_USER,
						payload: response.data
					});
				})
				.catch(error => {
					console.log(error);
				});
		}
	};
}

export function createItem(values, postedById, itemCollection, place) {
	return function(dispatch) {
		dispatch({
			type: NEW_ITEM,
			payload: {
				status: {
					inProgress: true,
					success: null,
					error: null,
					idOfItem: null
				}
			}
		});

		itemCollection.create(
			{
				nameOfItem: values.nameOfItem,
				postedBy: postedById,
				description: values.description,
				members: postedById,
				place: place
			},
			{ wait: true, success: successCallback, error: errorCallback }
		);

		function successCallback(response) {

			dispatch({
				type: NEW_ITEM,
				payload: {

					newShelterId: response.attributes._id,
					collection: response.collection,
					arrayOfItems: response.collection.models,
					status: {
						inProgress: false,
						success: true,
						error: null,
						idOfItem: null //response, model -- model.id
					}
				}
			});
		}

		function errorCallback(response) {
			dispatch({
				type: NEW_ITEM,
				payload: {
					status: {
						inProgress: false,
						success: false,
						error: true,
						idOfItem: null
					}
				}
			});
		}
	};
}

export function fetchItems() {
	return function(dispatch) {
		var itemCollection = new CollectionOfItems();

		dispatch({
			type: FETCH_ITEMS,
			payload: {
				status: {
					inProgress: true,
					success: null,
					error: null,
					idOfItem: null
				}
			}
		});

		itemCollection.fetch({
			wait: true,
			success: successFetchingItems,
			error: errorFetchingItems
		});

		function successFetchingItems(collection, response, options) {
			
			dispatch({
				type: FETCH_ITEMS,
				payload: {
					collection: collection,
					arrayOfItems: collection.models,
					status: {
						inProgress: false,
						success: response.error ? false : true,
						error: response.error ? true : false,
						idOfItem: null
					}
				}
			});
		}

		function errorFetchingItems() {
			console.log("fuck");
			dispatch({
				type: FETCH_ITEMS,
				payload: {
					status: {
						inProgress: false,
						success: false,
						error: true,
						idOfItem: null
					}
				}
			});
		}
	};
}

export function updateItem(
	idOfItem,
	itemCollection,
	updateType,
	people,
	userInput
) {
	return function(dispatch) {
		dispatch({
			type: UPDATE_ITEM,
			payload: {
				status: {
					inProgress: true,
					success: null,
					error: null,
					idOfItem: idOfItem
				}
			}
		});

		var model = itemCollection.get(idOfItem);

		var updatedInfo = {};

		if (updateType === "edit") {
			updatedInfo.nameOfItem = userInput.nameOfItem;
			updatedInfo.description = userInput.description;
		}

		model.set(updatedInfo);

		model
			.save()
			.done(() => {
				itemCollection.reset(itemCollection.models, model);

				var updatedModel = itemCollection.get(idOfItem);

				dispatch({
					type: UPDATE_ITEM,
					payload: {
						collection: itemCollection,
						arrayOfItems: itemCollection.models,
						status: {
							inProgress: false,
							success: true,
							error: false,
							idOfItem: idOfItem
						}
					}
				});
			})
			.fail(function(err) {
				dispatch({
					type: UPDATE_ITEM,
					payload: {
						status: {
							inProgress: false,
							success: false,
							error: true,
							idOfItem: idOfItem
						}
					}
				});
			});
	};
}

export function removeItem(idOfItem, itemCollection, prompt) {
	return function(dispatch) {
		if (!prompt) {
			dispatch({
				type: REMOVE_ITEM,
				payload: {
					status: {
						inProgress: true,
						success: null,
						error: null,
						idOfItem: idOfItem
					}
				}
			});

			var model = itemCollection.get(idOfItem);

			model.destroy({
				success: (response, something, somethingElse) => {
					dispatch({
						type: REMOVE_ITEM,
						payload: {
							collection: itemCollection,
							arrayOfItems: itemCollection.models,
							status: {
								inProgress: false,
								success: true,
								error: false,
								idOfItem: idOfItem
							}
						}
					});

					dispatch({
						type: REMOVE_ITEM_PROMPT,
						payload: {
							status: {
								inProgress: false,
								success: null,
								error: null,
								idOfItem: null
							}
						}
					});
				},
				error: onError,
				wait: true
			});
		} else if (prompt) {
			dispatch({
				type: REMOVE_ITEM_PROMPT,
				payload: {
					status: {
						inProgress: true,
						success: null,
						error: null,
						idOfItem: idOfItem
					}
				}
			});
		}

		function onError(response) {
			dispatch({
				type: REMOVE_ITEM,
				payload: {
					status: {
						inProgress: false,
						success: false,
						error: true,
						idOfItem: idOfItem
					}
				}
			});
		}
	};
}

export function resetStatus(statusOf, data) {
	return function(dispatch) {
		if (statusOf === "addingItem") {
			dispatch({
				type: NEW_ITEM,
				payload: {
					status: {
						inProgress: false,
						success: null,
						error: null,
						idOfItem: null
					}
				}
			});
		}

		if (statusOf === "updatingItem") {
			dispatch({
				type: UPDATE_ITEM,
				payload: {
					status: {
						inProgress: false,
						success: null,
						error: null,
						idOfItem: null
					}
				}
			});
		}

		if (statusOf === "removingItem") {
			dispatch({
				type: REMOVE_ITEM,
				payload: {
					status: {
						inProgress: false,
						success: null,
						error: null,
						idOfItem: null
					}
				}
			});

			dispatch({
				type: REMOVE_ITEM_PROMPT,
				payload: {
					status: {
						inProgress: false,
						success: true,
						error: false,
						idOfItem: null
					}
				}
			});
		}

		if (statusOf === "creating") {
			dispatch({
				type: USER_CHOSE_LOCATION,
				payload: {
					status: {
						inProgress: false,
						success: null,
						error: null,
						idOfItem: null
					}
				}
			});
		}
	};
}

export function editItem(idOfItem, close) {
	return function(dispatch) {
		if (!close) {
			dispatch({
				type: EDIT_ITEM,
				payload: {
					status: {
						inProgress: true,
						success: null,
						error: null,
						idOfItem: idOfItem
					}
				}
			});
		} else {
			dispatch({
				type: EDIT_ITEM,
				payload: {
					status: {
						inProgress: false,
						success: null,
						error: null,
						idOfItem: idOfItem
					}
				}
			});
		}
	};
}

export function userChoseLocation(place, userId) {
	return function(dispatch) {
		if (place && userId) {

			dispatch({
				type: USER_CHOSE_LOCATION,
				payload: {
					status: {
						inProgress: true,
						success: null,
						error: null,
						idOfItem: null
					},
					contents: {
						place: place,
						userId: userId
					}
				}
			});
		}
	};
}

export function checkForExistingItem(collection, id) {
	return function(dispatch) {
		if (collection && collection.models) {
			var lookfor = id;
			var found = _.find(collection.models, item => {
				if (
					item.attributes.place &&
					item.attributes.place.id === lookfor
				) {
					return true;
				}
			});

			if (found) {
				dispatch({
					type: ITEM_EXISTS,
					payload: true
				});
			} else {
				dispatch({
					type: ITEM_EXISTS,
					payload: false
				});
			}
		}
	};
}

export function userEnteredShelter(shelterId, userId) {
	//takes user model
	//set shelter id on user model
	//perform save on user model
	//on success then dispatch
	//oh, and create an email confirmation system
	//i wonder how this will work for people who are not signed in?
	//maybe set a cookie for those people containing the current shelter id, YEAH!
	console.log(shelterId)
	return function(dispatch) {
		var users = new CollectionOfUsers();

		if (userId && shelterId) {
			users.fetch({
				data: userId,
				wait: true,
				headers: { Authorization: getToken() },
				success: successFetching,
				error: errorFetching
			});
		}

		// if (!userId && shelterId) {
		// 	cookies.set("currentShelter", shelterId, { path: "/" });

		// 	dispatch({
		// 		type: USER_ENTERED_SHELTER,
		// 		payload: shelterId
		// 	});
		// }

		function successFetching(collection, response, options) {
			var user = collection.models[0];

			user.set({ currentShelter: shelterId });

			user.save(
				{},
				{
					wait: true,
					headers: { Authorization: getToken() },
					success: successSaving,
					error: errorSaving
				}
			);
		}

		function errorFetching() {
			console.log("error");
		}

		function successSaving(model, response, options) {
			dispatch({
				type: USER_ENTERED_SHELTER,
				payload: model.get("currentShelter")
			});
		}

		function errorSaving() {
			console.log("error");
		}
	};
}

// reducers
const init_needs_poll = {
	collectionOfItems: null,
	arrayOfItems: [],
	statusOfCreateItem: {
		inProgress: false,
		success: false,
		error: false,
		idOfItem: ""
	},
	statusOfFetchItems: {
		inProgress: false,
		success: false,
		error: false,
		idOfItem: ""
	},
	statusOfUpdateItem: {
		inProgress: false,
		success: false,
		error: false,
		idOfItem: ""
	},
	statusOfRemoveItem: {
		inProgress: false,
		success: false,
		error: false,
		idOfItem: ""
	},
	statusOfRemoveItemPrompt: {
		inProgress: false,
		success: false,
		error: false,
		idOfItem: ""
	},
	statusOfEditItem: {
		inProgress: false,
		success: false,
		error: false,
		idOfItem: ""
	},
	statusOfCreateShelter: {
		inProgress: false,
		success: false,
		error: false,
		idOfItem: ""
	},
	newShelterPlace: null,
	currentShelterId: null,
	didEnterShelter: false
};

export default function sheltersReducer(state = init_needs_poll, action) {
	var extendObj = {};

	if (action.payload && action.payload.collection) {
		extendObj.collectionOfItems = action.payload.collection;
	}

	if (action.payload && action.payload.arrayOfItems) {
		extendObj.arrayOfItems = action.payload.arrayOfItems;
	}

	switch (action.type) {
		case FETCH_USER: {
			if (action.payload.currentShelter) {
				extendObj.currentShelterId = action.payload.currentShelter;
			}
			return _.extend({}, state, extendObj);
		}
		case NEW_ITEM:
			extendObj.statusOfCreateItem = action.payload.status;
			extendObj.newShelterId = action.payload.newShelterId

			return _.extend({}, state, extendObj);

		case FETCH_ITEMS:
			extendObj.statusOfFetchItems = action.payload.status;

			return _.extend({}, state, extendObj);

		case UPDATE_ITEM:
			extendObj.statusOfUpdateItem = action.payload.status;

			return _.extend({}, state, extendObj);

		case REMOVE_ITEM:
			extendObj.statusOfRemoveItem = action.payload.status;

			return _.extend({}, state, extendObj);

		case REMOVE_ITEM_PROMPT:
			extendObj.statusOfRemoveItemPrompt = action.payload.status;

			return _.extend({}, state, extendObj);

		case EDIT_ITEM:
			extendObj.statusOfEditItem = action.payload.status;

			return _.extend({}, state, extendObj);

		case USER_CHOSE_LOCATION:
			if (action.payload.contents && action.payload.contents.place) {
				extendObj.newShelterPlace = action.payload.contents.place;
			}
			extendObj.statusOfCreateShelter = action.payload.status;

			return _.extend({}, state, extendObj);

		case ITEM_EXISTS:
			extendObj.itemExists = action.payload;

			return _.extend({}, state, extendObj);

		case USER_ENTERED_SHELTER:
			extendObj.currentShelterId = action.payload;
			extendObj.didEnterShelter = true;

			return _.extend({}, state, extendObj);
	}

	return state;
}

const collectionOfItems = state => state.shelters.collectionOfItems,
	arrayOfItems = state => state.shelters.arrayOfItems,
	statusOfCreateItem = state => state.shelters.statusOfCreateItem,
	statusOfFetchItems = state => state.shelters.statusOfFetchItems,
	statusOfUpdateItem = state => state.shelters.statusOfUpdateItem,
	statusOfRemoveItem = state => state.shelters.statusOfRemoveItem,
	statusOfRemoveItemPrompt = state => state.shelters.statusOfRemoveItemPrompt,
	statusOfEditItem = state => state.shelters.statusOfEditItem,
	user = state => state.auth.userSession.user,
	googleMapsApiKey = state => state.util.apiKeys.googleMapsApiKey,
	statusOfCreateShelter = state => state.shelters.statusOfCreateShelter,
	newShelterPlace = state => state.shelters.newShelterPlace,
	itemExists = state => state.shelters.itemExists,
	currentShelterId = state => state.shelters.currentShelterId,
	didEnterShelter = state => state.shelters.didEnterShelter,
	newShelterId = state => state.shelters.newShelterId

export const selector = createStructuredSelector({
	googleMapsApiKey,
	collectionOfItems,
	arrayOfItems,
	statusOfCreateItem,
	statusOfFetchItems,
	statusOfUpdateItem,
	statusOfRemoveItem,
	statusOfRemoveItemPrompt,
	statusOfEditItem,
	statusOfCreateShelter,
	newShelterPlace,
	itemExists,
	user,
	currentShelterId,
	didEnterShelter,
	newShelterId
});
