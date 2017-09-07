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


export default class SheltersLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            successAddingItem: false,
            errorAddingItem: false,
            successLoadingItems: false,
            errorLoadingItems: false,
            successUpdatingItem: false,
            errorUpdatingItem: false,
            successRemovingItem: false,
            errorRemovingItem: false,
            itemRemovalPromptOpen: false,
            userIsEditingItem: false
        };
    }
    componentWillMount() {
        if (!this.props.collectionOfItems) {
            this.props.actions.fetchItems();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.statusOfEditItem.inProgress === true ) {
            this.state.userIsEditingItem = true;
        }

        if (nextProps.statusOfUpdateItem.success && !this.state.successUpdatingItem) {
            this.handleMessage(true, "updateItem");
        }

        if (nextProps.statusOfUpdateItem.error && !this.state.errorUpdatingItem) {
            this.handleMessage(false, "updateItem");
        }

        if (nextProps.statusOfRemoveItemPrompt) {
            this.handleMessage(null, "removeItem");
        } else {
            this.state.itemRemovalPromptOpen = false;
        }

        if (nextProps.statusOfRemoveItem.error) {
            this.handleMessage(false, "errorRemovingItem");
        }
    }

    handleMessage(success, type) {
        if (type === "addingItem") {
            if (success === true) {
                this.state.successAddingItem = true;

                this.state.successAddingItem = setTimeout(() => {
                    this.props.actions.resetStatus("addingItem");
                    this.setState({ successAddingItem: false });
                }, 5000);
            }
        }

        if (type === "loadingItems") {

            if (success === true){
                this.state.successLoadingItems = true
                this.state.errorLoadingItems = false
            }

            if (success === false) {
                this.state.errorLoadingItems = true;
                this.state.successLoadingItems = false
            }

        }

        if (type === "updateItem") {
            if (success === true) {
                this.state.successUpdatingItem = true;
                this.state.errorUpdatingItem = false;

                this.state.successUpdatingItem = setTimeout(() => {
                    this.props.actions.resetStatus("updatingItem");
                    this.setState({ successUpdatingItem: false });
                }, 5000);
            } else {
                this.state.successUpdatingItem = false;
                this.state.errorUpdatingItem = true;

                this.state.errorUpdatingItem = setTimeout(() => {
                    this.props.actions.resetStatus("updatingItem");
                    this.setState({ errorUpdatingItem: false });
                }, 5000);
            }
        }

        if (type === "removingItem") {
            this.state.itemRemovalPromptOpen = true;
        }

        if (type === "errorRemovingItem") {
            this.state.errorRemovingItem = true
            this.state.errorRemovingItem = setTimeout(() => {
                this.props.actions.resetStatus("removingItem");
                this.setState({ errorRemovingItem: false });
            }, 5000);
        }
    }

    renderItems() {
        var arrayOfItemElements = [];

        if (this.props.arrayOfItems) {
            for (var i = 0; i < this.props.arrayOfItems.length; i++) {
                arrayOfItemElements.push(
                    <Need
                        
                        updateItem={this.props.actions.updatedItem.bind(this)}
                        removeItem={this.props.actions.removeItem.bind(this)}
                        editItem={this.props.actions.editItem.bind(this)}
                        nameOfItem={
                            this.props.arrayOfItems[i].attributes.nameOfItem
                        }

                        descriptionOfItem={
                            this.props.arrayOfItems[i].attributes.description
                        }
                        idOfItem={this.props.arrayOfItems[i].attributes._id}
                        idOfUpdatedItem={this.props.statusOfUpdateItem.status.idOfItem}
                        collectionOfItems={this.props.collectionOfItems}
                        
                        errorUpdatingItem={this.props.statusOfUpdateItem.status.error}
                        updatedItem={this.props.updatedItem}
                        resetStatus={this.props.actions.resetStatus.bind(this)}
                        errorRemovingItem={this.props.errorRemovingItem}
                    />
                );

                if (i != this.props.arrayOfItems.length - 1) {
                    arrayOfItemElements.push(<Divider />);
                }
            }

            return arrayOfItemElements;

        } else {
            return null;
        }
    }

    render() {
        const asyncItems = this.state.statusOfLoadingItems.inProgress || this.state.statusOfAddingItem.inProgress
            ? true
            : false;

        var userIsEditingItem = this.state.statusOfEditItem.status.inProgress

        const {
            ,
            ,
            collectionOfItems,
            idOfEditedItem,
            idOfEditedItem,
            idOfUpdatedNeed,
            idOfItemToRemove,
            errorRemovingNeed
        } = this.props;

        if (this.state.errorLoadingItems) {
            this.handleMessage(false, "loadingItems");
        }
        if (this.state.userIsEditingItem) {
            var model = this.props.collectionOfItems.get(this.props.statusOfEditItem.idOfItem);
        }
        Need
        return (
            <Grid container columns="equal" stackable>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Segment attached size="huge" textAlign="center">
                            <Header.Content>
                                items{" "}
                            </Header.Content>
                        </Segment>

                        <Segment attached="bottom">
                            <Segment compact loading={asyncItems}>
                                <NeedForm
                                    resetStatus={this.props.actions.resetStatus.bind(
                                        this
                                    )}
                                    errorAddingItem={this.props.statusOfAddingItem.error}
                                    successAddingItem={this.props.statusOfAddingItem.success}
                                    doThisOnSubmit={userInput => {
                                        if (userInput) {
                                            this.props.actions.createItem(
                                                userInput,
                                                "some_ID",
                                                this.props.collectionOfItems
                                            );
                                        }
                                    }}
                                />
                                {this.state.successAddingItem
                                    ? <Message positive>added item!</Message>
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
                            <Segment basic loading={asyncItems}>

                                {this.state.statusOfLoadingItems.error
                                    ? <Message negative>
                                          internal server error
                                      </Message>
                                    : this.renderItems()}

                                <Modal
                                    open={this.state.userIsEditingItem}
                                    size="huge"
                                >
                                    <Segment>
                                        <Button
                                            type="button"
                                            floated="right"
                                            icon="remove"
                                            onClick={() => {
                                                this.props.actions.editItem(
                                                    "",
                                                    true
                                                );
                                            }}
                                        />
                                    </Segment>
                                    <Modal.Content>

                                        <Grid columns={2} as={Segment} basic>
                                            <Grid.Column width={9}>
                                                <EditNeed
                                                    collectionOfItems={
                                                        collectionOfItems
                                                    }
                                                    idOfEditedItem={
                                                        this.props
                                                            .statusOfEditItem.idOfItem
                                                    }
                                                    updateItem={this.props.actions.updateItem.bind(
                                                        this
                                                    )}
                                                />
                                            </Grid.Column>
                                            <Grid.Column width={7}>
                                                <Need
                                                    isPreview={true}
                                                    description={
                                                        this.state.userIsEditingItem
                                                            ? model.get(
                                                                  "description"
                                                              )
                                                            : null
                                                    }
                                                    nameOfItem={
                                                        this.state.userIsEditingItem
                                                            ? model.get(
                                                                  "nameOfItem"
                                                              )
                                                            : null
                                                    }
                                                    degreeOfNeed={
                                                        this.state.userIsEditingItem
                                                            ? model.get(
                                                                  "degreeOfNeed"
                                                              )
                                                            : null
                                                    }
                                                    numberOfPeople={
                                                        this.state.userIsEditingItem
                                                            ? model.get(
                                                                  "numberOfPeople"
                                                              )
                                                            : null
                                                    }
                                                    idOfItem={statusOfEditItem.idOfItem}
                                                    collectionOfItems={
                                                        this.props
                                                            .collectionOfItems
                                                    }
                                                />
                                                {this.state.successUpdatingItem
                                                    ? <Message positive>
                                                          updated successfully
                                                      </Message>
                                                    : null}
                                                {this.state.errorUpdatingItem
                                                    ? <Message negative>
                                                          something went wrong
                                                      </Message>
                                                    : null}
                                            </Grid.Column>

                                        </Grid>

                                    </Modal.Content>
                                </Modal>

                                <Modal open={this.state.itemRemovalPromptOpen}>
                                    <Button
                                        icon="close"
                                        basic
                                        floated="right"
                                        onClick={() => {
                                            this.props.actions.resetStatus(
                                                "removingItem"
                                            );
                                        }}
                                    />

                                    <Modal.Header>
                                        are you sure you want to delete this item?
                                    </Modal.Header>
                                    <Modal.Content>

                                        <Button
                                            onClick={() => {
                                                this.props.actions.resetStatus(
                                                    "removingItem"
                                                );
                                            }}
                                            positive
                                        >
                                            no
                                        </Button>

                                        <Button
                                            onClick={() => {
                                                this.props.actions.removeItem(
                                                    statusOfRemoveItem.idOfItem,
                                                    collectionOfItems,
                                                    false
                                                );
                                            }}
                                            negative
                                        >
                                            yes
                                        </Button>

                                        {this.state.statusOfRemoveItem.error
                                            ? <Message negative>
                                                  something went wrong
                                              </Message>
                                            : null}

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
