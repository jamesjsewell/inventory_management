import React, { Component } from "react"
import { Link } from "react-router-dom"
import {
    Button,
    Grid,
    Segment,
    Input,
    Header,
    Modal,
    Message
} from "semantic-ui-react"
import ResetPassword from "./ResetPassword.jsx"

export default class UserSessionLayout extends Component {
    render() {
        return (
            <div>

                <Grid columns={"1"} divided stackable stretched container>

                    <Grid.Row stretched>

                        <Grid.Column>

                            <Header
                                attached="top"
                                size="large"
                                textAlign="center"
                            >
                                <Header.Content>
                                    reset your password
                                </Header.Content>
                            </Header>

                            <Segment attached>
                                <ResetPassword
                                    {...this.props}
                                    match={this.props.match}
                                />
                                <Message
                                    hidden={
                                        this.props.didPasswordReset
                                            ? false
                                            : true
                                    }
                                >
                                    <Message.Header>
                                        {this.props.stateOfReset}
                                    </Message.Header>
                                    <Message.Content>

                                        <Link to="/login">login</Link>

                                    </Message.Content>
                                </Message>

                            </Segment>

                        </Grid.Column>

                    </Grid.Row>

                </Grid>

            </div>
        )
    }
}
