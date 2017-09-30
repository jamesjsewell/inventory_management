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

export default class Need extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openedDescription: false,
            updatedNeed: false,
            errorUpdatingNeed: false,
            errorRemovingNeed: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updatedNeed && this.state.updatedNeed === false) {
            if (nextProps.idOfUpdatedNeed === this.props.idOfNeed) {
                this.handleMessage(true);
            }
        }
        if (
            nextProps.errorUpdatingNeed &&
            this.state.errorUpdatingNeed === false
        ) {
            if (nextProps.idOfUpdatedNeed === this.props.idOfNeed) {
                this.handleMessage(false);
            }
        }

        if (nextProps.errorRemovingNeed) {
            this.handleMessage(false, "remove");
        }
    }

    handleMessage(success, type) {
        if (success) {
            this.state.updatedNeed = true;
            this.state.errorUpdatingNeed = false;

            this.state.updatedNeed = setTimeout(() => {
                this.props.resetStatus("updatingNeed");
                this.setState({ updatedNeed: false });
            }, 5000);
        } else {
            this.state.updatedNeed = false;
            this.state.errorUpdatingNeed = true;

            this.state.errorUpdatingNeed = setTimeout(() => {
                this.props.resetStatus("updatingNeed");
                this.setState({ errorUpdatingNeed: false });
            }, 5000);

            if (type === "remove") {
                this.state.errorRemovingNeed = true;

                this.state.errorRemovingNeed = setTimeout(() => {
                    this.props.resetStatus("removingNeed");
                    this.setState({ errorRemovingNeed: false });
                }, 5000);
            }
        }
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
                              removeNeed(idOfNeed, null, true);
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

                <Header attached="top">
                    <Button
                        type="button"
                        onClick={e => {
                            e.preventDefault();
                            if (this.state.openedDescription === false) {
                                this.setState({
                                    openedDescription: true
                                });
                            } else {
                                this.setState({
                                    openedDescription: false
                                });
                            }
                        }}
                        size="tiny"
                        basic
                        icon={this.state.openedDescription ? "minus" : "add"}
                    /> description
                </Header>

                <Segment attached="bottom" size="small">

                    {this.state.openedDescription
                        ? <Container fluid text textAlign="left">
                              {this.props.description}
                          </Container>
                        : null}
                </Segment>

                {!this.props.isPreview
                    ? <Header>
                          do you need this item?
                      </Header>
                    : null}
                {!this.props.isPreview
                    ? <Button.Group widths={1}>
                          <Button
                              onClick={() => {
                                  updateNeed(
                                      idOfNeed,
                                      collectionOfNeeds,
                                      "has",
                                      this.props.numberOfPeople
                                  );
                              }}
                              size="medium"
                              positive
                          >
                              I have this{" "}
                          </Button>

                          {degreeOfNeed > 0 ? <Button.Or /> : null}

                          {degreeOfNeed > 0
                              ? <Button
                                    size="medium"
                                    icon="plus"
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

                      </Button.Group>
                    : null}

                {this.state.errorUpdatingNeed
                    ? <Message negative>
                          something went wrong, could not update
                      </Message>
                    : null}
                {this.state.errorRemovingNeed
                    ? <Message negative>
                          something went wrong, could not remove
                      </Message>
                    : null}
            </Segment>
        );
    }
}
