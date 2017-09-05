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
        this.state = {
            openedDescription: false,
            updatedNeed: false,
            errorUpdatingNeed: false
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
    }

    handleMessage(success) {
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
                              //removeNeed(idOfNeed, collectionOfNeeds);
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

                {!this.props.isPreview
                    ? <Header attached="top">
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
                              icon={
                                  this.state.openedDescription ? "minus" : "add"
                              }
                          /> description
                      </Header>
                    : null}

                {!this.props.isPreview
                    ? <Segment attached="bottom" size="small">

                          {this.state.openedDescription
                              ? <Container fluid text textAlign="left">
                                    {this.props.description}
                                </Container>
                              : null}
                      </Segment>
                    : null}

                {this.props.isPreview
                    ? <Container fluid text textAlign="left">
                          {this.props.description}
                      </Container>
                    : null}

                {!this.props.isPreview
                    ? <Segment size="large" attached="top">
                          <Header>
                              do you need this item?
                          </Header>
                      </Segment>
                    : null}
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
                {this.state.updatedNeed
                    ? <Message positive>updated successfully</Message>
                    : null}
                {this.state.errorUpdatingNeed
                    ? <Message negative>something went wrong</Message>
                    : null}
            </Segment>
        );
    }
}
