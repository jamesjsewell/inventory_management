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
    Progress,
    Divider
} from "semantic-ui-react";

export default class NeedsPollLayout extends Component {
    constructor(props) {
        super(props);
        this.state = { openedDescription: false };
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
            <Segment raised={true} padded color="grey">
                {!this.props.isPreview
                    ? <Button
                          onClick={() => {
                              this.props.editNeed(idOfNeed);
                          }}
                      >
                          edit
                      </Button>
                    : null}
                {!this.props.isPreview
                    ? <Button
                          floated="right"
                          icon={<Icon fitted size="large" name="remove" />}
                          size="tiny"
                          onClick={() => {
                              removeNeed(idOfNeed, collectionOfNeeds);
                          }}
                      />
                    : null}

                <Header size="huge">{nameOfNeed} </Header>
                <Header>
                    {this.props.degreeOfNeed}
                    {" "}
                    out of
                    {" "}
                    {this.props.numberOfPeople}
                    {" "}
                    people have this item
                    {" "}
                </Header>

                <Progress
                    value={degreeOfNeed}
                    total={this.props.numberOfPeople}
                    progress="ratio"
                />

                <Header attached="top">description</Header>
                <Segment attached="bottom" size="small">
                    <Button
                        type="button"
                        onClick={e => {
                            e.preventDefault();
                            if (this.state.openedDescription === false) {
                                this.setState({ openedDescription: true });
                            } else {
                                this.setState({ openedDescription: false });
                            }
                        }}
                        compact
                        size="tiny"
                        icon={this.state.openedDescription ? "minus" : "add"}
                    />
                    <Divider />

                    {this.state.openedDescription
                        ? <Container text>{this.props.description}</Container>
                        : null}
                </Segment>

                <Segment size="large" attached="top">
                    <Header>
                        do you need this item?
                    </Header>
                </Segment>
                {!this.props.isPreview
                    ? <Segment attached="bottom">

                          <Button
                              onClick={() => {
                                  updateNeed(
                                      idOfNeed,
                                      collectionOfNeeds,
                                      "has",
                                      this.props.numberOfPeople
                                  );
                              }}
                              basic
                              size="large"
                              positive
                          >
                              I have this{" "}
                          </Button>

                          {degreeOfNeed > 1
                              ? <Button
                                    size="large"
                                    icon="plus"
                                    onClick={() => {
                                        updateNeed(
                                            idOfNeed,
                                            collectionOfNeeds,
                                            "needs",
                                            this.props.numberOfPeople
                                        );
                                    }}
                                    basic
                                    negative
                                >
                                    I need this
                                </Button>
                              : null}

                      </Segment>
                    : null}
            </Segment>
        );
    }
}
