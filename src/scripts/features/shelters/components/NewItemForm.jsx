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
    required,
    asyncValidate,
    shouldAsyncValidate
} from "../../../util/formValidation/formValidation.js";
import { FormField } from "../../../components/forms/fields/formField.js";

class NewItemForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageIsOpen: false,
            message: null,
            description: null
        };
    }

    componentWillMount() {}

    componentWillReceiveProps(nextProps) {
        if(nextProps.addedItem){
            this.handleOpenMessage()
            this.state.message="added item"
        }

        if(nextProps.errorAddingItem){
            this.handleOpenMessage()
            this.state.message="something went wrong"
        }
    }

    handleOpenMessage() {
        this.state.messageIsOpen = true;

        this.state.messageIsOpen = setTimeout(() => {
            this.props.resetStatus('addingItem')
            this.setState({ messageIsOpen: false, message: null, description: null });
        }, 5000);
    }

    handleFormSubmit(formProps) {
        var userInput = formProps;

        if (
            Object.keys(formProps).length > 0 &&
            formProps.constructor === Object
        ) {
            if (this.state.description) {
                userInput["description"] = this.state.description;
            }
            this.props.doThisOnSubmit(userInput);
            this.props.reset();
            this.props.untouch(["nameOfItem", "description"]);
        }
    }

    handleDescriptionChange(event) {
        this.setState({ description: event.target.value });
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
                size="large"
            >

                {this.renderAlert()}

                <Segment.Group horizontal size="large">

                    <Segment size="large">
                        <Field
                            placeholder="enter name of location"
                            name="nameOfItem"
                            component={FormField}
                            type="text"
                            label={"name of location"}
                            validate={[required, alphaNumeric]}
                        />

                        {this.state.messageIsOpen
                    ? <Message positive={this.props.addedItem} negative={this.props.errorAddingItem}> {this.state.message}</Message>
                    : null}
                    </Segment>

                    <Segment size="large">

                        <textarea
                            as={Segment}
                            basic
                            size="medium"
                            compact
                            id="description"
                            name="description"
                            value={this.state.description}
                            onChange={this.handleDescriptionChange.bind(this)}
                            placeholder={"enter a description for this location"}
                        />

                    </Segment>
                </Segment.Group>

                <Button
                    basic
                    type="submit"
                >
                    submit
                </Button>


            </Form>
        );
    }
}

export default reduxForm({
    form: "itemForm",
    asyncValidate,
    asyncBlurFields: ["nameOfItem"],
    shouldAsyncValidate
})(NewItemForm);
