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
    asyncValidate,
    number
} from "../../../util/formValidation/formValidation.js";
import { FormField } from "../../../components/forms/fields/formField.js";

class EditNeed extends Component {
    constructor(props) {
        super(props);
        this.state = { description: null };
        var model = this.props.needsCollection.get(this.props.idOfEditedNeed);
        console.log(model, this.props.idOfEditedNeed);
        this.state.model = model;
    }

    componentWillMount() {}

    componentWillReceiveProps(nextProps) {
        // if (nextProps.profile) {
        //     this.setState({ upToDateProfile: nextProps.profile });
        //     this.state.upToDateUsername = nextProps.username;
        // }
        // if (nextProps.username) {
        //     this.state.upToDateUsername = nextProps.username;
        // }
        // if (nextProps.receivedImgUrl) {
        //     this.setState({ receivedImgUrl: nextProps.receivedImgUrl });
        // }
        // if (
        //     nextProps.updated === true ||
        //     nextProps.updating === true ||
        //     nextProps.errorUpdating === true
        // ) {
        //     if (this.props.anyTouched) {
        //         this.props.untouch();
        //         this.props.reset();
        //         this.handleOpenMessage();
        //     }
        // }
    }

    handleDescriptionChange(event) {
        this.setState({ description: event.target.value });
    }

    handleOpenMessage() {
        this.state.messageIsOpen = true;

        this.state.messageIsOpen = setTimeout(() => {
            this.setState({ messageIsOpen: false });
            this.props.actions.resetStatusOfUpdate();
        }, 2500);
    }

    handleUpload(evt) {
        // evt.preventDefault();
        // this.props.actions.uploadProfileImage(this.props.filestackApiKey);
    }

    removeProfileImage() {
        // this.state.receivedImgUrl = undefined;
        // this.state.removePicModalOpen = false;
        // var updated = { profile: this.state.upToDateProfile };
        // updated["profile"]["avatarUrl"] = undefined;
        // this.props.actions.updatePersonalInfo(this.props.user._id, updated);
    }

    handleFormSubmit(formProps) {
        var userInput = formProps;

        // const profile = this.state.upToDateProfile;
        // const username = this.state.upToDateUsername;

        // var avatarUrl = this.state.receivedImgUrl;

        // if (profile.avatarUrl && !this.state.receivedImgUrl) {
        //     avatarUrl = profile.avatarUrl;
        // }

        // var parsedInput = {
        //     username: userInput.username ? userInput.username : username,
        //     profile: {
        //         firstName: userInput.firstName
        //             ? userInput.firstName
        //             : profile.firstName,
        //         lastName: userInput.lastName
        //             ? userInput.lastName
        //             : profile.lastName,
        //         age: userInput.age ? userInput.age : profile.age,
        //         gender: userInput.gender ? userInput.gender : profile.gender,
        //         location: userInput.location
        //             ? userInput.location
        //             : profile.location,
        //         relationshipStatus: userInput.relationshipStatus
        //             ? userInput.relationshipStatus
        //             : profile.relationshipStatus,
        //         website: userInput.website
        //             ? userInput.website
        //             : profile.website,
        //         avatarUrl: avatarUrl
        //     }
        // };

        // if (this.state.aboutMeText) {
        //     parsedInput["profile"]["aboutMe"] = this.state.aboutMeText;
        // } else {
        //     parsedInput["profile"]["aboutMe"] = this.state.upToDateProfile
        //         .aboutMe
        //         ? this.state.upToDateProfile.aboutMe
        //         : "";
        // }

        // if (!this.props.updatingProfile) {
        //     this.props.actions.updatePersonalInfo(
        //         this.props.user._id,
        //         parsedInput
        //     );
        // }
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
                    size="massive"
                    padded
                    loading={false}
                >

                    {this.renderAlert()}

                    <Field
                        
                        placeholder="enter name of item"
                        name="nameOfNeed"
                        component={FormField}
                        type="text"
                        label="item name"
                        validate={[alphaNumeric]}
                    />

                    <Field

                        placeholder="enter number of people"
                        name="numberOfPeople"
                        component={FormField}
                        type="text"
                        label="estimated number of people"
                        validate={[alphaNumeric, number]}
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

                    <Message
                        visible={this.state.messageIsOpen ? true : false}
                        hidden={this.state.messageIsOpen ? false : true}
                        floating
                        compact
                        success={true} //this.props.updated ? true : false
                        content={"something"}
                    />

                    <Segment compact>
                    <Button
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
// {this.props.updatingNeed
//                         ? null
//                         : }
export default reduxForm({
    form: "editNeedForm",
    asyncValidate,
    asyncBlurFields: ["nameOfNeed"],
    shouldAsyncValidate
})(EditNeed);
