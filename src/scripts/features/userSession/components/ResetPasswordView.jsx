import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import * as duck from "../duck"
import ResetPasswordLayout from "./ResetPasswordLayout.jsx"

@connect(
    state => duck.selector(state),
    dispatch => ({
        actions: bindActionCreators(duck, dispatch)
    })
)
export default class ResetPasswordView extends Component {
    render() {
        console.log(this.props)
        return (
            <ResetPasswordLayout
                resetPassword={this.props.actions.resetPassword}
                match={this.props.match}
                didPasswordReset={this.props.didPasswordReset}
                stateOfReset={this.props.stateOfReset}
            />
        )
    }
}
