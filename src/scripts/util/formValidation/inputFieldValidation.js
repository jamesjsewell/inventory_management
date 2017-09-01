import axios from "axios"
import { API_URL } from "../index.js"

//for async validation with redux form
export const asyncValidate = (values, dispatch, validationType) => {
    
    var request = axios.post(`${API_URL}/forms/validate`, {
        values
    })

    return request
        .then(response => {
            return
        })
        .catch(error => {
            console.log(error.response.data)
            if (error.response.data) {
                return(error.response.data)
            }
        })
}

export function shouldAsyncValidate(params) {
    if (!params.syncValidationPasses) {
        return false
    }
    switch (params.trigger) {
        case "blur":
            // blurring
            return true
        case "submit":
            // submitting, so only async validate if form is dirty or was never initialized
            // conversely, DON'T async validate if the form is pristine just as it was initialized
            // return !params.pristine || !params.initialized
            return false
        default:
            return false
    }
}