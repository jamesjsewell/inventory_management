import React, { Component } from "react"
import { Field, reduxForm } from "redux-form"
import { Button, Grid, Segment, Input, Form, Message } from "semantic-ui-react"
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

const form = reduxForm({
    form: "forgotPassword",
    validate,
    blurFields: ["emailConfirm"]
})

function validate(formProps) {
    const errors = {}

    if (!formProps.email) {
        errors.email = "enter your email"
    }

    if (!formProps.emailConfirm) {
        errors.emailConfirm = "confirm your email"
    }

    if (formProps.email !== formProps.emailConfirm) {
        errors.emailConfirm = "emails must match"
    }

    return errors
}

class ForgotPassword extends Component {
    constructor(props) {
        super(props)
        this.state = { messageShowing: false }
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.sendSuccessful === true ||
            nextProps.sendSuccessful === false
        ) {
            this.handleShowMessage()
        }
    }

    handleShowMessage() {
        this.state.messageShowing = true

        this.state.messageShowing = setTimeout(() => {
            this.setState({ messageShowing: false })
        }, 2500)
    }

    render() {
        const {
            handleSubmit,
            sendSuccessful,
            stateOfSend,
            sendingEmail,
            requestPasswordAction
        } = this.props

        return (
            <Form onSubmit={handleSubmit((formProps)=>{requestPasswordAction(formProps)})}>

                {sendSuccessful
                    ? <Segment>check your email and follow the link</Segment>
                    : <Field
                          name="email"
                          component={FormField}
                          type="text"
                          label="enter your email"
                          placeholder="enter email"
                          validate={[required, email, minLength(2)]}
                          warn={[required, minLength(2)]}
                          required={false}
                      />}

                {sendSuccessful
                    ? <div />
                    : <Field
                          name="emailConfirm"
                          component={FormField}
                          type="text"
                          placeholder="confirm email"
                          validate={[required, email, minLength(2)]}
                          warn={[required, minLength(2)]}
                          required={false}
                      />}

                <Message
                    visible={this.state.messageShowing ? true : false}
                    hidden={this.state.messageShowing ? false : true}
                    floating
                    content={stateOfSend}
                />

                <Button type="submit" loading={sendingEmail}>
                    {sendSuccessful ? "resend email" : "send email"}
                </Button>

            </Form>
        )
    }
}

export default form(ForgotPassword)
