import {
    GoogleMap,
    Marker,
    withGoogleMap,
    InfoWindow,
    OverlayView
} from "react-google-maps";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";
import InfoBox from "react-google-maps/lib/addons/infobox";
import {
    Button,
    Grid,
    Segment,
    Input,
    Form,
    Header,
    Container,
    Message,
    Divider,
    Item,
    Label,
    Profile,
    Icon,
    Image,
    Modal,
    Loader
} from "semantic-ui-react";

//   /* global google */
// import React, { Component } from "react";
import { default as React, Component } from "react";
const INPUT_STYLE = {
    boxSizing: `border-box`,
    MozBoxSizing: `border-box`,
    border: `1px solid transparent`,
    width: `14rem`,
    height: `3.5rem`,
    marginTop: `27px`,
    padding: `0 1rem`,
    borderRadius: `1px`,
    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
    fontSize: `1rem`,
    outline: `none`,
    textOverflow: `ellipses`
};

export default class MapLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bounds: null,
            center: {
                lat: 29.7604267,
                lng: -95.369802
            },
            markers: [],
            itemExists: null,
            entered: false,
            clickedPlace: null,
            searchResult: null
        };
    }

    handleClickedPlace(placeId) {
        if (this._map && placeId) {
            var service = new google.maps.places.PlacesService(
                this._map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
            );

            service.getDetails(
                {
                    placeId: placeId
                },
                (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        if (this._searchBox) {
                            this.setState({
                                clickedPlace: place,
                                center: place.geometry.location
                            });
                        }
                    }
                }
            );
        }
    }

    handleClickedButton(location) {
        this.setState({ center: location });
    }

    handleClosedPlace() {
        this.setState({ clickedPlace: null });
    }

    handleClosedSearchResult(){
        this.setState({ searchResult: null})
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.itemExists) {
            this.state.itemExists = true;
        }
    }

    handleMapMounted(map) {
        this._map = map;
    }

    handleBoundsChanged() {
        this.setState({
            bounds: this._map.getBounds(),
            center: this._map.getCenter()
        });
    }

    handleSearchBoxMounted(searchBox) {
        if (searchBox) {
            this._searchBox = searchBox;
        }
    }

    handlePlacesChanged() {
        if (this._searchBox) {
            const places = this._searchBox.getPlaces();

            const bounds = new google.maps.LatLngBounds();

            places.map(place => {
                place.geometry.viewport
                    ? bounds.union(place.geometry.viewport)
                    : bounds.extend(place.geometry.location);
            });

            const markers = places.map(place => ({
                position: place.geometry.location
            }));

            const mapCenter = markers.length > 0
                ? markers[0].position
                : this.state.center;

            this._map.fitBounds(bounds);

            this.setState({
                center: mapCenter,
                clickedPlace: null,
                searchResult: true,
                markers
            });

            places[0] && places[0].id
                ? this.props.actions.checkForExistingItem(
                      this.props.collectionOfItems,
                      places[0].id
                  )
                : null;
        }
    }

    renderPlaces() {
        var placesRenderedArray = [];

        for (var i = 0; i < this.props.arrayOfItems.length; i++) {
            var shelter = this.props.arrayOfItems[i].attributes;

            placesRenderedArray.push(
                shelter.place
                    ? <Amarker
                          place={shelter.place}
                          shelter={shelter}
                          position={shelter.place.geometry.location}
                          openShelter={this.props.actions.openShelter.bind(
                              this
                          )}
                          user={this.props.user}
                          history={this.props.history}
                          shelterCookie={this.props.shelterCookie}
                          homeLink={this.props.homeLink}
                          clickedButton={this.handleClickedButton.bind(this)}
                      />
                    : null
            );
        }

        return placesRenderedArray;
    }

    render() {
        return (
            <SearchBoxExampleGoogleMap
                containerElement={
                    <div
                        style={{
                            height: `75vh`,
                            width: `100%`
                        }}
                    />
                }
                mapElement={
                    <div
                        style={{
                            height: `75vh`,
                            width: `100%`,
                            overflow: `hidden`
                        }}
                    >
                        {" "}
                    </div>
                }
                center={this.state.center}
                onMapMounted={this.handleMapMounted.bind(this)}
                onBoundsChanged={this.handleBoundsChanged.bind(this)}
                onSearchBoxMounted={this.handleSearchBoxMounted.bind(this)}
                bounds={this.state.bounds}
                onPlacesChanged={this.handlePlacesChanged.bind(this)}
                markers={this.state.markers}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.28&libraries=places,geometry&key=${this.props.googleMapsApiKey}`}
                loadingElement={<Segment basic loading={true} />}
                places={this._searchBox ? this._searchBox.getPlaces() : null}
                {...this.props}
                renderedPlaces={this.renderPlaces()}
                itemExists={this.props.itemExists}
                user={this.props.user}
                addThisNewShelter={this.props.actions.addThisNewShelter.bind(
                    this
                )}
                searchPlace={this.handleClickedPlace.bind(this)}
                clickedPlace={
                    this.state.clickedPlace ? this.state.clickedPlace : null
                }
                closePlace={this.handleClosedPlace.bind(this)}
                searchResult={this.state.searchResult}
                closeSearchResult={this.handleClosedSearchResult.bind(this)}
            />
        );
    }
}

class Amarker extends Component {
    constructor(props) {
        super(props);
        this.state = { thisMarker: "closed" };
    }

    handleOpenShelter() {
        if (this.props.user) {
            if (this.props.user.currentShelter) {
                if (this.props.user.currentShelter === this.props.shelter._id) {
                    this.props.history.push(this.props.homeLink);
                    return;
                }
            }
        }
        if (this.props.shelterCookie) {
            if (this.props.shelterCookie === this.props.shelter._id) {
                this.props.history.push(this.props.homeLink);
                return;
            }
        }

        this.props.openShelter(
            this.props.shelter._id,
            this.props.user ? this.props.user._id : undefined
        );
    }

    render() {
        const { place, shelter, position } = this.props;

        return (
            <Marker position={position}>
                <OverlayView
                    position={position}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >

                    {this.state.thisMarker === "open"
                        ? <Segment compact size="mini">
                              <Button
                                  size="mini"
                                  floated="right"
                                  onClick={() => {
                                      this.setState({
                                          thisMarker: "closed"
                                      });
                                  }}
                                  icon="minus"
                              />
                              <Header compact>

                                  {shelter.nameOfItem}
                              </Header>

                              <Segment basic size="mini" compact>
                                  <Header.Subheader>
                                      {place.name}
                                      <Divider />
                                      {place.formatted_address}

                                  </Header.Subheader>
                                  <Divider />
                                  <Button
                                      positive
                                      size="mini"
                                      onClick={e => {
                                          e.preventDefault();

                                          this.handleOpenShelter();
                                      }}
                                  >
                                      enter
                                  </Button>
                              </Segment>

                          </Segment>
                        : <Button
                              size="mini"
                              positive
                              onClick={() => {
                                  this.props.clickedButton(
                                      place.geometry.location
                                  );
                                  this.setState({ thisMarker: "open" });
                              }}
                              icon="add"
                          />}
                </OverlayView>
            </Marker>
        );
    }
}

const SearchBoxExampleGoogleMap = withScriptjs(
    withGoogleMap(props => (
        <GoogleMap
            ref={props.onMapMounted}
            defaultZoom={15}
            center={props.center}
            onBoundsChanged={props.onBoundsChanged}
            onClick={e => {
                if (e.placeId) {
                    props.searchPlace(e.placeId);
                }
            }}
        >

            <SearchBox
                ref={props.onSearchBoxMounted}
                bounds={props.bounds}
                controlPosition={google.maps.ControlPosition.TOP_LEFT}
                onPlacesChanged={props.onPlacesChanged}
                inputPlaceholder={"Search"}
                inputStyle={INPUT_STYLE}
            />
            {props.clickedPlace
                ? <Marker position={props.clickedPlace.geometry.location}>

                      <OverlayView
                          position={props.clickedPlace.geometry.location}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >

                          {props.user
                              ? <Segment compact size="mini">
                                    <Button
                                        size="mini"
                                        onClick={e => {
                                            e.preventDefault();
                                            props.closePlace();
                                        }}
                                        floated="right"
                                        icon="remove"
                                    />
                                    <Header compact>

                                        create a shelter for
                                        {" "}
                                        {props.clickedPlace.name}
                                    </Header>

                                    <Segment basic size="mini" compact>
                                        <Header.Subheader>
                                            {
                                                props.clickedPlace
                                                    .formatted_address
                                            }

                                        </Header.Subheader>
                                        <Divider />
                                        <Button
                                            positive
                                            size="mini"
                                            onClick={e => {
                                                e.preventDefault();
                                                props.addThisNewShelter(
                                                    props.clickedPlace,
                                                    props.user
                                                        ? props.user._id
                                                        : null
                                                );
                                            }}
                                        >
                                            create
                                        </Button>
                                    </Segment>

                                </Segment>
                              : <Segment compact size="mini">
                                    <Button
                                        size="mini"
                                        onClick={e => {
                                            e.preventDefault();
                                            props.closePlace();
                                        }}
                                        floated="right"
                                        icon="remove"
                                    />
                                    <Header compact>

                                        assign a shelter to
                                        {" "}
                                        {props.clickedPlace.name}

                                    </Header>

                                    <Segment basic size="mini" compact>
                                        <Header.Subheader>
                                            {
                                                props.clickedPlace
                                                    .formatted_address
                                            }

                                        </Header.Subheader>
                                        <Divider />

                                        you must {" "} <Button
                                            basic
                                            positive
                                            size="mini"
                                            onClick={e => {
                                                e.preventDefault();
                                                props.history.push("/login");
                                            }}
                                        >
                                            login
                                        </Button>
                                        {" "}
                                        to assign shelters
                                    </Segment>

                                </Segment>}

                      </OverlayView>

                  </Marker>
                : null}

            {props.markers[0] && !props.itemExists && !props.clickedPlace && props.searchResult
                ? <Marker position={props.markers[0].position}>
                      <OverlayView
                          position={props.markers[0].position}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >

                          {props.user
                              ? <Segment compact size="mini">

                              <Button
                                        size="mini"
                                        onClick={e => {
                                            e.preventDefault();
                                            props.closeSearchResult();
                                        }}
                                        floated="right"
                                        icon="remove"
                                    />

                                    <Header compact>

                                        create a shelter for
                                        {" "}
                                        {props.places[0].name}
                                    </Header>

                                    <Segment basic size="mini" compact>
                                        <Header.Subheader>
                                            {props.places[0].formatted_address}

                                        </Header.Subheader>
                                        <Divider />
                                        <Button
                                            positive
                                            size="mini"
                                            onClick={e => {
                                                e.preventDefault();
                                                props.addThisNewShelter(
                                                    props.places[0],
                                                    props.user
                                                        ? props.user._id
                                                        : null
                                                );
                                            }}
                                        >
                                            create
                                        </Button>
                                    </Segment>

                                </Segment>
                              : <Segment compact size="mini">

                                    <Header compact>

                                        assign a shelter to
                                        {" "}
                                        {props.places[0].name}

                                    </Header>

                                    <Segment basic size="mini" compact>
                                        <Header.Subheader>
                                            {props.places[0].formatted_address}

                                        </Header.Subheader>
                                        <Divider />

                                        you must {" "} <Button
                                            basic
                                            positive
                                            size="mini"
                                            onClick={e => {
                                                e.preventDefault();
                                                props.history.push("/login");
                                            }}
                                        >
                                            login
                                        </Button>
                                        {" "}
                                        to assign shelters
                                    </Segment>

                                </Segment>}

                      </OverlayView>
                  </Marker>
                : null}
            {props.renderedPlaces ? props.renderedPlaces : null}
        </GoogleMap>
    ))
);

// //<Segment basic>
// <Button
// onClick={() => {
// props.actions.addThisNewShelter(
// props.places[0],
// props.user._id
// );
// }}
// >
// add shelter
// </Button>
// </Segment>{" "}

// {props.arrayOfItems.length > ? props.arrayOfItems.map((claimedPlace, index) => (

//                 <Marker
//                     onClick={() => {
//                         console.log("clicked");
//                     }}
//                     position={claimedPlace[0].attributes.nameOfItem}
//                     key={index}
//                 >

//                     <InfoWindow>
//                         <Segment basic compact size="massive">
//                             <Header>
//                                 {" "}
//                                 add a shelter to
//                                 {" "}
//                                 {claimedPlace.attributes.place.nameOfItem
//                                     ? claimedPlace.attributes.place.nameOfItem
//                                     : "this location"}
//                                 {" "}
//                             </Header>
//                             {" "}
//                             {claimedPlace.attributes.place.formatted_address}
//                             {" "}

//                         </Segment>
//                     </InfoWindow>
//                 </Marker>
//             )) : null }

// <Marker position={position}>
//                 {this.state.thisMarker === "open"
//                     ? <OverlayView
//                           position={position}
//                           mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
//                       >

//                           {!this.props.itemExists
//                               ? <Segment compact size="mini">
//                                     <Button
//                                         size="mini"
//                                         floated="right"
//                                         onClick={() => {
//                                             this.setState({
//                                                 thisMarker: "closed"
//                                             });
//                                         }}
//                                         icon="remove"
//                                     />
//                                     <Header compact>

//                                         add a shelter here
//                                     </Header>

//                                     <Segment basic size="mini" compact>
//                                         <Header.Subheader>
//                                             {place.formatted_address}

//                                         </Header.Subheader>
//                                         <Divider />
//                                         <Button
//                                             icon="add"
//                                             positive
//                                             size="mini"
//                                             onClick={() => {
//                                                 console.log("clicked");
//                                             }}
//                                         >
//                                             create{" "}
//                                         </Button>
//                                     </Segment>

//                                 </Segment>
//                               : <Segment compact size="mini">
//                                     <Button
//                                         size="mini"
//                                         floated="right"
//                                         onClick={() => {
//                                             this.setState({
//                                                 thisMarker: "closed"
//                                             });
//                                         }}
//                                         icon="remove"
//                                     />
//                                     <Header compact>

//                                         {shelter.nameOfItem}
//                                     </Header>

//                                     <Segment basic size="mini" compact>
//                                         <Header.Subheader>
//                                             {place.formatted_address}

//                                         </Header.Subheader>
//                                         <Divider />
//                                         <Button
//                                             positive
//                                             size="mini"
//                                             onClick={() => {
//                                                 console.log("clicked");
//                                             }}
//                                         >
//                                             enter
//                                         </Button>
//                                     </Segment>

//                                 </Segment>}

//                       </OverlayView>
//                     : <OverlayView
//                           position={position}
//                           mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
//                       >
//                           <Button
//                               size="mini"
//                               positive
//                               onClick={() => {
//                                   this.setState({ thisMarker: "open" });
//                               }}
//                               icon="add"
//                           />
//                       </OverlayView>}
//             </Marker>
