import React, { Component } from "react"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"
import { Button, Grid, Segment, Input, Form } from "semantic-ui-react"

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

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = { dispatchedRegister: false }
    }

    handleRegisterSubmit(formProps) {
        this.props.registerAction(formProps)
    }

    renderAlert() {
        if (this.props.registerError) {
            return (
                <Segment color="red" compact>
                    <span>
                        <strong>Registration Error: </strong>
                        {" "}
                        {this.props.registerError}
                    </span>
                </Segment>
            )
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errorMessage) {
            this.state.dispatchedRegister = false
        }
    }

    render() {
        const { handleSubmit } = this.props

        return (
            <Form onSubmit={handleSubmit(this.handleRegisterSubmit.bind(this))}>
                {this.renderAlert()}

                <Field
                    name="email"
                    component={FormField}
                    type="text"
                    label="email"
                    placeholder="email"
                    validate={[required, email, minLength(2)]}
                    warn={[required, minLength(2)]}
                    required={false}
                />

                <Field
                    name="emailConfirm"
                    component={FormField}
                    type="text"
                    placeholder="type your email again"
                    validate={[required, email, minLength(2)]}
                    warn={[required, minLength(2)]}
                    required={false}
                />

                <Field
                    name="password"
                    component={FormField}
                    type="password"
                    label="password"
                    placeholder="password"
                    validate={[required, minLength(6), maxLength(14)]}
                    warn={[required, minLength(6)]}
                    required={false}
                />

                <Field
                    name="passwordConfirm"
                    component={FormField}
                    type="password"
                    placeholder="confirm password"
                    validate={[required]}
                    warn={[required]}
                    required={false}
                />

                <Button type="submit" loading={this.state.dispatchedRegister}>
                    register
                </Button>

            </Form>
        )
    }
}
const formConfig = {
    form: "register",
    asyncValidate,
    asyncBlurFields: ["email", "passwordConfirm", "emailConfirm"],
    shouldAsyncValidate
}
const registerContainer = reduxForm(formConfig)(Register)
export default registerContainer
