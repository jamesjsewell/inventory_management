import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import * as duck from "../duck"
import EditProfileLayout from "./EditProfileLayout.jsx"

@connect(
	state => duck.selector(state),
	dispatch => ({
		actions: bindActionCreators(duck, dispatch)
	})
)
export default class EditProfileView extends Component {
	render() {
		return <EditProfileLayout {...this.props} />
	}
}
