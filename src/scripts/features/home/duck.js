import { combineReducers } from "redux"
import _ from "underscore"
import { createStructuredSelector } from "reselect"
const DO_SOMETHING_COOL = "myapp/home/DO_SOMETHING_COOL"
// Actions
export function doSomethingCool(what) {
    return {
        type: DO_SOMETHING_COOL
        // ...
    }
}
// Reducers
const initial_state = { dough: 30 }
function cookiesReducer(state = initial_state, action) {
    switch (action.type) {
        case DO_SOMETHING_COOL:
            return _.extend({}, state, { dough: 40 })
        default:
            return state
    }
}
export default combineReducers({
    cookies: cookiesReducer
    // ...
})
// Selectors
const authenticated = state => state.auth.authenticated
export const selector = createStructuredSelector({
    authenticated
})
