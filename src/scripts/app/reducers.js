import { combineReducers } from "redux"
import { reducer as formReducer } from "redux-form"

import home from '../features/home/duck';
import user from '../util/index'
import nav from '../features/navbar/duck'
import auth from '../util/userAuthentication/duck'

const rootReducer = combineReducers({auth, user, nav, home, form: formReducer})

export default rootReducer
