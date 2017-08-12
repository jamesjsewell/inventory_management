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
export {
	loginUser,
	registerUser,
	logoutUser,
	getForgotPasswordToken,
	resetPassword,
	authenticate
}
// reducers

// selectors

//user session selectors

const loginError = state => state.auth.userSession.loginError,
	registerError = state => state.auth.userSession.registerError,
	authenticated = state => state.auth.userSession.authenticated,
	user = state => state.auth.userSession.user

//password reset selectors
const stateOfPasswordSend = state =>
	state.auth.passwordReset.stateOfPasswordSend,
	sendingPassword = state => state.auth.passwordReset.sendingPassword,
	passwordSendSuccessful = state =>
		state.auth.passwordReset.passwordSendSuccessful

export const selector = createStructuredSelector({
	stateOfPasswordSend,
	sendingPassword,
	passwordSendSuccessful,
	loginError,
	registerError,
	authenticated
})
