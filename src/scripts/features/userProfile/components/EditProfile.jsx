import React, { Component } from "react"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"
import { Link } from "react-router-dom"
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
} from "semantic-ui-react"
import _ from "underscore"
import {
    required,
    maxLength,
    minLength,
    alphaNumeric,
    email,
    shouldAsyncValidate,
    asyncValidate,
    number
} from "../../../util/formValidation/formValidation.js"
import { FormField } from "../../../components/forms/fields/formField.js"


class EditProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messageIsOpen: false,
            removePicModalOpen: false,
            receivedImgUrl: undefined,
            upToDateProfile: this.props.profile,
            upToDateUsername: this.props.username,
            aboutMeText: this.props.profile && this.props.profile.aboutMe
                ? this.props.profile.aboutMe
                : ""
        }
        this.props.actions.getAPIkey("FILESTACK_KEY")
        

    }

    componentWillMount() {
        console.log(this.props.actions)
        this.props.actions.fetchUserProfile(this.props.user._id)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profile) {
            this.setState({ upToDateProfile: nextProps.profile })
            this.state.upToDateUsername = nextProps.username
        }

        if (nextProps.username) {
            this.state.upToDateUsername = nextProps.username
        }

        if (nextProps.receivedImgUrl) {
            this.setState({ receivedImgUrl: nextProps.receivedImgUrl })
        }

        if (
            nextProps.updated === true ||
            nextProps.updating === true ||
            nextProps.errorUpdating === true
        ) {
            if (this.props.anyTouched) {
                this.props.untouch()
                this.props.reset()
                this.handleOpenMessage()
            }
        }
    }

    handleAboutMeChange(event) {
        this.setState({ aboutMeText: event.target.value })
    }

    handleOpenMessage() {
        this.state.messageIsOpen = true

        this.state.messageIsOpen = setTimeout(() => {
            this.setState({ messageIsOpen: false })
            this.props.actions.resetStatusOfUpdate()
        }, 2500)
    }

    handleUpload(evt) {
        evt.preventDefault()
        this.props.actions.uploadProfileImage(this.props.filestackApiKey)
    }

    removeProfileImage() {
        this.state.receivedImgUrl = undefined
        this.state.removePicModalOpen = false
        var updated = { profile: this.state.upToDateProfile }
        updated["profile"]["avatarUrl"] = undefined
        this.props.actions.updatePersonalInfo(this.props.user._id, updated)
    }

    handleFormSubmit(formProps) {
        var userInput = formProps

        const profile = this.state.upToDateProfile
        const username = this.state.upToDateUsername

        var avatarUrl = this.state.receivedImgUrl

        if (profile.avatarUrl && !this.state.receivedImgUrl) {
            avatarUrl = profile.avatarUrl
        }

        var parsedInput = {
            username: userInput.username ? userInput.username : username,
            profile: {
                firstName: userInput.firstName
                    ? userInput.firstName
                    : profile.firstName,
                lastName: userInput.lastName
                    ? userInput.lastName
                    : profile.lastName,
                age: userInput.age ? userInput.age : profile.age,
                gender: userInput.gender ? userInput.gender : profile.gender,
                location: userInput.location
                    ? userInput.location
                    : profile.location,
                relationshipStatus: userInput.relationshipStatus
                    ? userInput.relationshipStatus
                    : profile.relationshipStatus,
                website: userInput.website
                    ? userInput.website
                    : profile.website,
                avatarUrl: avatarUrl
            }
        }

        if (this.state.aboutMeText) {
            parsedInput["profile"]["aboutMe"] = this.state.aboutMeText
        } else {
            parsedInput["profile"]["aboutMe"] = this.state.upToDateProfile
                .aboutMe
                ? this.state.upToDateProfile.aboutMe
                : ""
        }

        if (!this.props.updatingProfile) {
            this.props.actions.updatePersonalInfo(this.props.user._id, parsedInput)
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
            )
        }
    }

    render() {
    
        const { handleSubmit } = this.props
        const user = this.props.user
        const username = this.state.upToDateUsername
            ? this.state.upToDateUsername
            : undefined
        const profile = this.state.upToDateProfile
        var imgUrl = this.state.upToDateProfile &&
            this.state.upToDateProfile.avatarUrl
            ? this.state.upToDateProfile.avatarUrl
            : undefined
        imgUrl = this.state.receivedImgUrl ? this.state.receivedImgUrl : imgUrl

        if (user) {
            var messageToUser = ""
            if (this.props.updatingProfile === true) {
                messageToUser = "updating your profile"
            }
            if (this.props.updated === true) {
                messageToUser = "updated your profile"
            }
            if (this.props.errorUpdating) {
                messageToUser = this.props.errorUpdating
            }
            const userFistName = profile && profile.firstName
                ? profile.firstName
                : undefined,
                userLastName = profile && profile.lastName
                    ? profile.lastName
                    : undefined,
                userAge = profile && profile.age ? profile.age : undefined,
                userGender = profile && profile.gender
                    ? profile.gender
                    : undefined,
                userLocation = profile && profile.location
                    ? profile.location
                    : undefined,
                userRelationshipStatus = profile && profile.relationshipStatus
                    ? profile.relationshipStatus
                    : undefined,
                userWebsite = profile && profile.website
                    ? profile.website
                    : undefined

            return (
                <Form
                    onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
                    size="large"
                    padded
                    widths="equal"
                    inverted={this.props.isInverted}
                    loading={
                        this.props.updatingProfile || !profile === true ? true : false
                    }
                >

                    {this.renderAlert()}

                    <Segment.Group
                        as={Segment}
                        basic
                        horizontal
                        size="small"
                        padded
                    >
                        <Segment basic compact>

                            <Field
                                placeholder={username}
                                name="username"
                                component={FormField}
                                type="text"
                                label="username"
                                validate={[alphaNumeric]}
                            />

                            <Field
                                placeholder={userFistName}
                                name="firstName"
                                component={FormField}
                                type="text"
                                label="first name"
                                validate={[alphaNumeric]}
                            />

                            <Field
                                placeholder={userLastName}
                                name="lastName"
                                component={FormField}
                                type="text"
                                label="last name"
                                validate={[alphaNumeric]}
                            />

                            <Field
                                placeholder={userAge ? userAge : "enter age"}
                                name="age"
                                component={FormField}
                                type="text"
                                label="age"
                                validate={[alphaNumeric, number]}
                            />

                        </Segment>

                        <Segment>

                            <Field
                                placeholder={
                                    userGender ? userGender : "enter gender"
                                }
                                name="gender"
                                component={FormField}
                                type="text"
                                label="gender"
                                validate={[alphaNumeric]}
                            />

                            <Field
                                placeholder={
                                    userLocation
                                        ? userLocation
                                        : "enter location"
                                }
                                name="location"
                                component={FormField}
                                type="text"
                                label="location"
                            />

                            <Field
                                placeholder={
                                    userRelationshipStatus
                                        ? userRelationshipStatus
                                        : "enter relationship status"
                                }
                                name="relationshipStatus"
                                component={FormField}
                                type="text"
                                label="relationship"
                                validate={[alphaNumeric]}
                            />

                            <Field
                                placeholder={
                                    userWebsite
                                        ? userWebsite
                                        : "enter your website"
                                }
                                name="website"
                                component={FormField}
                                type="text"
                                label="your website"
                            />

                        </Segment>

                        <Segment compact size="tiny">

                            {imgUrl
                                ? <Segment.Group compact size="mini">

                                      <Image
                                          size="tiny"
                                          compact
                                          centered
                                          fluid
                                          as="img"
                                          basic
                                          src={imgUrl}
                                      />

                                      <Segment size="mini" compact>

                                          <Button.Group>
                                              <Button
                                                  type="button"
                                                  onClick={this.handleUpload.bind(
                                                      this
                                                  )}
                                                  icon="refresh"
                                                  basic
                                              />

                                              {imgUrl === profile.avatarUrl
                                                  ? <Button
                                                        onClick={() => {
                                                            this.setState({
                                                                removePicModalOpen: true
                                                            })
                                                        }}
                                                        type="button"
                                                        icon="remove"
                                                        basic
                                                    />
                                                  : null}
                                          </Button.Group>

                                      </Segment>

                                  </Segment.Group>
                                : <Segment.Group compact size="mini">
                                      <Segment>
                                          <Button
                                              type="button"
                                              onClick={this.handleUpload.bind(
                                                  this
                                              )}
                                              icon="camera"
                                          />
                                      </Segment>
                                      <Segment>add profile picture</Segment>
                                  </Segment.Group>}

                            <Modal
                                open={
                                    this.state.removePicModalOpen &&
                                        this.state.upToDateProfile.avatarUrl
                                        ? true
                                        : false
                                }
                            >
                                <Modal.Header>
                                    Are you sure you want to remove this photo?
                                </Modal.Header>
                                <Modal.Content>

                                    <Modal.Actions>
                                        <Button
                                            type="button"
                                            content="no"
                                            onClick={() => {
                                                this.setState({
                                                    removePicModalOpen: false
                                                })
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            icon="check"
                                            content="remove photo"
                                            onClick={this.removeProfileImage.bind(
                                                this
                                            )}
                                        />

                                    </Modal.Actions>
                                </Modal.Content>
                            </Modal>

                            <textarea
                                as={Segment}
                                basic
                                size="small"
                                compact
                                id="aboutMe"
                                name="aboutMe"
                                value={this.state.aboutMeText}
                                onChange={this.handleAboutMeChange.bind(this)}
                                placeholder={
                                    profile && profile.aboutMe
                                        ? profile.aboutMe
                                        : "tell us about yourself"
                                }
                            />

                        </Segment>

                    </Segment.Group>

                    <Message
                        visible={this.state.messageIsOpen ? true : false}
                        hidden={this.state.messageIsOpen ? false : true}
                        floating
                        compact
                        success={this.props.updated ? true : false}
                        content={messageToUser}
                    />

                    {this.props.updatingProfile
                        ? null
                        : <Button
                              basic
                              type="submit"
                              content="save"
                              loading={this.props.updatingProfile}
                          />}

                </Form>
            )
        } else {
            return <div>could not find user</div>
        }
    }
}

export default reduxForm({
    form: "profileForm",
    asyncValidate,
    asyncBlurFields: ["username"],
    shouldAsyncValidate
})(EditProfile)
