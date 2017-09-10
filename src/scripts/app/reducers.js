import { combineReducers } from "redux"
import { reducer as formReducer } from "redux-form"

import home from '../features/home/duck';
import nav from '../features/navbar/duck'
import auth from '../util/userAuthentication/duck'
import editProfile from '../features/userProfile/duck'
import util from '../util/index.js'
import needsPollReducer from '../features/needsPoll/duck.js'
import sheltersReducer from '../features/shelters/duck.js'

const rootReducer = combineReducers({auth, editProfile, nav, home, util, form: formReducer, needsPoll: needsPollReducer, shelters: sheltersReducer })

export default rootReducer
