import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import * as duck from "../duck"
import AboutLayout from "./AboutLayout.jsx"

@connect(
	state => duck.selector(state),
	dispatch => ({
		actions: bindActionCreators(duck, dispatch)
	})
)
export default class AboutView extends Component {

	render() {
		return (
			<AboutLayout
				{...this.props}
	
			/>
		)
	}
}
