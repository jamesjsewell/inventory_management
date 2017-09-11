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

import EditItem from "./EditItem.jsx";
import Item from "./Item.jsx";
import NewItemForm from "./NewItemForm.jsx";

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
            userIsEditingItem: false,
            loggedIn: false
        };
    }
    componentWillMount() {
        if (!this.props.collectionOfItems) {
            this.props.actions.fetchItems();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.statusOfEditItem.inProgress === true) {
            this.state.userIsEditingItem = true;
        }
        else{
            this.state.userIsEditingItem = false
        }

        if (
            nextProps.statusOfUpdateItem.success &&
            !this.state.successUpdatingItem
        ) {
            this.handleMessage(true, "updateItem");
        }

        if (
            nextProps.statusOfUpdateItem.error &&
            !this.state.errorUpdatingItem
        ) {
            this.handleMessage(false, "updateItem");
        }

        if (nextProps.statusOfRemoveItemPrompt.inProgress) {
            this.handleMessage(true, "itemRemovalPrompt");
        } else {
            this.handleMessage(false, "itemRemovalPrompt");
        }

        if (nextProps.statusOfRemoveItem.error) {
            this.handleMessage(false, "removeItem");
        }

        if(nextProps.user){
            this.state.userId = nextProps.user._id
            this.state.loggedIn = true
        }
        else{
            this.state.loggedIn = false
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
            if (success === true) {
                this.state.successLoadingItems = true;
                this.state.errorLoadingItems = false;
            }

            if (success === false) {
                this.state.errorLoadingItems = true;
                this.state.successLoadingItems = false;
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
            if (success === true) {
                //removing item
            } else {
                this.state.errorRemovingItem = true;
                this.state.errorRemovingItem = setTimeout(() => {
                    this.props.actions.resetStatus("removingItem");
                    this.setState({ errorRemovingItem: false });
                }, 5000);
            }
        }

        if (type === "itemRemovalPrompt") {
            if (success === true) {
                this.state.itemRemovalPromptOpen = true;
            } else {
                this.state.itemRemovalPromptOpen = false;
            }
        }
    }

    renderItems() {
        var arrayOfItemElements = [];

        if (this.props.arrayOfItems) {
            for (var i = 0; i < this.props.arrayOfItems.length; i++) {
                arrayOfItemElements.push(
                    <Item
                        userId={this.state.userId}
                        isPreview={this.state.loggedIn? false : true}
                        updateItem={this.props.actions.updateItem.bind(this)}
                        removeItem={this.props.actions.removeItem.bind(this)}
                        editItem={this.props.actions.editItem.bind(this)}
                        nameOfItem={
                            this.props.arrayOfItems[i].attributes.nameOfItem
                        }
                        descriptionOfItem={
                            this.props.arrayOfItems[i].attributes.description
                        }
                        members={this.props.arrayOfItems[i].attributes.members}
                        idOfItem={this.props.arrayOfItems[i].attributes._id}
                        idOfUpdatedItem={this.props.statusOfUpdateItem.idOfItem}
                        collectionOfItems={this.props.collectionOfItems}
                        errorUpdatingItem={this.props.statusOfUpdateItem.error}
                        successUpdatingItem={this.state.successUpdatingItem}
                        resetStatus={this.props.actions.resetStatus.bind(this)}
                        errorRemovingItem={this.state.errorRemovingItem}
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
        
        const asyncItems = this.props.statusOfFetchItems.inProgress ||
            this.props.statusOfCreateItem.inProgress
            ? true
            : false;

        var userIsEditingItem = this.props.statusOfEditItem.inProgress;

        const {
            collectionOfItems,
            idOfEditedItem,
            idOfItemToRemove,
            statusOfRemoveItem,
            statusOfRemoveItemPrompt,
            user
        } = this.props;

        if (this.state.errorLoadingItems) {
            this.handleMessage(false, "loadingItems");
        }
        if (this.state.userIsEditingItem) {
            if (this.props.collectionOfItems) {
                var model = this.props.collectionOfItems.get(
                    this.props.statusOfEditItem.idOfItem
                );
                
            }
        }
      
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
                                <NewItemForm
                                    userId={this.state.userId}
                                    resetStatus={this.props.actions.resetStatus.bind(
                                        this
                                    )}
                                    errorAddingItem={
                                        this.props.statusOfCreateItem.error
                                    }
                                    successAddingItem={
                                        this.props.statusOfCreateItem.success
                                    }
                                    doThisOnSubmit={userInput => {
                                        if (userInput) {
                                            this.props.actions.createItem(
                                                userInput,
                                                this.state.userId,
                                                this.props.collectionOfItems
                                            );
                                        }
                                    }}
                                />
                                {this.state.successAddingItem
                                    ? <Message positive>added item!</Message>
                                    : null}

                            </Segment>

                            <Segment basic loading={asyncItems}>

                                {this.props.statusOfFetchItems.error
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
                                                <EditItem
                                                    collectionOfItems={
                                                        collectionOfItems
                                                    }
                                                    idOfEditedItem={
                                                        this.props
                                                            .statusOfEditItem
                                                            .idOfItem
                                                    }
                                                    updateItem={this.props.actions.updateItem.bind(
                                                        this
                                                    )}
                                                />
                                            </Grid.Column>
                                            <Grid.Column width={7}>
                                                <Item
                                                    isPreview={true}
                                                    description={
                                                        this.state
                                                            .userIsEditingItem && model
                                                            ? model.get(
                                                                  "description"
                                                              )
                                                            : null
                                                    }
                                                    nameOfItem={
                                                        this.state
                                                            .userIsEditingItem && model
                                                            ? model.get(
                                                                  "nameOfItem"
                                                              )
                                                            : null
                                                    }
                                                    idOfItem={
                                                        this.props
                                                            .statusOfEditItem
                                                            .idOfItem
                                                    }
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
                                                    statusOfRemoveItemPrompt.idOfItem,
                                                    collectionOfItems,
                                                    false
                                                );
                                            }}
                                            negative
                                        >
                                            yes
                                        </Button>

                                        {this.props.statusOfRemoveItem.error
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
