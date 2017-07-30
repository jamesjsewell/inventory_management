import axios from "axios"
import { API_URL } from "../../actions/index.js"

export const required = value => (value ? undefined : "Required")

export const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? "Invalid email address"
        : undefined

export const phoneNumber = value =>
    value && !/^(0|[1-9][0-9]{9})$/i.test(value)
        ? "Invalid phone number, must be 10 digits"
        : undefined

export const alphaNumeric = value =>
    value && /[^a-zA-Z0-9 ]/i.test(value)
        ? "Only alphanumeric characters"
        : undefined

export const maxLength = max => value =>
    value && value.length > max
        ? `Must be ${max} characters or less`
        : undefined
//export const maxLength15 = maxLength(15)

export const minLength = min => value =>
    value && value.length < min
        ? `Must be ${min} characters or more`
        : undefined
//export const minLength2 = minLength(2)

export const number = value =>
    value && isNaN(Number(value)) ? "Must be a number" : undefined

export const minValue = min => value =>
    value && value < min ? `Must be at least ${min}` : undefined
//export const minValue18 = minValue(18)

export const tooOld = value =>
    value && value > 65 ? "You might be too old for this" : undefined

export const aol = value =>
    value && /.+@aol\.com/.test(value)
        ? "Really? You still use AOL for your email?"
        : undefined

//for async validation with redux form
export const asyncValidate = (values, dispatch, validationType) => {
    console.log("values", values)
    var request = axios.post(`${API_URL}/auth/validate`, {
        values
    })

    return request
        .then(response => {
            return
        })
        .catch(error => {
            console.log(error.response)
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
            return !params.pristine || !params.initialized
            //return false
        default:
            return false
    }
}
