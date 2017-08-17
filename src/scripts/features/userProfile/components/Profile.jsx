import React, { Component } from "react"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"

import {
    Button,
    Grid,
    Segment,
    Input,
    Form,
    Header,
    Container,
    Message,
    Item,
    Image,
    Icon
} from "semantic-ui-react"


export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messageIsOpen: false,
            upToDateProfile: this.props.profile,
            upToDateUsername: this.props.username
        }
    }

    componentWillMount() {
        
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profile) {
            this.state.upToDateProfile = nextProps.profile
            this.state.upToDateUsername = nextProps.username
            this.state.aboutMeText = nextProps.profile.aboutMe
        }

        if (nextProps.username) {
            this.state.upToDateUsername = nextProps.username
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
        const user = this.props.user
        const username = this.state.upToDateUsername
            ? this.state.upToDateUsername
            : undefined
        const profile = this.state.upToDateProfile
        const avatar = this.state.upToDateProfile
            ? this.state.upToDateProfile.avatarUrl
            : undefined

        if (user) {
            var userAttributes = [`${username}`]
            for (var attribute in profile) {
                switch (attribute) {
                    case "firstName": {
                        if (profile.firstName && profile.lastName) {
                            userAttributes[1] = `${profile.firstName} ${profile.lastName}`
                        } else {
                            if (profile.lastName && !profile.firstName) {
                                userAttributes[1] = `${profile.lastName}`
                            }
                            if (profile.firstName && !profile.lastName) {
                                userAttributes[1] = `${profile.firstName}`
                            }
                        }
                    }

                    case "age": {
                        userAttributes[2] = profile.age
                            ? `${profile.age}`
                            : undefined
                    }

                    case "gender": {
                        userAttributes[3] = profile.gender
                            ? `${profile.gender}`
                            : undefined
                    }

                    case "location": {
                        userAttributes[4] = profile.location
                            ? `${profile.location}`
                            : undefined
                    }

                    case "relationshipStatus": {
                        userAttributes[5] = profile.relationshipStatus
                            ? `${profile.relationshipStatus}`
                            : undefined
                    }

                    case "website": {
                        userAttributes[6] = profile.relationshipStatus
                            ? `${profile.website}`
                            : undefined
                    }
                }
            }


            var attributeIcons = ["at", "user" , "hourglass half" , "intersex", "marker", "heart" , "external"]
            var attributeNodes = []

            for (var attr = 0; attr < userAttributes.length; attr++) {
                var theAttribute = userAttributes[attr]
                    ? userAttributes[attr].toString()
                    : undefined
                if (theAttribute && theAttribute.replace(/ /g, "")) {
                    attributeNodes.push(
                        <Segment><Icon name={attributeIcons[attr]} /> {userAttributes[attr]}</Segment>
                    )
                }
            }

            return (
                <Grid horizontal columns={2} container stackable>

                    <Grid.Column width={6}>

                        <Segment>
                            {avatar
                                ? <Image
                                      size="small"
                                      compact
                                      centered
                                      fluid
                                      as="img"
                                      basic
                                      src={avatar}
                                  />
                                : <div />}
                        </Segment>

                        <Segment.Group as={Segment}>
                            {attributeNodes}
                        </Segment.Group>

                    </Grid.Column>

                    <Grid.Column width={10}>
                    <Header as={Segment}>{username}</Header>
                    {profile && profile.aboutMe
                        ? <Segment size="small">
                              
                             
                              <Container fluid text>{profile.aboutMe}</Container>
                             
                          </Segment>
                        : null}
                    </Grid.Column>

                </Grid>
            )
        } else {
            return <div>could not find user</div>
        }
    }
}


