import { getAPIkey } from "../../util/index.js"
import { combineReducers } from "redux"
import { createStructuredSelector } from "reselect"



// actions
export { getAPIkey }

// const init_map = {
    

// }

// function mapsReducer(state = init_user_profile, action) {
//     switch (action.type) {
//         case GET_API_KEY:
//             return _.extend({}, state, {
//                 mapsApiKey: action.payload
//             })
//     }

//     return state
// }

// export default combineReducers({
// 	maps: mapsReducer
// })

// selectors

const googleMapsApiKey = state => state.util.apiKeys.googleMapsApiKey


export const selector = createStructuredSelector({
	googleMapsApiKey 
})




