import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as duck from "../duck";
import MapLayout from "./MapLayout.jsx";
import { GoogleMap, Marker, withGoogleMap, SearchBox } from "react-google-maps";

@connect(
	state => duck.selector(state),
	dispatch => ({
		actions: bindActionCreators(duck, dispatch)
	})
)
export default class MapView extends Component {
	constructor(props) {
		super(props);
		this.state = { hasKey: false };
	}
	componentWillMount() {
		if (!this.props.googleMapsApiKey) {
			this.props.actions.getAPIkey("GOOGLE_MAPS_KEY");
		} else {
			this.state.hasKey = true;
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.googleMapsApiKey) {
			this.state.hasKey = true;
		}
	}
	render() {
		return this.state.hasKey ? <MapLayout {...this.props} /> : null;
	}
}
