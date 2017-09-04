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
    Divider,
    Modal
} from "semantic-ui-react";

import NeedForm from "./NeedForm.jsx";

import Need from "./Need.jsx";

import EditNeed from "./EditNeed.jsx";

export default class NeedsPollLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorLoadingNeeds: false,
            successAddingNeed: false,
            editingNeed: false
        };
    }
    componentWillMount() {
        if (!this.props.collectionOfNeeds) {
            this.props.actions.fetchNeeds();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.editingNeed) {
            this.state.editingNeed = true;
        }
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

    renderNeeds() {
        var arrayOfNeedElements = [];

        if (this.props.arrayOfNeeds) {
            for (var i = 0; i < this.props.arrayOfNeeds.length; i++) {
                arrayOfNeedElements.push(
                    <Need
                        updateNeed={this.props.actions.updateNeed.bind(this)}
                        removeNeed={this.props.actions.removeNeed.bind(this)}
                        nameOfNeed={
                            this.props.arrayOfNeeds[i].attributes.nameOfNeed
                        }
                        degreeOfNeed={
                            this.props.arrayOfNeeds[i].attributes.degreeOfNeed
                        }
                        numberOfPeople={
                            this.props.arrayOfNeeds[i].attributes.numberOfPeople
                        }
                        idOfNeed={this.props.arrayOfNeeds[i].attributes._id}
                        collectionOfNeeds={this.props.collectionOfNeeds}
                        editNeed={this.props.actions.editNeed.bind(this)}
                    />
                );
            }

            return arrayOfNeedElements;
        } else {
            return null;
        }
    }

    render() {
        const asyncNeeds = this.props.loadingNeeds || this.props.addingNeed
            ? true
            : false;

        const { errorLoadingNeeds, addedNeed, editingNeed, collectionOfNeeds } = this.props;

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
                        <Segment attached size="huge" textAlign="center">
                            <Header.Content>
                                needs{" "}
                            </Header.Content>
                        </Segment>

                        <Segment attached="bottom">
                            <Segment compact loading={asyncNeeds}>
                                <NeedForm
                                    addedNeed={this.props.addedNeed}
                                    doThisOnSubmit={userInput => {
                                        if (userInput) {
                                            this.props.actions.submitNewNeed(
                                                userInput,
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
                            <Segment secondary as={Grid} columns={3} streched>
                                <Grid.Column textAlign="left">
                                    not enough
                                </Grid.Column>
                                <Grid.Column textAlign="center">
                                    running low
                                </Grid.Column>
                                <Grid.Column textAlign="right">
                                    plenty
                                </Grid.Column>
                            </Segment>
                            <Segment basic loading={asyncNeeds}>

                                {this.state.errorLoadingNeeds
                                    ? <Message negative>
                                          internal server error
                                      </Message>
                                    : this.renderNeeds()}

                                <Modal
                                    open={this.state.editingNeed}
                                    size="large"
                                >
                                    <Modal.Content>
                                        <EditNeed needsCollection={collectionOfNeeds} idOfEditedNeed={this.props.idOfEditedNeed} />
                                    </Modal.Content>
                                </Modal>

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
