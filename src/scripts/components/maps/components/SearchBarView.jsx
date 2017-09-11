import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as duck from "../duck";
import SearchBoxExample from "./SearchBar.jsx";
import { GoogleMap, Marker, withGoogleMap, SearchBox } from "react-google-maps";

@connect(
	state => duck.selector(state),
	dispatch => ({
		actions: bindActionCreators(duck, dispatch)
	})
)
export default class SearchBarView extends Component {
	constructor(props) {
		super(props);
		this.state = { hasKey: false };
	}
	componentWillMount() {
		this.props.actions.getAPIkey("GOOGLE_MAPS_KEY");
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.googleMapsApiKey) {
			this.state.hasKey = true;
		}
	}
	render() {
		return this.state.hasKey ? <SearchBoxExample {...this.props} /> : null;
	}
}
