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
    shouldAsyncValidate
} from "../../../util/formValidation/formValidation.js";
import { FormField } from "../../../components/forms/fields/formField.js";
import { API_URL } from "../../../util/index.js";
import axios from "axios";
var shelter = "";
//for async validation with redux form
const asyncValidate = (values, dispatch, validationType) => {
    if (values.nameOfNeed) {
        values.shelter = shelter;
        var request = axios.post(`${API_URL}/needsPoll/newNeedForm`, {
            values
        });
    } else {
        var request = axios.post(`${API_URL}/forms/validate`, {
            values
        });
    }

    return request
        .then(response => {
            return;
        })
        .catch(error => {
            console.log(error.response.data);
            if (error.response.data) {
                return error.response.data;
            }
        });
};

class NeedForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageIsOpen: false,
            message: null,
            description: null
        };
    }

    componentWillMount() {
        if (this.props.user) {
            if (this.props.user.currentShelter) {
                shelter = this.props.user.currentShelter;
                console.log(shelter)
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.addedNeed) {
            this.handleOpenMessage();
            this.state.message = "added item";
        }

        if (nextProps.errorAddingNeed) {
            this.handleOpenMessage();
            this.state.message = "something went wrong";
        }

        if (nextProps.user) {
            if (nextProps.user.currentShelter) {
                shelter = nextProps.user.currentShelter;
            }
        }
    }

    handleOpenMessage() {
        this.state.messageIsOpen = true;

        this.state.messageIsOpen = setTimeout(() => {
            this.props.resetStatus("addingNeed");
            this.setState({
                messageIsOpen: false,
                message: null,
                description: null
            });
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
            this.props.untouch(["nameOfNeed", "numberOfPeople", "description"]);
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
            >

                {this.renderAlert()}

                <Header>
                    make a request{" "}
                </Header>

                <Segment.Group horizontal>

                    <Segment>
                        <Field
                            placeholder="name of item"
                            name="nameOfNeed"
                            component={FormField}
                            type="text"
                            label={"name of item"}
                            validate={[required, alphaNumeric]}
                        />

                        <Field
                            placeholder={"estimated number of people"}
                            name={"numberOfPeople"}
                            component={FormField}
                            type="text"
                            label={"number of people"}
                            validate={[number, required, alphaNumeric]}
                        />
                        {this.state.messageIsOpen
                            ? <Message
                                  positive={this.props.addedNeed}
                                  negative={this.props.errorAddingNeed}
                              >
                                  {" "}{this.state.message}
                              </Message>
                            : null}
                    </Segment>

                    <Segment>

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

                    </Segment>
                </Segment.Group>

                <Button basic type="submit">
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
