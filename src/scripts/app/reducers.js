import { combineReducers } from "redux"
import { reducer as formReducer } from "redux-form"
// import authReducer from './authReducer';
// import userReducer from './userReducer';
// import navReducer from './navReducer'
// import dataReducer from './dataReducer'

// const rootReducer = combineReducers({
//   form: formReducer,
//   auth: authReducer,
//   user: userReducer,
//   nav: navReducer,
//   data: dataReducer
// });

import home from '../features/home/duck';
import user from '../util/index'
import nav from '../features/navbar/duck'
import auth from '../util/userAuthentication/duck'

const rootReducer = combineReducers({auth, auth, nav, home})

export default rootReducer
