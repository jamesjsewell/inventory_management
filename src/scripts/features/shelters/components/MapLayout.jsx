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
            itemExists: null
        };
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
                            height: `100%`,
                            width: `100%`,
                            overflow: `hidden`
                        }}
                    />
                }
                mapElement={
                    <div
                        style={{
                            height: `50rem`,
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
                                      {place.formatted_address}

                                  </Header.Subheader>
                                  <Divider />
                                  <Button
                                      positive
                                      size="mini"
                                      onClick={() => {
                                          console.log("clicked");
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
        >

            <SearchBox
                ref={props.onSearchBoxMounted}
                bounds={props.bounds}
                controlPosition={google.maps.ControlPosition.TOP_LEFT}
                onPlacesChanged={props.onPlacesChanged}
                inputPlaceholder={"Search"}
                inputStyle={INPUT_STYLE}
            />

            {props.markers[0] && !props.itemExists
                ? <Marker position={props.markers[0].position}>
                      <OverlayView
                          position={props.markers[0].position}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >

                          <Segment compact size="mini">

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
                                      onClick={() => {
                                          console.log("clicked");
                                      }}
                                  >
                                      create
                                  </Button>
                              </Segment>

                          </Segment>

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
// props.actions.userChoseLocation(
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
