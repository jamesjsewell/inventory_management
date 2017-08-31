import { combineReducers } from "redux"
import { createStructuredSelector } from "reselect"
import _ from "underscore"
import axios from "axios"
import {
	API_URL,
	fetchUser,
	postData,
	getData,
	putData,
	deleteData,
	getAPIkey,
	getToken
} from "../../util/index.js"
const FETCH_USER = "fetch_user"





// reducers

const init_needs_poll = {
    test: undefined,

}

export default function needsPollReducer(state = init_needs_poll, action) {
    switch (action.type) {
        case "GET_USER_PROFILE":
            return _.extend({}, state, {
                profile: action.payload.user.profile,
                username: action.payload.user.username
            })
    }

    return state
}

// export default combineReducers({
// 	needsPoll: needsPollReducer
// })

// selectors

const user = state => state


export const selector = createStructuredSelector({
	user,
})
