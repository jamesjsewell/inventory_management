import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import {
    Button,
    Grid,
    Segment,
    Input,
    Form,
    Header,
    Container,
    Message,
    Divider,
    Item,
    Label,
    Profile,
    Icon,
    Image,
    Modal
} from "semantic-ui-react";
import _ from "underscore";
import {
    shouldAsyncValidate,
    asyncValidate
} from "../../../../util/formValidation/inputFieldValidation.js";
import { FormField } from "../formField.js";

class InputField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageIsOpen: false
        };
    }

    componentWillMount() {}

    componentWillReceiveProps(nextProps) {}

    handleOpenMessage() {
        this.state.messageIsOpen = true;

        this.state.messageIsOpen = setTimeout(() => {
            this.setState({ messageIsOpen: false });
            this.props.actions.resetStatusOfUpdate();
        }, 2500);
    }

    handleFormSubmit(formProps) {
        var userInput = formProps;

        if (Object.keys(formProps).length > 0 && formProps.constructor === Object) {
            this.props.doThisOnSubmit(userInput);
        }
    }

    renderAlert() {
        if (this.props.errorMessage) {
            return (
                <div>

                    <span>

                        <strong>Error!</strong> {this.props.errorUpdating}

                    </span>

                </div>
            );
        }
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <Form
                onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
                size="large"
                padded
                widths="equal"
            >

                {this.renderAlert()}

                <Field
                    placeholder={this.props.inputPlaceholder}
                    name={this.props.inputName}
                    component={FormField}
                    type="text"
                    label={this.props.inputLabel}
                />
                <Button
                    onClick={e => {
                        //e.preventDefault();
                    }}
                    type="submit"
                >
                    submit
                </Button>
            </Form>
        );
    }
}

export default reduxForm({
    form: "inputField",
    asyncValidate,
    asyncBlurFields: ["username"],
    shouldAsyncValidate
})(InputField);
