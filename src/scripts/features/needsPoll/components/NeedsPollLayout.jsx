import React, { Component } from "react";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import _ from "underscore";

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
    Search,
    Dimmer,
    Loader
} from "semantic-ui-react";

import NeedForm from "./NeedForm.jsx";

import Need from "./Need.jsx";

import EditNeed from "./EditNeed.jsx";

import EditItem from "./EditShelter.jsx";

export default class NeedsPollLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorLoadingNeeds: false,
            successAddingNeed: false,
            editingNeed: false,
            updatedNeed: false,
            errorUpdatingNeed: false,
            needRemovalPrompt: false,
            errorRemovingNeed: false,
            fetchNeeds: false,
            fetchedNeeds: false,
            fetchedShelter: false,
            fetchedUser: false,
            currentShelterCookie: null,
            description: false,
            noShelter: false,
            didReset: false,
            currentShelter: null,
            user: null,
            shelterMode: null,
            shelterName: null,
            shelterId: null,
            shelterDescription: null,
            shelterPlace: null,
            errorUpdatingItem: null,
            successUpdatingItem: null,
            itemRemovalPrompt: false,
            errorRemovingItem: false,
            successRemovingItem: false,
            filterNeeds: false,
            searchValue: "",
            searchResults: null,
            chosenResult: null,
            showSpinner: false
        };

        this.props.actions.fetchItems();
    }

    componentWillMount() {
        this.props.actions.resetStatus("shelter");
        this.state.fetchedShelter = false;
        this.state.fetchedNeeds = false;
        this.state.noShelter = false;

        if (this.props.shelterCookie) {
            this.props.actions.fetchShelter(this.props.shelterCookie);
        }

        if (this.props.match.params.openedShelter) {
            this.props.actions.fetchShelter(
                this.props.match.params.openedShelter
            );
            this.state.noShelter = false;
            this.state.fetchedShelter = true;
        }
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {
        if (nextProps.showSpinner === true) {
            this.state.showSpinner = true;
        } else {
            this.state.showSpinner = false;
        }
        if (nextProps.editingNeed) {
            this.state.editingNeed = true;
        }

        if (nextProps.updatedNeed && !this.state.updatedNeed) {
            this.handleMessage(true, "updatingNeed");
        }

        if (nextProps.errorUpdatingNeed && !this.state.errorUpdatingNeed) {
            this.handleMessage(false, "updatingNeed");
        }

        if (nextProps.needRemovalPrompt) {
            this.handleMessage(null, "removingNeed");
        } else {
            this.state.needRemovalPrompt = false;
        }

        if (nextProps.errorRemovingNeed) {
            this.handleMessage(false, "errorRemovingNeed");
        }

        // gets needs
        if (
            this.state.fetchedShelter &&
            nextProps.shelter &&
            !this.state.fetchedNeeds
        ) {
            this.state.noShelter = false;
            this.state.fetchedNeeds = true;
            this.state.currentShelter = nextProps.shelter._id;
            this.props.actions.fetchNeeds(nextProps.shelter._id);
            this.state.user = this.props.user;
        }

        if (!this.props.match.params.openedShelter) {
            if (!this.state.fetchedShelter && nextProps.user) {
                if (nextProps.user.currentShelter) {
                    this.state.noShelter = false;
                    this.state.fetchedShelter = true;
                    this.state.fetchedNeeds = false;
                    this.props.actions.fetchShelter(
                        nextProps.user.currentShelter
                    );
                }
            }
        }

        if (nextProps.user) {
            if (!nextProps.user.currentShelter) {
                this.state.noShelter = true;
            }
        }

        //gets needs from sheltercookie if no one is logged in
        if (
            !this.state.fetchedNeeds &&
            nextProps.shelterCookie &&
            nextProps.shelter
        ) {
            this.state.noShelter = false;
            this.state.fetchedNeeds = true;
            this.props.actions.fetchNeeds(nextProps.shelter._id);
        }

        //up to date gets shelter model
        if (nextProps.collectionOfShelters && nextProps.shelter) {
            if (nextProps.collectionOfShelters.get(nextProps.shelter._id)) {
                this.state.shelterModel = nextProps.collectionOfShelters.get(
                    nextProps.shelter._id
                );

                const shelter = this.state.shelterModel &&
                    this.state.shelterModel.attributes
                    ? this.state.shelterModel.attributes
                    : null;
                this.state.shelterName = shelter ? shelter.nameOfItem : null;
                this.state.shelterId = shelter ? shelter._id : null;
                this.state.shelterDescription = shelter
                    ? shelter.description
                    : null;
                this.state.shelterPlace = shelter ? shelter.place : null;
            }
        }

        if (nextProps.statusOfUpdateItem) {
            if (
                nextProps.statusOfUpdateItem.success &&
                !this.props.statusOfUpdateItem.success
            ) {
                this.handleMessage(true, "updateItem");
            }

            if (nextProps.statusOfUpdateItem.error) {
                this.handleMessage(false, "updateItem");
            }
        }

        if (nextProps.statusOfRemoveItem) {
            if (
                nextProps.statusOfRemoveItem.success &&
                !this.props.statusOfRemoveItem.success
            ) {
                this.handleMessage(true, "removeItem");
            }

            if (nextProps.statusOfRemoveItem.error) {
                this.handleMessage(false, "removeItem");
            }
        }
    }

    handleMessage(success, type) {
        if (type === "addingNeed") {
            if (success === true) {
                this.state.successAddingNeed = true;

                this.state.successAddingNeed = setTimeout(() => {
                    this.props.actions.resetStatus("addingNeed");
                    this.setState({ successAddingNeed: false });
                }, 5000);
            }
        }

        if (type === "loadingNeeds") {
            if (success === false) {
                this.state.errorLoadingNeeds = true;
            }
        }

        if (type === "updatingNeed") {
            if (success === true) {
                this.state.updatedNeed = true;
                this.state.errorUpdatingNeed = false;

                this.state.updatedNeed = setTimeout(() => {
                    this.props.actions.resetStatus("updatingNeed");
                    this.setState({ updatedNeed: false });
                }, 5000);
            } else {
                this.state.updatedNeed = false;
                this.state.errorUpdatingNeed = true;

                this.state.errorUpdatingNeed = setTimeout(() => {
                    this.props.actions.resetStatus("updatingNeed");
                    this.setState({ errorUpdatingNeed: false });
                }, 5000);
            }
        }

        if (type === "removingNeed") {
            this.state.needRemovalPrompt = true;
        }

        if (type === "errorRemovingNeed") {
            this.state.errorRemovingNeed = true;
            this.state.errorRemovingNeed = setTimeout(() => {
                this.props.actions.resetStatus("removingNeed");
                this.setState({ errorRemovingNeed: false });
            }, 5000);
        }

        if (type === "updateItem") {
            if (success) {
                this.state.successUpdatingItem = true;
                this.state.successUpdatingItem = setTimeout(() => {
                    this.props.actions.resetStatus("updatingItem");
                    this.setState({ successUpdatingItem: false });
                }, 5000);
            } else {
                this.state.errorUpdatingItem = true;
                this.state.errorUpdatingItem = setTimeout(() => {
                    this.props.actions.resetStatus("updatingItem");
                    this.setState({ errorUpdatingItem: false });
                }, 5000);
            }
        }

        if (type === "removeItem") {
            if (success) {
                this.props.history.replace(`../${this.props.sheltersMapPath}`);
            } else {
                this.state.errorRemovingItem = true;
                this.state.errorRemovingItem = setTimeout(() => {
                    this.props.actions.resetStatus("removingItem");
                    this.setState({ errorRemovingItem: false });
                }, 5000);
            }
        }
    }

    handleResultSelect(e, result) {
        this.setState({ searchValue: result.title });

        if (result.title) {
            var found = _.find(this.props.arrayOfNeeds, need => {
                if (need.attributes.nameOfNeed === result.title) {
                    return need;
                }
            });

            this.setState({ chosenResult: found });

            return;
        }

        if (result.description) {
            var found = _.find(this.props.arrayOfNeeds, need => {
                if (need.attributes.description === result.description) {
                    return need;
                }
            });

            this.setState({ chosenResult: found });

            return;
        }
    }

    handleSearchChange(e, value) {
        e.preventDefault();

        this.setState({ searchValue: value });

        if (this.props.arrayOfNeeds) {
            var filtered = _.filter(this.props.arrayOfNeeds, function(need) {
                if (need.attributes.nameOfNeed.toLowerCase().includes(e.target.value.toLowerCase())) {
                    return need.attributes;
                }
                if (need.attributes.description.toLowerCase().includes(e.target.value.toLowerCase())) {
                    return need.attributes;
                }
            });

            for (var i = 0; i < filtered.length; i++) {
                filtered[i] = {
                    title: filtered[i].attributes.nameOfNeed,
                    description: filtered[i].attributes.description
                };
            }
            if (filtered.length > 0) {
                this.setState({ searchResults: filtered });
            }
        }

        if (!value) {
            this.setState({ chosenResult: null });
        }
    }

    renderNeeds(filter) {
        if (filter) {
            if (this.state.chosenResult) {
                return (
                    <Need
                        isPreview={this.props.user ? false : true}
                        updateNeed={this.props.actions.updateNeed.bind(this)}
                        removeNeed={this.props.actions.removeNeed.bind(this)}
                        nameOfNeed={
                            this.state.chosenResult.attributes.nameOfNeed
                        }
                        degreeOfNeed={
                            this.state.chosenResult.attributes.degreeOfNeed
                        }
                        numberOfPeople={
                            this.state.chosenResult.attributes.numberOfPeople
                        }
                        description={
                            this.state.chosenResult.attributes.description
                        }
                        idOfNeed={this.state.chosenResult.attributes._id}
                        idOfUpdatedNeed={this.props.idOfUpdatedNeed}
                        collectionOfNeeds={this.props.collectionOfNeeds}
                        editNeed={this.props.actions.editNeed.bind(this)}
                        errorUpdatingNeed={this.props.errorUpdatingNeed}
                        updatedNeed={this.props.updatedNeed}
                        resetStatus={this.props.actions.resetStatus.bind(this)}
                        errorRemovingNeed={this.props.errorRemovingNeed}
                    />
                );
            } else {
                return null;
            }
        } else {
            var arrayOfNeedElements = [];

            if (this.props.arrayOfNeeds) {
                for (var i = 0; i < this.props.arrayOfNeeds.length; i++) {
                    arrayOfNeedElements.push(
                        <Need
                            isPreview={this.props.user ? false : true}
                            updateNeed={this.props.actions.updateNeed.bind(
                                this
                            )}
                            removeNeed={this.props.actions.removeNeed.bind(
                                this
                            )}
                            nameOfNeed={
                                this.props.arrayOfNeeds[i].attributes.nameOfNeed
                            }
                            degreeOfNeed={
                                this.props.arrayOfNeeds[i].attributes
                                    .degreeOfNeed
                            }
                            numberOfPeople={
                                this.props.arrayOfNeeds[i].attributes
                                    .numberOfPeople
                            }
                            description={
                                this.props.arrayOfNeeds[i].attributes
                                    .description
                            }
                            idOfNeed={this.props.arrayOfNeeds[i].attributes._id}
                            idOfUpdatedNeed={this.props.idOfUpdatedNeed}
                            collectionOfNeeds={this.props.collectionOfNeeds}
                            editNeed={this.props.actions.editNeed.bind(this)}
                            errorUpdatingNeed={this.props.errorUpdatingNeed}
                            updatedNeed={this.props.updatedNeed}
                            resetStatus={this.props.actions.resetStatus.bind(
                                this
                            )}
                            errorRemovingNeed={this.props.errorRemovingNeed}
                        />
                    );

                    if (i != this.props.arrayOfNeeds.length - 1) {
                        arrayOfNeedElements.push(<Divider />);
                    }
                }

                return arrayOfNeedElements;
            } else {
                return null;
            }
        }
    }

    render() {
        const asyncNeeds = this.props.loadingNeeds || this.props.addingNeed
            ? true
            : false;

        const {
            errorLoadingNeeds,
            addedNeed,
            errorAddingNeed,
            editingNeed,
            updatedNeed,
            errorUpdatingNeed,
            collectionOfNeeds,
            idOfEditedNeed,
            idOfUpdatedNeed,
            idOfNeedToRemove,
            errorRemovingNeed
        } = this.props;

        if (errorLoadingNeeds) {
            this.handleMessage(false, "loadingNeeds");
        }
        if (editingNeed) {
            var model = this.props.collectionOfNeeds.get(idOfEditedNeed);
        }

        return !this.state.noShelter &&
            this.props.shelter &&
            this.state.shelterModel
            ? <Grid container columns="equal" stackable>
                  <Grid.Row>
                      
                      <Grid.Column width={16}>

                          <Segment
                              loading={this.state.showSpinner}
                              size="large"
                              textAlign="center"
                          >
                              {this.props.user
                                  ? <Button
                                        floated="left"
                                        onClick={() => {
                                            this.setState({
                                                editingShelter: true
                                            });
                                        }}
                                        size="small"
                                    >
                                        edit
                                    </Button>
                                  : null}
                              {this.props.user
                                  ? <Button
                                        floated="right"
                                        icon="remove"
                                        size="small"
                                        onClick={() => {
                                            this.setState({
                                                itemRemovalPrompt: true
                                            });
                                        }}
                                    />
                                  : null}
                              <Header size="huge">
                                  {this.state.shelterName}

                              </Header>

                              <Header.Subheader>
                                  {this.state.shelterPlace
                                      ? this.state.shelterPlace.name
                                      : null}
                                  <Divider />
                                  {this.state.shelterPlace
                                      ? this.state.shelterPlace
                                            .formatted_address
                                      : null}
                              </Header.Subheader>
                              <Segment attached="top">
                                  <Button
                                      type="button"
                                      onClick={e => {
                                          e.preventDefault();
                                          if (
                                              this.state.description === false
                                          ) {
                                              this.setState({
                                                  description: true
                                              });
                                          } else {
                                              this.setState({
                                                  description: false
                                              });
                                          }
                                      }}
                                      basic
                                      size="tiny"
                                      icon={
                                          this.state.description
                                              ? "minus"
                                              : "add"
                                      }
                                  /> description
                              </Segment>

                              <Segment attached="bottom" size="small">

                                  {this.state.description
                                      ? <Container fluid text textAlign="left">
                                            {this.state.shelterDescription}
                                        </Container>
                                      : null}
                              </Segment>
                          </Segment>

                          <Segment loading={this.state.showSpinner}>
                              {this.props.user
                                  ? <Segment compact loading={asyncNeeds}>
                                        <NeedForm
                                            user={this.props.user}
                                            currentShelterId={
                                                this.props.shelter._id
                                            }
                                            resetStatus={this.props.actions.resetStatus.bind(
                                                this
                                            )}
                                            errorAddingNeed={
                                                this.props.errorAddingNeed
                                            }
                                            addedNeed={this.props.addedNeed}
                                            doThisOnSubmit={userInput => {
                                                if (userInput) {
                                                    this.props.actions.submitNewNeed(
                                                        userInput,
                                                        "some_ID",
                                                        this.props
                                                            .collectionOfNeeds,
                                                        this.props.user
                                                            .currentShelter
                                                    );
                                                }
                                            }}
                                        />
                                        {this.state.successAddingNeed
                                            ? <Message positive>
                                                  added need!
                                              </Message>
                                            : null}
                                        <Divider />
                                        <Segment>
                                            <Header>
                                                search existing needs
                                            </Header>
                                            <Search
                                                loading={""}
                                                onResultSelect={this.handleResultSelect.bind(
                                                    this
                                                )}
                                                onSearchChange={this.handleSearchChange.bind(
                                                    this
                                                )}
                                                value={this.state.searchValue}
                                                results={
                                                    this.state.searchResults
                                                }
                                                {...this.props}
                                            />
                                        </Segment>
                                    </Segment>
                                  : <Segment>
                                        <Header>
                                            search existing needs
                                        </Header>
                                        <Search
                                            loading={""}
                                            onResultSelect={this.handleResultSelect.bind(
                                                this
                                            )}
                                            onSearchChange={this.handleSearchChange.bind(
                                                this
                                            )}
                                            value={this.state.searchValue}
                                            results={this.state.searchResults}
                                            {...this.props}
                                        />
                                    </Segment>}
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

                              <Segment basic loading={asyncNeeds}>
                                  {this.state.chosenResult
                                      ? <Button
                                            onClick={e => {
                                                e.preventDefault();
                                                this.setState({
                                                    chosenResult: null
                                                });
                                            }}
                                        >
                                            show all needs
                                        </Button>
                                      : null}

                                  {this.state.chosenResult
                                      ? this.renderNeeds(true)
                                      : this.renderNeeds()}

                                  <Modal
                                      open={this.state.editingShelter}
                                      size="huge"
                                  >
                                      <Segment basic>
                                          <Button
                                              type="button"
                                              floated="right"
                                              icon="remove"
                                              onClick={() => {
                                                  this.setState({
                                                      editingShelter: false
                                                  });
                                              }}
                                          />
                                      </Segment>
                                      <Modal.Content>

                                          <Grid
                                              columns={2}
                                              as={Segment}
                                              stackable
                                              basic
                                          >
                                              <Grid.Column width={6}>
                                                  <EditItem
                                                      itemModel={
                                                          this.state
                                                              .shelterModel
                                                      }
                                                      itemsCollection={
                                                          this.props
                                                              .collectionOfShelters
                                                      }
                                                      idOfEditedItem={
                                                          this.props.shelter._id
                                                      }
                                                      updateItem={this.props.actions.updateItem.bind(
                                                          this
                                                      )}
                                                  />
                                              </Grid.Column>
                                              <Grid.Column width={10}>
                                                  <Segment
                                                      basic
                                                      size="huge"
                                                      textAlign="center"
                                                  >

                                                      <Header>
                                                          {
                                                              this.state
                                                                  .shelterName
                                                          }

                                                      </Header>

                                                      <Header.Subheader>
                                                          {this.state
                                                              .shelterPlace
                                                              ? this.state
                                                                    .shelterPlace
                                                                    .name
                                                              : null}
                                                          <Divider />
                                                          {this.state
                                                              .shelterPlace
                                                              ? this.state
                                                                    .shelterPlace
                                                                    .formatted_address
                                                              : null}
                                                      </Header.Subheader>
                                                      <Segment attached="top">
                                                          <Button
                                                              type="button"
                                                              onClick={e => {
                                                                  e.preventDefault();
                                                                  if (
                                                                      this.state
                                                                          .description ===
                                                                      false
                                                                  ) {
                                                                      this.setState(
                                                                          {
                                                                              description: true
                                                                          }
                                                                      );
                                                                  } else {
                                                                      this.setState(
                                                                          {
                                                                              description: false
                                                                          }
                                                                      );
                                                                  }
                                                              }}
                                                              basic
                                                              size="tiny"
                                                              icon={
                                                                  this.state
                                                                      .description
                                                                      ? "minus"
                                                                      : "add"
                                                              }
                                                          /> description
                                                      </Segment>

                                                      <Segment
                                                          attached="bottom"
                                                          size="small"
                                                      >

                                                          {this.state
                                                              .description
                                                              ? <Container
                                                                    fluid
                                                                    text
                                                                    textAlign="left"
                                                                >
                                                                    {
                                                                        this
                                                                            .state
                                                                            .shelterDescription
                                                                    }
                                                                </Container>
                                                              : null}
                                                      </Segment>
                                                  </Segment>
                                                  {this.state
                                                      .successUpdatingItem
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

                                  <Modal
                                      open={this.props.editingNeed}
                                      size="large"
                                  >
                                      <Dimmer active={this.state.showSpinner}>
                                          <Loader />
                                      </Dimmer>
                                      <Segment>
                                          <Button
                                              type="button"
                                              floated="right"
                                              icon="remove"
                                              onClick={() => {
                                                  this.props.actions.editNeed(
                                                      "",
                                                      true
                                                  );
                                              }}
                                          />
                                      </Segment>
                                      <Modal.Content>

                                          <Grid
                                              columns={2}
                                              as={Segment}
                                              stackable
                                              basic
                                          >
                                              <Grid.Column width={7}>
                                                  <EditNeed
                                                      needsCollection={
                                                          collectionOfNeeds
                                                      }
                                                      idOfEditedNeed={
                                                          this.props
                                                              .idOfEditedNeed
                                                      }
                                                      updateNeed={this.props.actions.updateNeed.bind(
                                                          this
                                                      )}
                                                  />
                                              </Grid.Column>
                                              <Grid.Column width={9}>
                                                  <Need
                                                      isPreview={true}
                                                      description={
                                                          editingNeed
                                                              ? model.get(
                                                                    "description"
                                                                )
                                                              : null
                                                      }
                                                      nameOfNeed={
                                                          editingNeed
                                                              ? model.get(
                                                                    "nameOfNeed"
                                                                )
                                                              : null
                                                      }
                                                      degreeOfNeed={
                                                          editingNeed
                                                              ? model.get(
                                                                    "degreeOfNeed"
                                                                )
                                                              : null
                                                      }
                                                      numberOfPeople={
                                                          editingNeed
                                                              ? model.get(
                                                                    "numberOfPeople"
                                                                )
                                                              : null
                                                      }
                                                      idOfNeed={idOfEditedNeed}
                                                      collectionOfNeeds={
                                                          this.props
                                                              .collectionOfNeeds
                                                      }
                                                  />
                                                  {this.state.updatedNeed
                                                      ? <Message positive>
                                                            updated successfully
                                                        </Message>
                                                      : null}
                                                  {this.state.errorUpdatingNeed
                                                      ? <Message negative>
                                                            something went wrong
                                                        </Message>
                                                      : null}
                                              </Grid.Column>

                                          </Grid>

                                      </Modal.Content>
                                  </Modal>

                                  <Modal open={this.state.itemRemovalPrompt}>
                                      <Button
                                          icon="close"
                                          basic
                                          floated="right"
                                          onClick={() => {
                                              this.setState({
                                                  itemRemovalPrompt: false
                                              });
                                          }}
                                      />

                                      <Modal.Header>
                                          are you sure you want to delete this shelter?
                                      </Modal.Header>
                                      <Modal.Content>

                                          <Button
                                              onClick={() => {
                                                  this.setState({
                                                      itemRemovalPrompt: false
                                                  });
                                              }}
                                              positive
                                          >
                                              no
                                          </Button>

                                          <Button
                                              onClick={() => {
                                                  this.props.actions.removeItem(
                                                      this.props.shelter._id,
                                                      this.props
                                                          .collectionOfShelters
                                                  );
                                              }}
                                              negative
                                          >
                                              yes
                                          </Button>

                                          {this.state.errorRemovingItem
                                              ? <Message negative>
                                                    something went wrong
                                                </Message>
                                              : null}

                                      </Modal.Content>

                                  </Modal>

                                  <Modal open={this.state.needRemovalPrompt}>
                                      <Button
                                          icon="close"
                                          basic
                                          floated="right"
                                          onClick={() => {
                                              this.props.actions.resetStatus(
                                                  "removingNeed"
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
                                                      "removingNeed"
                                                  );
                                              }}
                                              positive
                                          >
                                              no
                                          </Button>

                                          <Button
                                              onClick={() => {
                                                  this.props.actions.removeNeed(
                                                      idOfNeedToRemove,
                                                      collectionOfNeeds,
                                                      false
                                                  );
                                              }}
                                              negative
                                          >
                                              yes
                                          </Button>

                                          {this.props.errorRemovingNeed
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
            : <Segment>
                  <Segment basic loading />
                  <Container as={Segment} size="huge" text>
                      Loading the most recent shelter that you have entered. If this takes more than a few seconds, you may not have entered a shelter. Use the map to find or create a shelter.

                  </Container>
                  <Segment>
                      <Button
                          onClick={() => {
                              this.props.history.push(
                                  this.props.sheltersMapPath
                              );
                          }}
                          positive
                      >
                          open map
                      </Button>
                  </Segment>
              </Segment>;
    }
}
