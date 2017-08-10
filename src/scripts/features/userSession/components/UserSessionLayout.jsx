import React, { Component } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Button, Grid, Segment, Input, Header, Modal } from "semantic-ui-react"
import Login from "./Login.jsx"
import Register from "./Register.jsx"
import ForgotPassword from "./ForgotPassword.jsx"

export default class UserSessionLayout extends Component {
    handleRegisterSubmit(formProps) {
        this.props.actions.registerUser(formProps)
    }

    handleLoginSubmit(formProps) {
        this.props.actions.loginUser(formProps)
    }

    handleResetPasswordSubmit(formProps) {
        this.props.actions.getForgotPasswordToken(formProps)
    }

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
                                    loginSubmit={this.handleLoginSubmit.bind(
                                        this
                                    )}
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
                                                <ForgotPassword />
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
                                    registerSubmit={this.handleRegisterSubmit.bind(
                                        this
                                    )}
                                />
                            </Segment>

                        </Grid.Column>

                    </Grid.Row>

                </Grid>

            </div>
        )
    }
}
