import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
    Button,
    Grid,
    Segment,
    Input,
    Header,
    Modal,
    Icon
} from "semantic-ui-react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ForgotPassword from "./ForgotPassword.jsx";

export default class UserSessionLayout extends Component {
    constructor(props) {
        super(props);
        this.state = { registerOpen: false };
    }
    render() {
        return (
            <div>

                <Grid columns={2} divided stackable stretched container>

                    <Grid.Row stretched>

                        <Grid.Column>

                            {!this.state.registerOpen
                                ? <Segment basic>
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
                                              loginAction={
                                                  this.props.actions.loginUser
                                              }
                                          />

                                          <Segment>
                                              <Modal
                                                  trigger={
                                                      <Button basic size="tiny">
                                                          forgot password?
                                                      </Button>
                                                  }
                                              >
                                                  <Modal.Header>
                                                      Request password change
                                                  </Modal.Header>
                                                  <Modal.Content>
                                                      <Modal.Description>
                                                          <ForgotPassword
                                                              requestPasswordAction={
                                                                  this.props
                                                                      .actions
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
                                                                  this.props
                                                                      .sendingEmail
                                                              }
                                                          />
                                                      </Modal.Description>
                                                  </Modal.Content>
                                              </Modal>
                                          </Segment>
                                      </Segment>{" "}
                                  </Segment>
                                : null}

                        </Grid.Column>

                        <Grid.Column>

                            {!this.state.registerOpen
                                ? <Segment compact basic>

                                        <Segment compact>
                                      <Header>
                                          don't have an account?
                                      </Header>

                                      <Button
                                      basic

                                      size="tiny"
                                          onClick={e => {
                                              e.preventDefault();
                                              this.setState({
                                                  registerOpen: true
                                              });
                                          }}
                                      >
                                          register
                                      </Button>
                                      </Segment>
                                  </Segment>
                                : null}

                            {this.state.registerOpen
                                ? <Segment basic>
                                      <Button
                                          basic
                                          onClick={e => {
                                              e.preventDefault();
                                              this.setState({
                                                  registerOpen: false
                                              });
                                          }}
                                      >
                                          <Icon name="minus" />
                                      </Button>
                                      <Header
                                          attached="top"
                                          size="large"
                                          textAlign="center"
                                          as={Segment}
                                      >

                                          register

                                      </Header>

                                      <Segment attached>
                                          <Register
                                              registerError={
                                                  this.props.registerError
                                              }
                                              registerAction={
                                                  this.props.actions
                                                      .registerUser
                                              }
                                          />
                                      </Segment>
                                  </Segment>
                                : null}

                        </Grid.Column>

                    </Grid.Row>

                </Grid>

            </div>
        );
    }
}
