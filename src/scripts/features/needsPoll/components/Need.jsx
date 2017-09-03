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
            <Segment>
                <Button
                    floated="right"
                    icon={<Icon fitted size="large" name="remove" />}
                    size="tiny"
                    onClick={() => {
                        removeNeed(idOfNeed, collectionOfNeeds);
                    }}
                />

                <Label basic size="huge">{nameOfNeed}</Label>
                <Progress value={degreeOfNeed} total={this.props.totalOfOccupants} progress='ratio' />
                <Button
                    onClick={() => {
                        updateNeed(idOfNeed, collectionOfNeeds, "needs", this.props.totalOfOccupants);
                    }}
                    negative
                >
                    I need this
                </Button>
                {" "}
                <Button
                    onClick={() => {
                        updateNeed(idOfNeed, collectionOfNeeds, "has", this.props.totalOfOccupants);
                    }}
                    positive
                >
                    I have this
                </Button>
            </Segment>
        );
    }
}
