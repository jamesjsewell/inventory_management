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
import _ from "underscore";
import { CLIENT_ROOT_URL } from "../../../util/index.js";

import { default as React, Component } from "react";
const INPUT_STYLE = {
    boxSizing: `border-box`,
    MozBoxSizing: `border-box`,
    border: `1px solid transparent`,
    height: `2rem`,
    marginTop: `1rem`,
    marginLeft: `1rem`,
    padding: `0 .1rem`,
    borderRadius: `1px`,
    boxShadow: `0 .2rem .4rem rgba(0, 0, 0, 0.3)`,
    fontSize: `1rem`,
    outline: `none`,
    textOverflow: `ellipses`,
    zIndex: `99`
};

var clickedMarker = "";

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
            searchResult: null,
            currentInfoWindow: null
        };
    }

    handleClickedPlace(placeId) {
        if (this._map && placeId) {
            var service = new google.maps.places.PlacesService(
                this._map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
            );

            this.props.actions.spinner(true);

            service.getDetails(
                {
                    placeId: placeId
                },
                (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        this.props.actions.spinner(false);
                        this.createInfoWindow(
                            "clickedPOI",
                            null,
                            place,
                            place.geometry.location
                        );
                    }
                }
            );
        }
    }

    handleClickedButton(location) {
        this.setState({ center: location });
    }

    handleCloseInfoWindow() {
        this.setState({ clickedPlace: null, currentInfoWindow: null });
    }

    handleClosedSearchResult() {
        this.setState({
            searchResult: null,
            clickedPlace: null,
            currentInfoWindow: null
        });
    }

    handleOpenShelter(shelter) {
        if (this.props.user && shelter) {
            if (this.props.user.currentShelter) {
                if (this.props.user.currentShelter === shelter._id) {
                    this.props.history.push(this.props.homeLink);
                    return;
                }
            }
        }
        if (this.props.shelterCookie && shelter) {
            if (this.props.shelterCookie === shelter._id) {
                this.props.history.push(this.props.homeLink);
                return;
            }
        }

        if (shelter) {
            this.props.actions.openShelter(
                shelter._id,
                this.props.user ? this.props.user._id : undefined
            );
        }
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

            if (places[0] && places[0].id && this.props.collectionOfItems) {
                var lookfor = places[0].id;
                var found = _.find(
                    this.props.collectionOfItems
                        ? this.props.collectionOfItems.models
                        : null,
                    item => {
                        if (
                            item.attributes.place &&
                            item.attributes.place.id === lookfor
                        ) {
                            return true;
                        }
                    }
                );

                if (found && found.attributes) {
                    if (found.attributes.place) {
                        this.createInfoWindow(
                            "existing",
                            found,
                            found.attributes.place,
                            found.attributes.place.geometry.location
                        );
                    }
                } else {
                    this.createInfoWindow(
                        "searched",
                        null,
                        places[0],
                        places[0].geometry.location
                    );
                }
            }
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
                          markerShelter={shelter}
                          position={shelter.place.geometry.location}
                          openShelter={this.props.actions.openShelter.bind(
                              this
                          )}
                          user={this.props.user}
                          history={this.props.history}
                          shelterCookie={this.props.shelterCookie}
                          homeLink={this.props.homeLink}
                          createInfoWindow={this.createInfoWindow.bind(this)}
                      />
                    : null
            );
        }

        return placesRenderedArray;
    }

    createInfoWindow(type, shelter, place, position) {
        var createdInfoWindow = null;
        if (type === "existing") {
            createdInfoWindow = (
                <ExistingShelterInfoWindow
                    existingShelter={shelter}
                    place={place}
                    position={position}
                    openShelter={this.handleOpenShelter.bind(this)}
                    closeWindow={this.handleCloseInfoWindow.bind(this)}
                    {...this.props}
                />
            );
        }

        if (type === "clickedPOI") {
            this.setState({
                clickedPlace: place,
                center: place.geometry.location
            });
            createdInfoWindow = (
                <POIinfoWindow
                    addThisNewShelter={this.props.actions.addThisNewShelter.bind(
                        this
                    )}
                    clickedPlace={place}
                    position={position}
                    closePlace={this.handleCloseInfoWindow.bind(this)}
                    {...this.props}
                />
            );
        }

        if (type === "searched") {
            createdInfoWindow = (
                <SearchedInfoWindow
                    marker={this.state.markers[0]}
                    place={
                        this._searchBox ? this._searchBox.getPlaces()[0] : null
                    }
                    closeSearchResult={this.handleClosedSearchResult.bind(this)}
                    addThisNewShelter={this.props.actions.addThisNewShelter.bind(
                        this
                    )}
                    {...this.props}
                />
            );
        }

        if (createdInfoWindow) {
            this.setState({
                currentInfoWindow: createdInfoWindow,
                center: place.geometry.location
            });
        }
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
                clickedPlace={
                    this.state.clickedPlace ? this.state.clickedPlace : null
                }
                searchClickedPlace={this.handleClickedPlace.bind(this)}
                searchResult={this.state.searchResult}
                currentInfoWindow={this.state.currentInfoWindow}
                createInfoWindow={this.createInfoWindow.bind(this)}
                spinner={this.props.actions.spinner.bind(this)}
            />
        );
    }
}

class Amarker extends Component {
    constructor(props) {
        super(props);
        this.state = { thisMarker: "closed" };
    }

