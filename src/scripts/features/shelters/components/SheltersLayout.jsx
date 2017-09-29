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
    Modal,
    Menu,
    Dimmer,
    Loader
} from "semantic-ui-react";

import EditItem from "./EditItem.jsx";
import Item from "./Item.jsx";
import NewItemForm from "./NewItemForm.jsx";
import MapView from "./MapView.jsx";
import Navbar from "../../navbar/components/NavbarView.jsx";

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
            userIsCreatingItem: false,
            loggedIn: false,
            instructions: false,
            options: false,
            showSpinner: false
        };
    }
    componentWillMount() {
        if (!this.props.collectionOfItems) {
            this.props.actions.fetchItems();
        }
    }
    componentWillReceiveProps(nextProps) {

        if(!this.props.choseShelter && nextProps.choseShelter){
            if(nextProps.user){
                this.props.history.push(`${this.props.homeLink}/${nextProps.user.currentShelter}`)
            }
            else{
                this.props.history.push(this.props.homeLink)
            }
        }

        if (nextProps.showSpinner) {
            this.state.showSpinner = true;
        } else {
            this.state.showSpinner = false;
        }
        if (
            nextProps.statusOfCreateShelter.inProgress === true &&
            !this.state.userIsCreatingItem
        ) {
            this.handleUserAction("creating", nextProps.newShelterPlace);
        }

        if (
            this.props.statusOfCreateShelter.inProgress === true &&
            !nextProps.statusOfCreateShelter.inProgress
        ) {
            this.state.userIsCreatingItem = false;
        }

        if (!this.props.newShelterId && nextProps.newShelterId) {
            this.handleUserAction("doneCreating", nextProps.newShelterId);
        }

        if (nextProps.user && this.props.user) {
            if (
                nextProps.user.currentShelter != this.props.user.currentShelter
            ) {
                if (nextProps.user.currentShelter) {
                    this.props.history.push(
                        `${this.props.homeLink}/${nextProps.user.currentShelter}`
                    );
                }
            }
        }

        //////

        if (this.props.shelterCookie) {
            if (this.props.shelterCookie != nextProps.shelterCookie) {
                this.handleUserAction("newShelterCookie");
            }
        }

        if (nextProps.statusOfEditItem.inProgress === true) {
            this.state.userIsEditingItem = true;
        } else {
            this.state.userIsEditingItem = false;
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

        if (nextProps.user) {
            this.state.userId = nextProps.user._id;
            this.state.loggedIn = true;
        } else {
            this.state.loggedIn = false;
        }
    }

    handleUserAction(type, data) {
        if (type === "creating") {
            this.state.userIsCreatingItem = true;
        }
        if (type === "doneCreating") {
            this.state.userIsCreatingItem = false;
            var shelterId = data;

            this.props.actions.openShelter(shelterId, this.props.user._id);

            this.props.actions.resetStatus("addingItem");
        }

        if (type == "savedShelterOnUser") {
            this.props.actions.resetStatus("creating");
            this.props.history.push(this.props.homeLink);
        }

        if (type === "newShelterCookie") {
            this.props.history.push(this.props.homeLink);
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
                        isPreview={this.state.loggedIn ? false : true}
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
            <Modal
                open
                size="fullscreen"
                style={{ overflow: "hidden", width: "90vw", height: "90vh" }}
            >

                <Navbar as={Menu} size="mini" compact attached />
                <Label
                    corner
                    size="medium"
                    icon="question"
                    onClick={() => {
                        this.setState({ instructions: true });
                    }}
                />

                <Dimmer.Dimmable
                    as={Segment}
                    attached
                    basic
                    dimmed={this.state.showSpinner}
                    blurring={true}
                >
                    <Loader inverted disabled={!this.state.showSpinner} />

                    <MapView attached as={Segment} {...this.props} />
                </Dimmer.Dimmable>

                <Modal open={this.state.userIsCreatingItem} size="large">

                    <Segment basic>
                        <Segment
                            basic
                            size="tiny"
                            clearing
                            floating="right"
                            textAlign="right"
                        >
                            <Button
                                size="mini"
                                icon="remove"
                                onClick={() => {
                                    this.props.actions.resetStatus("creating");
                                    this.setState({
                                        userIsCreatingItem: false
                                    });
                                }}
                            />
                        </Segment>

                        <Segment>
                            <Header>
                                {this.props.newShelterPlace
                                    ? this.props.newShelterPlace.name
                                    : null}
                            </Header>

                            <Header.Subheader>
                                {this.props.newShelterPlace
                                    ? this.props.newShelterPlace
                                          .formatted_address
                                    : null}
                            </Header.Subheader>

                        </Segment>

                        <Segment size="large" loading={asyncItems}>
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
                                            this.props.collectionOfItems,
                                            this.props.newShelterPlace
                                        );
                                    }
                                }}
                            />
                            {this.state.successAddingItem
                                ? <Message positive>
                                      added item!
                                  </Message>
                                : null}

                            {this.state.errorAddingItem
                                ? <Message negative>
                                      something went wrong
                                  </Message>
                                : null}

                        </Segment>

                    </Segment>

                </Modal>

                <Modal size="large" open={this.state.instructions} basic>

                    <Button
                        basic
                        inverted
                        floated="right"
                        size="mini"
                        icon="remove"
                        onClick={() => {
                            this.setState({ instructions: false });
                        }}
                    />

                    <Modal.Content size="massive">

                        <Container as={Segment} basic size="massive" text>
                            This is a custom version of google maps. It allows you to search for a place in the world and add a "shelter" there, or view the shelter that has already been assigned to the place. Search and navigate the map just as you would in Google Maps. Zoom and street view features can be found at the bottom right corner of the map.
                        </Container>

                    </Modal.Content>

                </Modal>
            </Modal>
        );
    }
}

// {this.props.statusOfFetchItems.error
// ? <Message negative>
//       internal server error
//   </Message>
// : this.renderItems()}
