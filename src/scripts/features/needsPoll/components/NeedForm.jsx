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
    alphaNumeric,
    number,
    asyncValidate,
    shouldAsyncValidate
} from "../../../util/formValidation/formValidation.js";
import { FormField } from "../../../components/forms/fields/formField.js";

class NeedForm extends Component {
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
        console.log(formProps)
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
                    placeholder="name of need"
                    name="nameOfNeed"
                    component={FormField}
                    type="text"
                    label={"submit a need"}
                />

                <Field
                    placeholder={"units needed"}
                    name={"unitsRequired"}
                    component={FormField}
                    type="text"
                    label={"estimated amount needed"}
                    validate={[number]}
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
    form: "needForm",
    asyncValidate,
    asyncBlurFields: ["nameOfNeed"],
    shouldAsyncValidate
})(NeedForm);