    render() {
        const { place, markerShelter, position } = this.props;

        return (
            <Marker
                icon={{
                    url: `${window.location.protocol + "//" + window.location.host}/images/refugeeIcon.png`,
                    size: new google.maps.Size(32, 32),
                    center: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(16, 16)
                }}
                position={position}
                onClick={() => {
                    this.props.createInfoWindow(
                        "existing",
                        markerShelter,
                        place,
                        position
                    );
                }}
            />
        );
    }
}

class ExistingShelterInfoWindow extends Component {
    render() {
        const {
            place,
            position,
            existingShelter,
            openShelter,
            closeWindow
        } = this.props;
        return (
            <InfoWindow
                onCloseClick={() => {
                    closeWindow();
                }}
                position={position}
                mapPaneName={OverlayView.FLOAT_PANE}
                zIndex={18}
            >
                <div>

                    <Header compact size="mini">

                        {existingShelter.nameOfItem}
                    </Header>

                    <Divider />
                    <Header.Subheader size="mini">
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

                            openShelter(existingShelter);
                        }}
                    >
                        enter
                    </Button>

                </div>
            </InfoWindow>
        );
    }
}

class POIinfoWindow extends Component {
    render() {
        const {
            closePlace,
            clickedPlace,
            user,
            addThisNewShelter,
            history
        } = this.props;
        return (
            <InfoWindow
                onCloseClick={() => {
                    closePlace();
                }}
                position={clickedPlace.geometry.location}
                mapPaneName={OverlayView.FLOAT_PANE}
            >

                {user
                    ? <div compact size="mini">

                          <Header compact size="mini">

                              create a shelter for
                              {" "}
                              {clickedPlace.name}
                          </Header>

                          <Divider />
                          <Header.Subheader size="mini">
                              {clickedPlace.formatted_address}

                          </Header.Subheader>
                          <Divider />
                          <Button
                              positive
                              size="mini"
                              onClick={e => {
                                  e.preventDefault();
                                  addThisNewShelter(
                                      clickedPlace,
                                      user ? user._id : null
                                  );
                              }}
                          >
                              create
                          </Button>

                      </div>
                    : <div compact size="mini">

                          <Header compact size="mini">

                              assign a shelter to
                              {" "}
                              {clickedPlace.name}

                          </Header>

                          <Divider />
                          <Header.Subheader size="mini">
                              {clickedPlace.formatted_address}

                          </Header.Subheader>
                          <Divider />

                          you must {" "} <Button
                              basic
                              positive
                              size="mini"
                              onClick={e => {
                                  e.preventDefault();
                                  history.push("/login");
                              }}
                          >
                              login
                          </Button>
                          {" "}
                          to assign shelters

                      </div>}

            </InfoWindow>
        );
    }
}

class SearchedInfoWindow extends Component {
    render() {
        const {
            closeSearchResult,
            addThisNewShelter,
            marker,
            place,
            history,
            user
        } = this.props;
        return (
            <InfoWindow
                onCloseClick={() => {
                    closeSearchResult();
                }}
                position={marker.position}
                mapPaneName={OverlayView.FLOAT_PANE}
            >

                {user
                    ? <div compact size="mini">

                          <Header compact size="mini">

                              create a shelter for
                              {" "}
                              {place.name}
                          </Header>

                          <Divider />
                          <Header.Subheader size="mini">
                              {place.formatted_address}

                          </Header.Subheader>
                          <Divider />
                          <Button
                              positive
                              size="mini"
                              onClick={e => {
                                  e.preventDefault();
                                  addThisNewShelter(
                                      place,
                                      user ? user._id : null
                                  );
                              }}
                          >
                              create
                          </Button>

                      </div>
                    : <div compact size="mini">

                          <Header compact size="mini">

                              assign a shelter to
                              {" "}
                              {place.name}

                          </Header>

                          <Divider />
                          <Header.Subheader size="mini">
                              {place.formatted_address}

                          </Header.Subheader>
                          <Divider />

                          you must {" "} <Button
                              basic
                              positive
                              size="mini"
                              onClick={e => {
                                  e.preventDefault();
                                  history.push("/login");
                              }}
                          >
                              login
                          </Button>
                          {" "}
                          to assign shelters

                      </div>}

            </InfoWindow>
        );
    }
}

const SearchBoxExampleGoogleMap = withScriptjs(
    withGoogleMap(props => (
        <GoogleMap
            options={{
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.BOTTOM_LEFT,
                    mapTypeIds: [
                        google.maps.MapTypeId.ROADMAP,
                        google.maps.MapTypeId.SATELLITE
                    ]
                },
                disableDefaultUI: false,
                scaleControl: true
            }}
            streetView={google.maps.ControlPosition.BOTTOM_RIGHT}
            clickableIcons={false}
            ref={props.onMapMounted}
            defaultZoom={15}
            center={props.center}
            onBoundsChanged={props.onBoundsChanged}
            onClick={e => {
                e.stop();
                if (e.placeId) {
                    props.searchClickedPlace(e.placeId);
                }
            }}
        >

            <SearchBox
                ref={props.onSearchBoxMounted}
                bounds={props.bounds}
                controlPosition={google.maps.ControlPosition.TOP_CENTER}
                onPlacesChanged={props.onPlacesChanged}
                inputPlaceholder={"Search"}
                inputStyle={INPUT_STYLE}
            />

            {props.currentInfoWindow ? props.currentInfoWindow : null}

            {props.renderedPlaces ? props.renderedPlaces : null}
        </GoogleMap>
    ))
);
