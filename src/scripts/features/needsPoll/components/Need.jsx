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
        const { degreeOfNeed, nameOfNeed } = this.props;
        return (
            <Segment>
                <Button
                    floated="right"
                    icon={<Icon fitted size="large" name="remove" />}
                    size="tiny"
                />

                <Label basic size="huge">{nameOfNeed}</Label>
                <Progress percent={degreeOfNeed} />
                <Button negative>I need this</Button>
                {" "}
                <Button positive>I have this</Button>
            </Segment>
        );
    }
}
