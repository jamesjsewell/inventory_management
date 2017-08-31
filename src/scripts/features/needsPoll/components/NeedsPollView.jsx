import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import * as duck from "../duck"
import NeedsPollLayout from "./NeedsPollLayout.jsx"

@connect(
	state => duck.selector(state),
	dispatch => ({
		actions: bindActionCreators(duck, dispatch)
	})
)
export default class NeedsPollView extends Component {
	render() {
		return <NeedsPollLayout {...this.props} />
	}
}
