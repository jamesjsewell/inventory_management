import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import * as duck from "../duck"
import UserSessionLayout from "./UserSessionLayout.jsx"

@connect(
	state => duck.selector(state),
	dispatch => ({
		actions: bindActionCreators(duck, dispatch)
	})
)
export default class UserSessionView extends Component {

	render() {
		return (
			<UserSessionLayout
				{...this.props}
	
			/>
		)
	}
}
