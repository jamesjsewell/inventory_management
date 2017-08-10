import { combineReducers } from "redux"
import _ from "underscore"
import { createStructuredSelector } from "reselect"
import Cookies from "universal-cookie"

const cookies = new Cookies()

// actions
import {
	loginUser,
	registerUser,
	logoutUser,
	getForgotPasswordToken,
	resetPassword,
	authenticate
} from "../../util/userAuthentication/duck"

// reducers

// selectors
const activeNavTab = state => state.nav.navLink.activeNavTab
const sidebarVisible = state => state.nav.sidebar.sidebarVisible
const authenticated = state => state.auth.authenticated
//NEED ONE FOR REGISTER ERROR
//NEED ONE FOR LOGIN ERROR
//SEND SUCCESSFUL 
//STATE OF SEND

export const selector = createStructuredSelector({
	activeNavTab,
	sidebarVisible,
	authenticated
})
