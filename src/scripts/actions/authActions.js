import axios from "axios"
import { browserHistory } from "react-router"
import Cookies from "universal-cookie"
import {
    API_URL,
    CLIENT_ROOT_URL,
    LOADING_DATA,
    DATA_LOADED,
    errorHandler
} from "./index"
import {
    AUTH_USER,
    AUTH_ERROR,
    LOGIN_ERROR,
    REGISTER_ERROR,
    UNAUTH_USER,
    FORGOT_PASSWORD_REQUEST,
    RESET_PASSWORD_REQUEST,
    PROTECTED_TEST
} from "./types"

//= ===============================
// Authentication actions
//= ===============================

const cookies = new Cookies()

// TO-DO: Add expiration to cookie
export function loginUser({ email, password }) {
    return function(dispatch) {
        axios
            .post(`${API_URL}/auth/login`, { email, password })
            .then(response => {
                console.log(response)
                cookies.set("token", response.data.token, { path: "/" })
                cookies.set("user", response.data.user, { path: "/" })
                dispatch({ type: AUTH_USER, payload: response.data.user })
                //protectedTest(response.data.user)
                //window.location.href = `${CLIENT_ROOT_URL}/dashboard`;
                console.log(cookies.get("user"))
            })
            .catch(error => {
                console.log(error)
                errorHandler(dispatch, error.response, LOGIN_ERROR)
            })
    }
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
                console.log(response)
                console.log(response.data)
                cookies.set("token", response.data.token, { path: "/" })
                cookies.set("user", response.data.user, { path: "/" })
                dispatch({ type: AUTH_USER, payload: response.data.user })
            })
            .catch(error => {
                errorHandler(dispatch, error.response, REGISTER_ERROR)
            })
    }
}

export function logoutUser(error) {
    return function(dispatch) {
        dispatch({ type: UNAUTH_USER, payload: error || "" })
        cookies.remove("token", { path: "/" })
        cookies.remove("user", { path: "/" })
        console.log(cookies.get("user"))
        //window.location.href = `${CLIENT_ROOT_URL}/login`;
    }
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
        })

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
                })
            })
            .catch(error => {
                console.log(error.response)
                dispatch({
                    type: FORGOT_PASSWORD_REQUEST,
                    payload: {
                        stateOfSend: error.response.data.error,
                        sending: false,
                        sendSuccessful: false
                    }
                })
            })
    }
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
                })
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
                })
            })
    }
}

export function authenticate(user) {
    return function(dispatch) {
        axios
            .get(`${API_URL}/auth/authenticate`, {
                headers: { Authorization: cookies.get("token") }
            })
            .then(response => {
                if (response.data) {
                    if (response.data.authenticated) {
                        dispatch({
                            type: AUTH_USER,
                            payload: user
                        })
                    }
                }
            })
            .catch(error => {
                errorHandler(dispatch, error.response, AUTH_ERROR)
            })
    }
}
