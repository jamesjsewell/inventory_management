import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import * as duck from "../duck"
import SheltersLayout from "./SheltersLayout.jsx"

@connect(
	state => duck.selector(state),
	dispatch => ({
		actions: bindActionCreators(duck, dispatch)
	})
)
export default class SheltersView extends Component {
	render() {
		return <SheltersLayout {...this.props} />
	}
}