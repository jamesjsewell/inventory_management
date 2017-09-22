import axios from "axios";
import { combineReducers } from "redux";
import { browserHistory } from "react-router";
import Cookies from "universal-cookie";
import _ from "underscore";
import { API_URL, CLIENT_ROOT_URL, getToken } from "../index";
import { CollectionOfUsers, UserModel } from "../../models/user/UserModel.js";

import { createStructuredSelector } from "reselect";

export const types = {
	AUTH_USER: "auth_user",
	SET_LOGGED_IN_USER: "set_logged_in_user",
	UNAUTH_USER: "unauth_user",
	AUTH_ERROR: "auth_error",
	LOGIN_ERROR: "login_error",
	REGISTER_ERROR: "register_error",
	FORGOT_PASSWORD_REQUEST: "forgot_password_request",
	RESET_PASSWORD_REQUEST: "reset_password_request",
	PROTECTED_TEST: "protected_test",
	ADD_SHELTER_COOKIE: "add_shelter_cookie",
	REMOVE_SHELTER_COOKIE: "remove_shelter_cookie"
};

const {
	AUTH_USER,
	SET_LOGGED_IN_USER,
	UNAUTH_USER,
	AUTH_ERROR,
	LOGIN_ERROR,
	REGISTER_ERROR,
	FORGOT_PASSWORD_REQUEST,
	RESET_PASSWORD_REQUEST,
	PROTECTED_TEST,
	ADD_SHELTER_COOKIE,
	REMOVE_SHELTER_COOKIE
} = types;

const cookies = new Cookies();

// actions
// TO-DO: Add expiration to cookie
export function loginUser({ email, password }) {
	return function(dispatch) {
		axios
			.post(`${API_URL}/auth/login`, { email, password })
			.then(response => {
				console.log(response);
				cookies.set("token", response.data.token, { path: "/" });
				cookies.set("user", response.data.user, { path: "/" });
				dispatch({ type: AUTH_USER, payload: response.data.user });
				dispatch({ type: REMOVE_SHELTER_COOKIE, payload: "" });
			})
			.catch(error => {
				dispatch({
					type: LOGIN_ERROR,
					payload: "invalid email or password"
				});
			});
	};
}

export function registerUser({ email, firstName, lastName, password }) {
	return function(dispatch) {
		axios
			.post(`${API_URL}/auth/register`, {
				email,
				firstName,
				lastName,
				password
			})
			.then(response => {
				cookies.set("token", response.data.token, { path: "/" });
				cookies.set("user", response.data.user, { path: "/" });
				dispatch({ type: AUTH_USER, payload: response.data.user });

				dispatch({
					type: REMOVE_SHELTER_COOKIE,
					payload: ""
				});
			})
			.catch(error => {
				dispatch({
					type: REGISTER_ERROR,
					payload: "unable to create account"
				});
			});
	};
}

export function logoutUser(error) {
	return function(dispatch) {
		var shelterCookie = cookies.get("currentShelter");
		dispatch({
			type: UNAUTH_USER,
			payload: error
		});
		dispatch({
			type: ADD_SHELTER_COOKIE,
			payload: shelterCookie
		});
		cookies.remove("token", { path: "/" });
		cookies.remove("user", { path: "/" });
	};
}

export function getForgotPasswordToken({ email }) {
	return function(dispatch) {
		dispatch({
			type: FORGOT_PASSWORD_REQUEST,
			payload: {
				stateOfSend: "sending email",
				sending: true,
				sendSuccessful: false
			}
		});

		axios
			.post(`${API_URL}/auth/forgot-password`, { email })
			.then(response => {
				dispatch({
					type: FORGOT_PASSWORD_REQUEST,
					payload: {
						stateOfSend: "email sent",
						sending: false,
						sendSuccessful: true
					}
				});
			})
			.catch(error => {
				console.log(error.response);
				dispatch({
					type: FORGOT_PASSWORD_REQUEST,
					payload: {
						stateOfSend: error.response.data.error,
						sending: false,
						sendSuccessful: false
					}
				});
			});
	};
}

