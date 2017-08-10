import React, { Component } from "react"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"
import { Link } from "react-router-dom"
import { loginUser } from "../../actions/authActions"
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
    email
} from "../../../util/formValidation/formValidation.js"
import { FormField } from "../../../components/forms/fields/formField.js"

const form = reduxForm({
    form: "loginForm",
    asyncValidate,
    asyncBlurFields: ["email", "password"],
    shouldAsyncValidate
})

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = { dispatchedLogin: false }
    }

    renderAlert() {
        if (this.props.errorMessage) {
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
        const { handleSubmit, pristine, reset, submitting } = this.props

        return (
            <Form
                onSubmit={handleSubmit(this.props.loginSubmit.bind(this))}
                size="huge"
                padded
                inverted={this.props.isInverted}
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
                    className="btn btn-primary"
                    loading={this.state.dispatchedLogin ? true : false}
                >
                    Login
                </Button>

            </Form>
        )
    }
}

export default form(Login)
