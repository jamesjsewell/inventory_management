import axios from "axios";
import _ from "underscore";
import { SubmissionError } from "redux-form";
import Cookies from "universal-cookie";
import { combineReducers } from "redux";
export const API_URL = "/api";
export const CLIENT_ROOT_URL = "https://localhost:8080";
export const types = {
    FETCH_USER: "fetch_user",
    GET_FILESTACK_API_KEY: "get_filestack_api_key",
    GET_GOOGLE_MAPS_KEY: "get_google_maps_key"
};
const { FETCH_USER, GET_API_KEY, GET_FILESTACK_API_KEY, GET_GOOGLE_MAPS_KEY } = types;

// reads cookies for an auth token and user
const cookies = new Cookies();
export function getToken() {
    return cookies.get("token");
}
var user = cookies.get("user");

//= ===============================
// Utility actions
//= ===============================

export function fetchUser(uid) {
    return function(dispatch) {
        axios
            .get(`${API_URL}/user/profile/${uid}`, {
                headers: { Authorization: getToken() }
            })
            .then(response => {
                dispatch({
                    type: FETCH_USER,
                    payload: response.data.user
                });
            })
            .catch(response => dispatch());
    };
}

// Post Request
export function postData(action, errorType, isAuthReq, url, dispatch, data) {
    const requestUrl = API_URL + url;
    let headers = {};

    if (isAuthReq) {
        headers = { headers: { Authorization: getToken() } };
    }

    axios
        .post(requestUrl, data, headers)
        .then(response => {
            dispatch({
                type: action,
                payload: response.data
            });
        })
        .catch(error => {console.log(error.response)});
}

// Get Request
export function getData(action, errorType, isAuthReq, url, dispatch) {
    const requestUrl = API_URL + url;
    let headers = {};

    if (isAuthReq) {
        headers = { headers: { Authorization: getToken() } };
    }

    axios
        .get(requestUrl, headers)
        .then(response => {
            dispatch({
                type: action,
                payload: response.data
            });
        })
        .catch(error => {});
}

// Put Request
export function putData(
    action,
    errorPayload,
    isAuthReq,
    url,
    dispatch,
    data,
    additionalPayload
) {
    const requestUrl = API_URL + url;
    let headers = {};

    if (isAuthReq) {
        headers = { headers: { Authorization: getToken() } };
    }

    axios
        .put(requestUrl, data, headers)
        .then(response => {
            dispatch({
                type: action,
                payload: _.extend({}, response.data, additionalPayload)
            });
        })
        .catch(error => {
            dispatch({
                type: action,
                payload: _.extend(
                    {},
                    { error: error.response.data.error },
                    errorPayload
                )
            });
        });
}

// Delete Request
export function deleteData(action, errorType, isAuthReq, url, dispatch) {
    const requestUrl = API_URL + url;
    let headers = {};

    if (isAuthReq) {
        headers = { headers: { Authorization: getToken() } };
    }

    axios
        .delete(requestUrl, headers)
        .then(response => {
            dispatch({
                type: action,
                payload: response.data
            });
        })
        .catch(error => {});
}

// static page actions
export function getAPIkey(key) {

    var dispatchType = "";
    if (key === "FILESTACK_KEY") {
        dispatchType = GET_FILESTACK_API_KEY;
    }

    if(key === "GOOGLE_MAPS_KEY"){
        dispatchType = GET_GOOGLE_MAPS_KEY
    }
    return function(dispatch) {
        axios
            .post(`${API_URL}/env/request-api-key`, {
                key: key
            })
            .then(response => {
                dispatch({
                    type: dispatchType,
                    payload: response.data.key
                });
            })
            .catch(error => {
                console.log(error);
            });
    };
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
                });
            })
            .catch(error => {});
    };
}

const init_api_keys = { filestackApiKey: undefined, googleMapsApiKey: undefined };
function apiKeysReducer(state = init_api_keys, action) {
    switch (action.type) {
        case GET_FILESTACK_API_KEY:
            return _.extend({}, state, {
                filestackApiKey: action.payload
            });
        case GET_GOOGLE_MAPS_KEY:
            return _.extend({}, state, {
                googleMapsApiKey: action.payload
            });
    }

    return state;
}

export default combineReducers({
    apiKeys: apiKeysReducer
});
