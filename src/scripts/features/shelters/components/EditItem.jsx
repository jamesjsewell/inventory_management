import axios from "axios";
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
    required,
    maxLength,
    minLength,
    alphaNumeric,
    email,
    shouldAsyncValidate,
    number
} from "../../../util/formValidation/formValidation.js";
import { FormField } from "../../../components/forms/fields/formField.js";
import { API_URL } from "../../../util/index.js";

var formDefaults = {};


const asyncValidate = (values, dispatch) => {
    var checkAsync = true;

    if (values.nameOfItem === formDefaults.nameOfItem) {
        checkAsync = false;
    }

    var request = axios.post(`${API_URL}/sheltersFeature/newShelterForm`, {
        values
    });

    if (checkAsync) {
        return request
            .then(response => {
                return;
            })
            .catch(error => {
                if (error.response.data) {
                    return error.response.data;
                }
            });
    } else {
        return new Promise((resolve, reject) => {
            resolve(undefined);
        });
    }
};

class EditItem extends Component {
    constructor(props) {
        super(props);
        this.state = { description: null };
        var model = this.props.collectionOfItems.get(this.props.idOfEditedItem);
        this.state.model = model;
        formDefaults.nameOfItem = this.state.model.get("nameOfItem");
        this.state.description = this.state.model.get("description");
    }

    componentWillMount() {}

    componentWillReceiveProps(nextProps) {

        var model = nextProps.collectionOfItems.get(this.props.idOfEditedItem);
        this.state.model = model;
        formDefaults.nameOfItem = this.state.model.get("nameOfItem");

    }

    handleDescriptionChange(event) {
        this.setState({ description: event.target.value });
    }

    handleOpenMessage() {
        this.state.messageIsOpen = true;

        this.state.messageIsOpen = setTimeout(() => {
            this.setState({ messageIsOpen: false });
            this.props.actions.resetStatusOfUpdate();
        }, 5000);
    }

    handleUpload(evt) {}

    removeProfileImage() {}

    handleFormSubmit(formProps) {
        var userInput = formProps;

        if (this.state.description) {
            userInput["description"] = this.state.description;
        }

        this.props.updateItem(
            this.props.idOfEditedItem,
            this.props.collectionOfItems,
            "edit",
            null,
            userInput
        );

        
        this.props.untouch(["nameOfItem", "description"]);
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

        if (this.state.model) {
            return (
                <Form
                    onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
                    size="huge"
                    padded
                    loading={false}
                >

                    {this.renderAlert()}

                    <Field
                        placeholder="enter name of item"
                        name="nameOfItem"
                        component={FormField}
                        type="text"
                        label="item name"
                        validate={[alphaNumeric]}
                        initialValues={{
                            nameOfItem: this.state.model.get("nameOfItem")
                        }}
                    />

                    <textarea
                        as={Segment}
                        basic
                        size="medium"
                        compact
                        id="description"
                        name="description"
                        value={this.state.description}
                        onChange={this.handleDescriptionChange.bind(this)}
                        placeholder={"enter a description for this item"}
                    />

                    <Segment>
                        <Button
                            padded
                            type="submit"
                            content="save"
                            loading={this.props.updatingProfile}
                        />
                    </Segment>

                </Form>
            );
        } else {
            return <div>could not find item</div>;
        }
    }
}

export default reduxForm({
    form: "editItemForm",
    asyncValidate,
    asyncBlurFields: ["nameOfItem"],
    shouldAsyncValidate,
    initialValues: formDefaults
})(EditItem);
