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
// no reducers yet

// selectors

//user session selectors
const loginError = state => state.auth.userSession.loginError,
	registerError = state => state.auth.userSession.registerError,
	authenticated = state => state.auth.userSession.authenticated,
	user = state => state.auth.userSession.user

//request new password selectors
const stateOfEmailSend = state => state.auth.forgotPassword.stateOfEmailSend,
	sendingEmail = state => state.auth.forgotPassword.sendingEmail,
	emailSendSuccessful = state => state.auth.forgotPassword.emailSendSuccessful

//reset password
const didPasswordReset = state => state.auth.forgotPassword.didPasswordReset,
	stateOfReset = state => state.auth.forgotPassword.stateOfReset

export const selector = createStructuredSelector({
	stateOfEmailSend,
	sendingEmail,
	emailSendSuccessful,
	loginError,
	registerError,
	authenticated,
	didPasswordReset,
	stateOfReset
})
