import React, { Component } from "react";
import { connect } from "react-redux";

import {
    Button,
    Grid,
    Segment,
    Input,
    Form,
    Header,
    Container,
    Message,
    Progress,
    Label,
    Divider
} from "semantic-ui-react";

import InputField
    from "../../../components/forms/fields/inputField/InputField.jsx";

export default class NeedsPollLayout extends Component {
    constructor(props) {
        super(props);
        this.state = { errorLoadingNeeds: false, successAddingNeed: false };
    }
    componentWillMount() {
        if (!this.props.collectionOfNeeds) {
            this.props.actions.fetchNeeds();
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }

    handleMessage(success, type) {
        if (type === "addingNeed") {
            if (success === true) {
                this.state.successAddingNeed = true;

                this.state.successAddingNeed = setTimeout(() => {
                    this.props.actions.resetStatus("addingNeed");
                    this.setState({ successAddingNeed: false });
                }, 2500);
            }
        }

        if (type === "loadingNeeds") {
            if (success === false) {
                this.state.errorLoadingNeeds = true;
            }
        }
    }

    render() {
        console.log(
            this.props.collectionOfNeeds ? this.props.collectionOfNeeds : null
        );
        console.log(this.props.arrayOfNeeds);
        const asyncNeeds = this.props.loadingNeeds || this.props.addingNeed
            ? true
            : false,
            errorLoadingNeeds = this.props.errorLoadingNeeds,
            addedNeed = this.props.addedNeed;

        if (errorLoadingNeeds) {
            this.handleMessage(false, "loadingNeeds");
        }
        if (addedNeed) {
            this.handleMessage(true, "addingNeed");
        }
        return (
            <Grid container columns="equal" stackable>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Header attached="top" size="large" textAlign="center">
                            <Header.Content>
                                needs{" "}
                            </Header.Content>
                        </Header>

                        <Segment attached label={"test"}>
                            <Segment compact loading={asyncNeeds}>
                                <InputField
                                    inputPlaceholder="enter need"
                                    inputName="needField"
                                    inputLabel="enter new need"
                                    doThisOnSubmit={userInput => {
                                        if (userInput) {
                                            this.props.actions.submitNewNeed(
                                                userInput.needField,
                                                "some_ID",
                                                this.props.collectionOfNeeds
                                            );
                                        }
                                    }}
                                />
                                {this.state.successAddingNeed
                                    ? <Message positive>added need!</Message>
                                    : null}

                            </Segment>
                            <Segment loading={asyncNeeds}>
                                {this.props.arrayOfNeeds
                                    ? this.props.arrayOfNeeds[0].attributes
                                          .nameOfNeed
                                    : null}
                                {this.state.errorLoadingNeeds
                                    ? <Message negative>
                                          internal server error
                                      </Message>
                                    : null}
                                <Label size="huge">toiletries</Label>
                                <Progress percent={20} />
                                <Button negative>I need this</Button>
                                {" "}
                                <Button positive>I have this</Button>
                            </Segment>

                            <Segment secondary as={Grid} columns={3} streched>
                                <Grid.Column textAlign="left">
                                    someone needs this
                                </Grid.Column>
                                <Grid.Column textAlign="center">
                                    some people need this
                                </Grid.Column>
                                <Grid.Column textAlign="right">
                                    many people need this
                                </Grid.Column>
                            </Segment>

                        </Segment>

                    </Grid.Column>

                    <Grid.Column />

                </Grid.Row>

                <Grid.Row>

                    <Grid.Column>
                        <Header
                            attached="top"
                            size="large"
                            textAlign="center"
                        />
                        <Segment attached />

                    </Grid.Column>

                </Grid.Row>
            </Grid>
        );
    }
}
