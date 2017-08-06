import axios from "axios"
import _ from "underscore"
import { SubmissionError } from "redux-form"
import Cookies from "universal-cookie"
import { combineReducers } from "redux"
export const API_URL = "/api"
export const CLIENT_ROOT_URL = "https://localhost:8080"
export const types = { FETCH_USER: "fetch_user", GET_API_KEY: "get_api_key" }
const { FETCH_USER, GET_API_KEY } = types

// reads cookies for an auth token and user
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
            .catch(response => dispatch())
    }
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
            
        })
}

// static page actions
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
                
            })
    }
}

const init_user = {
    user: undefined
}

function userReducer(state = init_user, action) {
    switch (action.type) {
        case FETCH_USER: {
            return _.extend({}, state, {
                user: action.payload
            })
        }
    }

    return state
}

export default combineReducers({
    user: userReducer
})

