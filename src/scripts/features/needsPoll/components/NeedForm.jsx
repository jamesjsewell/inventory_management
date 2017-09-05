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

class NeedForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageIsOpen: false,
            description: null
        };
    }

    componentWillMount() {}

    componentWillReceiveProps(nextProps) {
        // if(nextProps.addedNeed){
        // }
    }

    handleOpenMessage() {
        this.state.messageIsOpen = true;

        this.state.messageIsOpen = setTimeout(() => {
            this.setState({ messageIsOpen: false });
            this.props.actions.resetStatusOfUpdate();
        }, 2500);
    }

    handleFormSubmit(formProps) {
        var userInput = formProps;
        console.log(formProps);
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

                <Button
                    basic
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
