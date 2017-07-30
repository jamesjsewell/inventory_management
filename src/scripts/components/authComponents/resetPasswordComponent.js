import React, { Component } from "react"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"
import { resetPassword } from "../../actions/authActions.js"
import { Button, Grid, Segment, Input, Form, Message } from "semantic-ui-react"
import { Link } from "react-router-dom"
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
    form: "resetPassword",
    validate
})

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
        const { handleSubmit } = this.props

        return (
            <Form
                onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
                inverted={this.props.isInverted}
            >

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
                    visible={this.state.messageShowing ? true : false}
                    hidden={this.state.messageShowing ? false : true}
                    floating
                    content={this.props.stateOfReset}
                />

                {this.props.didReset
                    ? <Link to="/login">login</Link>
                    : <Button
                          type="submit"
                          loading={this.state.dispatchedReset}
                      >
                          reset password
                      </Button>}

            </Form>
        )
    }
}

function mapStateToProps(state) {
    return {
        didReset: state.auth.didPasswordReset,
        stateOfReset: state.auth.stateOfReset
    }
}

export default connect(mapStateToProps, { resetPassword })(form(ResetPassword))
