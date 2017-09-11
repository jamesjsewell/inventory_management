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
    Image,
    Icon,
    Label,
    Progress,
    Divider
} from "semantic-ui-react";

export default class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openedDescription: false,
            successUpdatingItem: false,
            errorUpdatingItem: false,
            errorRemovingItem: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.successUpdatingItem &&
            this.state.successUpdatingItem === false
        ) {
            if (nextProps.idOfUpdatedItem === this.props.idOfItem) {
                this.handleMessage(true, "updatingItem");
            }
        }
        if (
            nextProps.errorUpdatingItem &&
            this.state.errorUpdatingItem === false
        ) {
            if (nextProps.idOfUpdatedItem === this.props.idOfItem) {
                this.handleMessage(false, "updatingItem");
            }
        }

        if (nextProps.errorRemovingItem) {
            this.handleMessage(false, "removingItem");
        }
    }

    handleMessage(success, type) {
        if (type === "updatingItem") {
            if (success) {
                this.state.successUpdatingItem = true;
                this.state.errorUpdatingItem = false;

                this.state.successUpdatingItem = setTimeout(() => {
                    this.props.resetStatus("successUpdatingItem");
                    this.setState({ successUpdatingItem: false });
                }, 5000);
            } else {
                this.state.successUpdatingItem = false;
                this.state.errorUpdatingItem = true;

                this.state.errorUpdatingItem = setTimeout(() => {
                    this.props.resetStatus("successUpdatingItem");
                    this.setState({ errorUpdatingItem: false });
                }, 5000);
            }
        }

        if (type === "removingItem") {
            if (!success) {
                this.state.errorRemovingItem = true;

                this.state.errorRemovingItem = setTimeout(() => {
                    this.props.resetStatus("removingItem");
                    this.setState({ errorRemovingItem: false });
                }, 5000);
            }
        }
    }

    render() {
        const {
            nameOfItem,
            idOfItem,
            collectionOfItems,
            removeItem,
            updateItem
        } = this.props;
        return (
            <Segment raised={true} padded color="grey">
                {this.props.members && this.props.members[0]? this.props.members[0].username : null}
                {!this.props.isPreview
                    ? <Button
                          onClick={() => {
                              this.props.editItem(idOfItem);
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
                              removeItem(idOfItem, null, true);
                          }}
                      />
                    : null}

                <Header size="huge">{nameOfItem} </Header>

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
                                    {this.props.descriptionOfItem}
                                </Container>
                              : null}
                      </Segment>
                    : null}

                {this.props.isPreview
                    ? <Container fluid text textAlign="left">
                          {this.props.descriptionOfItem}
                      </Container>
                    : null}

                {this.state.successUpdatingItem
                    ? <Message positive>updated successfully</Message>
                    : null}
                {this.state.errorUpdatingItem
                    ? <Message negative>
                          something went wrong, could not update
                      </Message>
                    : null}
                {this.state.errorRemovingItem
                    ? <Message negative>
                          something went wrong, could not remove
                      </Message>
                    : null}
            </Segment>
        );
    }
}
