import React, { Component } from "react"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"
import {
    Button,
    Grid,
    Segment,
    Input,
    Form,
    Message,
    Link
} from "semantic-ui-react"

import {
    required,
    maxLength,
    minLength,
    alphaNumeric,
    email,
    shouldAsyncValidate,
    asyncValidate
} from "../../../util/formValidation/formValidation.js"
import { FormField } from "../../../components/forms/fields/formField.js"

function validate(formProps) {
    const errors = {}

    if (!formProps.password) {
        errors.password = "enter your password"
    }

    if (!formProps.passwordConfirm) {
        errors.passwordConfirm = "confirm your password"
    }

    if (formProps.password !== formProps.passwordConfirm) {
        errors.passwordConfirm = "passwords must match"
    }

    return errors
}

class ResetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = { dispatchedReset: false }
    }

    handleFormSubmit({ password }) {
        const resetToken = this.props.match.params.resetToken
        this.props.resetPassword(resetToken, { password })
        this.state.dispatchedReset = true
    }

    handleShowMessage() {
        this.state.messageShowing = true

        this.state.messageShowing = setTimeout(() => {
            this.setState({ messageShowing: false })
        }, 2500)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.didReset || nextProps.stateOfReset) {
            this.state.dispatchedReset = false
            this.handleShowMessage()
        }
    }

    render() {
        const { handleSubmit, didPasswordReset, stateOfReset } = this.props
        console.log(didPasswordReset)

        return (
            <Form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>

                <Field
                    name="password"
                    component={FormField}
                    type="password"
                    label="enter new password"
                    placeholder="new password"
                    validate={[required, minLength(2)]}
                    warn={[required, minLength(2)]}
                    required={false}
                />

                <Field
                    name="passwordConfirm"
                    component={FormField}
                    type="password"
                    placeholder="confirm new password"
                    validate={[required]}
                    warn={[required]}
                    required={false}
                />

                <Message
                    hidden={stateOfReset && !didPasswordReset ? false : true}
                >
                    {stateOfReset}
                </Message>

                <Button
                    disabled={didPasswordReset || stateOfReset ? true : false}
                    type="submit"
                >
                    reset password
                </Button>

            </Form>
        )
    }
}

const formConfig = {
    form: "resetPassword",
    validate
}
const resetPasswordContainer = reduxForm(formConfig)(ResetPassword)
export default resetPasswordContainer
