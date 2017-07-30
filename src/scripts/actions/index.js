import axios from "axios"
import _ from "underscore"
import { logoutUser } from "./authActions"
import {
    STATIC_ERROR,
    LOGIN_ERROR,
    REGISTER_ERROR,
    FETCH_USER,
    LOADING_DATA,
    DATA_LOADED,
    AUTH_ERROR,
    GET_API_KEY
} from "./types"

export const API_URL = "/api"
export const CLIENT_ROOT_URL = "https://localhost:8080"
import { SubmissionError } from "redux-form"

import Cookies from "universal-cookie"
const cookies = new Cookies()
function getToken() {
    return cookies.get("token")
}
var user = cookies.get("user")

//= ===============================
// Utility actions
//= ===============================

export function fetchUser(uid) {
    return function(dispatch) {
        axios
            .get(`${API_URL}/user/${uid}`, {
                headers: { Authorization: getToken() }
            })
            .then(response => {
                dispatch({
                    type: FETCH_USER,
                    payload: response.data.user
                })
            })
            .catch(response => dispatch(errorHandler(response.data.error)))
    }
}

export function errorHandler(dispatch, error, type) {
    console.log("Error type: ", type)
    console.log(error)

    let errorMessage = error.response ? error.response.data : error

    if (type === LOGIN_ERROR) {
        errorMessage = error.data ? error.data : error
    }
    if (type === REGISTER_ERROR) {
        errorMessage = error.data.error ? error.data.error : error
    }
    if (type === AUTH_ERROR) {
        if (error.status || error.response.status) {
            if (error.status === 401 || error.response.status === 401) {
                errorMessage = "You are not authorized to do this."
                return dispatch(logoutUser(errorMessage))
            }
        }
    }

    dispatch({
        type,
        payload: errorMessage
    })

    // if (error.status === 401 || error.response.status === 401) {
    //     errorMessage = "You are not authorized to do this."
    //     return dispatch(logoutUser(errorMessage))
    // }
}

// Post Request
export function postData(action, errorType, isAuthReq, url, dispatch, data) {
    const requestUrl = API_URL + url
    let headers = {}

    if (isAuthReq) {
        headers = { headers: { Authorization: getToken() } }
    }

    axios
        .post(requestUrl, data, headers)
        .then(response => {
            dispatch({
                type: action,
                payload: response.data
            })
        })
        .catch(error => {
            errorHandler(dispatch, error.response, errorType)
        })
}

// Get Request
export function getData(action, errorType, isAuthReq, url, dispatch) {
    const requestUrl = API_URL + url
    let headers = {}

    if (isAuthReq) {
        headers = { headers: { Authorization: getToken() } }
    }

    axios
        .get(requestUrl, headers)
        .then(response => {
            dispatch({
                type: action,
                payload: response.data
            })
        })
        .catch(error => {
            errorHandler(dispatch, error.response, errorType)
        })
}

// Put Request
export function putData(action, errorPayload, isAuthReq, url, dispatch, data, additionalPayload) {
    const requestUrl = API_URL + url
    let headers = {}

    if (isAuthReq) {
        headers = { headers: { Authorization: getToken() } }
    }

    axios
        .put(requestUrl, data, headers)
        .then(response => {
        
            dispatch({
                type: action,
                payload: _.extend({}, response.data, additionalPayload)
            })
        })
        .catch(error => {
            dispatch({
                type: action,
                payload: _.extend({}, {error: error.response.data.error}, errorPayload)
            })
        })
}

// Delete Request
export function deleteData(action, errorType, isAuthReq, url, dispatch) {
    const requestUrl = API_URL + url
    let headers = {}

    if (isAuthReq) {
        headers = { headers: { Authorization: getToken() } }
    }

    axios
        .delete(requestUrl, headers)
        .then(response => {
            dispatch({
                type: action,
                payload: response.data
            })
        })
        .catch(error => {
            errorHandler(dispatch, error.response, errorType)
        })
}

//= ===============================
// Static Page actions
//= ===============================
export function getAPIkey(key){
    return function(dispatch) {
        axios.post(`${API_URL}/env/request-api-key`, {
            key
        })
        .then(response => {
            dispatch({
                type: GET_API_KEY,
                payload: response.data.key
            })
        })
        .catch(error => {
            console.log(error)
            errorHandler(dispatch, error.response, STATIC_ERROR)
        })
    }
}
export function sendContactForm({ name, emailAddress, message }) {
    return function(dispatch) {
        axios
            .post(`${API_URL}/communication/contact`, {
                name,
                emailAddress,
                message
            })
            .then(response => {
                dispatch({
                    type: SEND_CONTACT_FORM,
                    payload: response.data.message
                })
            })
            .catch(error => {
                errorHandler(dispatch, error.response, STATIC_ERROR)
            })
    }
}
//Contact GitHub API Training Shop Blog About
