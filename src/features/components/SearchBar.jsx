import {
    GoogleMap,
    Marker,
    withGoogleMap,
    InfoWindow
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
} from "semantic-ui-react"

//   /* global google */
// import React, { Component } from "react";
import { default as React, Component } from "react";
const INPUT_STYLE = {
    boxSizing: `border-box`,
    MozBoxSizing: `border-box`,
    border: `1px solid transparent`,
    width: `240px`,
    height: `32px`,
    marginTop: `27px`,
    padding: `0 12px`,
    borderRadius: `1px`,
    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
    fontSize: `14px`,
    outline: `none`,
    textOverflow: `ellipses`
};

export default class SearchBoxExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bounds: null,
            center: {
                lat: 37.09024,
                lng: -95.71289100000001
            },
            markers: []
        };
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

            this.setState({
                center: mapCenter,
                markers
            });

            this._map.fitBounds(bounds);
            console.log(places[0].geometry.location.lng());
        }
    }

    render() {
        return (
            <SearchBoxExampleGoogleMap
                containerElement={
                    <div style={{ height: `100%`, width: `100%`, overflow: `hidden` }} />
                }
                mapElement={
                    <div style={{ height: `50rem`, width: `100%`, overflow: `hidden` }}> </div>
                }
                center={this.state.center}
                onMapMounted={this.handleMapMounted.bind(this)}
                onBoundsChanged={this.handleBoundsChanged.bind(this)}
                onSearchBoxMounted={this.handleSearchBoxMounted.bind(this)}
                bounds={this.state.bounds}
                onPlacesChanged={this.handlePlacesChanged.bind(this)}
                markers={this.state.markers}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.28&libraries=places,geometry&key=${this.props.googleMapsApiKey}`}
                loadingElement={<Segment basic loading={true}></Segment>}
                places={this._searchBox? this._searchBox.getPlaces() : null}
            />
        );
    }
}

const SearchBoxExampleGoogleMap = withScriptjs(
    withGoogleMap(props => (
        <GoogleMap
            ref={props.onMapMounted}
            defaultZoom={3}
            center={props.center}
            onBoundsChanged={props.onBoundsChanged}
        >
            <SearchBox
                ref={props.onSearchBoxMounted}
                bounds={props.bounds}
                controlPosition={google.maps.ControlPosition.TOP_LEFT}
                onPlacesChanged={props.onPlacesChanged}
                inputPlaceholder={"Search for a shelter"}
                inputStyle={INPUT_STYLE}
            />

            {props.markers.map((marker, index) => (
                <Marker
                    onClick={() => {
                        console.log("clicked");
                    }}
                    position={marker.position}
                    key={index}

                >

                    <InfoWindow>
                        <Segment basic compact size="massive"><Header> add a shelter to {props.places[0].name? props.places[0].name : "this location"} </Header> {props.places[0].formatted_address} <Segment basic><Button padded>add shelter</Button></Segment> </Segment>
                    </InfoWindow>
                </Marker>
            ))}

        </GoogleMap>
    ))
);
