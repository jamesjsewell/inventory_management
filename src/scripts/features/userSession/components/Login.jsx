import React, { Component } from "react"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"
import { Link } from "react-router-dom"
import {
    Button,
    Grid,
    Segment,
    Input,
    Form,
    Header,
    Icon
} from "semantic-ui-react"
import {
    required,
    maxLength,
    minLength,
    alphaNumeric,
    email,
    asyncValidate,
    shouldAsyncValidate
} from "../../../util/formValidation/formValidation.js"
import { FormField } from "../../../components/forms/fields/formField.js"

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = { dispatchedLogin: false }
    }

    handleLoginSubmit(formProps) {
        this.props.loginAction(formProps)
        this.state.dispatchedLogin = true
    }

    renderAlert() {
        if (this.props.loginError) {
            return (
                <Segment color="red" compact>

                    <span>

                        <strong>Login Error: </strong>
                        {" "}
                        {"invalid email address or password"}

                    </span>

                </Segment>
            )
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errorMessage) {
            this.state.dispatchedLogin = false
        }
    }

    render() {
        const {
            handleSubmit,
            pristine,
            reset,
            submitting,
            loginError
        } = this.props

        return (
            <Form
                onSubmit={handleSubmit(this.handleLoginSubmit.bind(this))}
                size="huge"
                padded
            >

                {this.renderAlert()}

                <Field
                    name="email"
                    component={FormField}
                    type="text"
                    placeholder="email"
                    validate={[required, email]}
                    warn={[required]}
                    required={false}
                />

                <Field
                    name="password"
                    component={FormField}
                    type="password"
                    placeholder="password"
                    validate={[required]}
                    warn={[required]}
                    required={false}
                />

                <Button
                    type="submit"
                    loading={this.state.dispatchedLogin ? true : false}
                >
                    Login
                </Button>

            </Form>
        )
    }
}

export default reduxForm({
    form: "loginForm"
})(Login)
