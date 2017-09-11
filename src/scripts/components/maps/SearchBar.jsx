import { GoogleMap, Marker, withGoogleMap, SearchBox } from "react-google-maps";
//   /* global google */
import { default as React, Component } from "react";

import { getAPIkey } from "../../util/index.js"

const googleMapURL =
  "https://maps.googleapis.com/maps/api/js?v=3.27&libraries=places,geometry&key=YOUR_GOOGLE_MAPS_API_KEY_GOES_HERE";

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
        lat: 47.6205588,
        lng: -122.3212725
      },
      markers: []
    };

    // handleMapMounted = this.handleMapMounted.bind(this);
    // handleBoundsChanged = this.handleBoundsChanged.bind(this);
    // handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
    // handlePlacesChanged = this.handlePlacesChanged.bind(this);
    getAPIkey("GOOGLE_MAPS_KEY")

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
    this._searchBox = searchBox;
  }

  handlePlacesChanged() {
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
  }

  render() {
    return (
      <SearchBoxExampleGoogleMap
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        center={this.state.center}
        onMapMounted={this.handleMapMounted}
        onBoundsChanged={this.handleBoundsChanged}
        onSearchBoxMounted={this.handleSearchBoxMounted}
        bounds={this.state.bounds}
        onPlacesChanged={this.handlePlacesChanged}
        markers={this.state.markers}
      />
    );
  }
}

const SearchBoxExampleGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
    googleMapURL={googleMapURL}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
      inputPlaceholder="Customized your placeholder"
      inputStyle={INPUT_STYLE}
    />
    {props.markers.map((marker, index) => (
      <Marker position={marker.position} key={index} />
    ))}
  </GoogleMap>
));
