import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

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
    Icon,
    Label,
    Progress
} from "semantic-ui-react";

export default class NeedsPollLayout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            degreeOfNeed,
            nameOfNeed,
            idOfNeed,
            collectionOfNeeds,
            removeNeed,
            updateNeed
        } = this.props;
        return (
            <Segment raised>
                <Button
                    floated="right"
                    icon={<Icon fitted size="large" name="remove" />}
                    size="tiny"
                    onClick={() => {
                        removeNeed(idOfNeed, collectionOfNeeds);
                    }}
                />

                <Header size="huge">{nameOfNeed} </Header>
                <Header.Subheader size="huge">
                    {this.props.degreeOfNeed}
                    {" "}
                    out of
                    {" "}
                    {this.props.numberOfPeople}
                    {" "}
                    people have this item
                    {" "}
                </Header.Subheader>
                <Progress
                    value={degreeOfNeed}
                    total={this.props.numberOfPeople}
                    progress="ratio"
                />
                <Segment attached>
                    do you need this item?
                </Segment>
                <Segment attached="bottom">

                    <Button
                        onClick={() => {
                            updateNeed(
                                idOfNeed,
                                collectionOfNeeds,
                                "has",
                                this.props.numberOfPeople
                            );
                        }}
                        positive
                    >
                        I have this
                    </Button>

                    {degreeOfNeed > 1
                        ? <Button
                              onClick={() => {
                                  updateNeed(
                                      idOfNeed,
                                      collectionOfNeeds,
                                      "needs",
                                      this.props.numberOfPeople
                                  );
                              }}
                              negative
                          >
                              I need this
                          </Button>
                        : null}

                    <Button
                        floated="right"
                        onClick={() => {
                            this.props.editNeed();
                        }}
                    >
                        edit
                    </Button>

                </Segment>
            </Segment>
        );
    }
}