export function resetPassword(token, { password }) {
	return function(dispatch) {
		axios
			.post(`${API_URL}/auth/reset-password/${token}`, { password })
			.then(response => {
				dispatch({
					type: RESET_PASSWORD_REQUEST,
					payload: {
						message: response.data.message,
						didReset: response.data.didReset
					}
				});
				// Redirect to login page on successful password reset
				//browserHistory.push('/login');
			})
			.catch(error => {
				dispatch({
					type: RESET_PASSWORD_REQUEST,
					payload: {
						message: error.response.data.error,
						didReset: false
					}
				});
			});
	};
}

export function authenticate(user) {
	return function(dispatch) {
		axios
			.get(`${API_URL}/user/${user._id}`, {
				headers: { Authorization: cookies.get("token") }
			})
			.then(response => {
				if (response.data) {
					dispatch({
						type: AUTH_USER,
						payload: response.data
					});
				}
			})
			.catch(error => {});
	};
}

export function setShelterCookie() {
	return function(dispatch) {
		var shelterCookie = cookies.get("currentShelter");
		if (shelterCookie) {
			dispatch({
				type: ADD_SHELTER_COOKIE,
				payload: shelterCookie
			});
		}
	};
}

// reducers
const init_auth = {
	loginError: undefined,
	registerError: undefined,
	authError: undefined,
	authenticated: undefined,
	user: undefined,
	profile: undefined,
	shelterCookie: undefined
};

function userSessionReducer(state = init_auth, action) {
	switch (action.type) {
		case ADD_SHELTER_COOKIE:
			return _.extend({}, state, {
				shelterCookie: action.payload,
				user: undefined
			});

		case REMOVE_SHELTER_COOKIE:
			return _.extend({}, state, { shelterCookie: undefined });

		case AUTH_USER: {
			return _.extend({}, state, {
				authenticated: true,
				user: action.payload,
				profile: action.payload.profile,
				loginError: undefined,
				shelterCookie: undefined
			});
		}

		case UNAUTH_USER: {
			return _.extend({}, state, {
				authenticated: false,
				loginError: undefined,
				registerError: undefined,
				user: undefined
			});
		}

		case AUTH_ERROR: {
			return _.extend({}, state, { auth_error: action.payload });
		}

		case LOGIN_ERROR: {
			return _.extend({}, state, {
				loginError: true
			});
		}

		case REGISTER_ERROR: {
			return _.extend({}, state, {
				registerError: action.payload,
				loginError: undefined
			});
		}

		// case PROTECTED_TEST: {
		//   return _.extend( {}, state, { content: action.payload.message } );
		// }

		// case GET_API_KEY: {
		//   return _.extend( {}, state, { filestackAPIkey: action.payload})
		// }
	}

	return state;
}

const init_forgot_password = {
	emailSendSuccessful: undefined,
	stateOfEmailSend: undefined,
	sendingEmail: undefined,
	didPasswordReset: undefined,
	stateOfReset: undefined,
	shelterCookie: undefined
};

function forgotPasswordReducer(state = init_forgot_password, action) {
	switch (action.type) {
		case FORGOT_PASSWORD_REQUEST: {
			return _.extend({}, state, {
				stateOfEmailSend: action.payload.stateOfSend,
				sendingEmail: action.payload.sending,
				emailSendSuccessful: action.payload.sendSuccessful
			});
		}

		case RESET_PASSWORD_REQUEST: {
			return _.extend({}, state, {
				didPasswordReset: action.payload.didReset,
				stateOfReset: action.payload.message
			});
		}
	}

	return state;
}

export default combineReducers({
	userSession: userSessionReducer,
	forgotPassword: forgotPasswordReducer
});

const routes = state => state.nav.navLink.routes,
	user = state => state.auth.userSession.user,
	authenticated = state => state.auth.userSession.authenticated,
	shelterCookie = state => state.auth.userSession.shelterCookie;

export const selector = createStructuredSelector({
	routes,
	user,
	authenticated,
	shelterCookie
});
