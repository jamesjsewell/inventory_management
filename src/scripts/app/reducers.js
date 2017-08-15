import { combineReducers } from "redux"
import { reducer as formReducer } from "redux-form"

import home from '../features/home/duck';
import nav from '../features/navbar/duck'
import auth from '../util/userAuthentication/duck'
import editProfile from '../features/userProfile/duck'

const rootReducer = combineReducers({auth, editProfile, nav, home, form: formReducer})

export default rootReducer
