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

import { CollectionOfItems, ItemModel } from "../../models/shelters/shelter.js";

const NEW_ITEM = "new_item",
	FETCH_ITEMS = "fetch_items",
	REMOVE_ITEM = "remove_item",
	REMOVE_ITEM_PROMPT = "remove_item_prompt",
	UPDATE_ITEM = "update_item",
	EDIT_ITEM = "edit_item";

export function createItem(values, postedById, itemCollection) {
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
				members: postedById
			},
			{ wait: true, success: successCallback, error: errorCallback }
		);

		function successCallback(response) {
			dispatch({
				type: NEW_ITEM,
				payload: {
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

		itemCollection.fetch().then(
			response => {
				dispatch({
					type: FETCH_ITEMS,
					payload: {
						collection: itemCollection,
						arrayOfItems: itemCollection.models,
						status: {
							inProgress: false,
							success: response.error ? false : true,
							error: response.error ? true : false,
							idOfItem: null
						}
					}
				});
			},
			error => {
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
		);
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

export function resetStatus(statusOf) {
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
	}
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
		case NEW_ITEM:
			extendObj.statusOfCreateItem = action.payload.status;

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
	user = state => state.auth.userSession.user

export const selector = createStructuredSelector({
	collectionOfItems,
	arrayOfItems,
	statusOfCreateItem,
	statusOfFetchItems,
	statusOfUpdateItem,
	statusOfRemoveItem,
	statusOfRemoveItemPrompt,
	statusOfEditItem,
	user
});
