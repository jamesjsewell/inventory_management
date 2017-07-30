import React, { Component } from "react"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"
import { registerUser } from "../../actions/authActions.js"
import { Button, Grid, Segment, Input, Form } from "semantic-ui-react"
import { FormField } from "../formHelpers/formFields.js"
import {
    required,
    maxLength,
    minLength,
    alphaNumeric,
    email,
    shouldAsyncValidate,
    asyncValidate
} from "../formHelpers/formValidation.js"

const form = reduxForm({
    form: "register",
    asyncValidate,
    asyncBlurFields: ["email", "passwordConfirm", "emailConfirm"],
    shouldAsyncValidate
})

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = { dispatchedRegister: false }
    }

    handleFormSubmit(formProps) {
        this.props.registerUser(formProps)
        this.state.dispatchedRegister = true
    }

    renderAlert() {
        if (this.props.errorMessage) {
            return (
                <Segment color="red" compact>
                    <span>
                        <strong>Registration Error: </strong>
                        {" "}
                        {this.props.errorMessage}
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
        console.log(this.props)

        return (
            <Form
                onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
                inverted={this.props.isInverted}
            >
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

function mapStateToProps(state) {
    return {
        errorMessage: state.auth.registerError,
        message: state.auth.message,
        authenticated: state.auth.authenticated
    }
}

export default connect(mapStateToProps, { registerUser })(form(Register))
