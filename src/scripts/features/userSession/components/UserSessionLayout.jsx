import React, { Component } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Button, Grid, Segment, Input, Header, Modal } from "semantic-ui-react"
import Login from "./Login.jsx"
import Register from "./Register.jsx"
import ForgotPassword from "./ForgotPassword.jsx"

export default class UserSessionLayout extends Component {
    render() {
        return (
            <div>

                <Grid columns={"2"} divided stackable stretched container>

                    <Grid.Row stretched>

                        <Grid.Column>

                            <Header
                                size="large"
                                attached="top"
                                textAlign="center"
                            >
                                login
                            </Header>

                            <Segment attached>

                                <Login
                                    loginError={this.props.loginError}
                                    loginAction={this.props.actions.loginUser}
                                />

                                <Segment>
                                    <Modal
                                        trigger={
                                            <Button>forgot password?</Button>
                                        }
                                    >
                                        <Modal.Header>
                                            Request password change
                                        </Modal.Header>
                                        <Modal.Content>
                                            <Modal.Description>
                                                <ForgotPassword
                                                    requestPasswordAction={
                                                        this.props.actions
                                                            .getForgotPasswordToken
                                                    }
                                                    sendSuccessful={
                                                        this.props
                                                            .emailSendSuccessful
                                                    }
                                                    stateOfSend={
                                                        this.props
                                                            .stateOfEmailSend
                                                    }
                                                    sendingEmail={
                                                        this.props.sendingEmail
                                                    }
                                                />
                                            </Modal.Description>
                                        </Modal.Content>
                                    </Modal>
                                </Segment>
                            </Segment>

                        </Grid.Column>

                        <Grid.Column>

                            <Header
                                attached="top"
                                size="large"
                                textAlign="center"
                            >
                                <Header.Content>
                                    register
                                </Header.Content>
                            </Header>

                            <Segment attached>
                                <Register
                                    registerError={this.props.registerError}
                                    registerAction={
                                        this.props.actions.registerUser
                                    }
                                />
                            </Segment>

                        </Grid.Column>

                    </Grid.Row>

                </Grid>

            </div>
        )
    }
}
