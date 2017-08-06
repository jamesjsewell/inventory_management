import React, { Component, PropTypes } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import * as duck from "../duck"
import HomeLayout from "./HomeLayout.jsx"

@connect(
    state => duck.selector(state),
    dispatch => ({
        actions: bindActionCreators(duck, dispatch)
    })
)
export default class HomeView extends Component {
 
    handleSomethingCool(what) {
        this.props.actions.doSomethingCool(what)
    }

    render() {
        return (
            <div>
                {false
                    ? <span>Loading...</span>
                    : <HomeLayout
                          {...this.props}
                          onSomethingCool={what =>
                              this.handleSomethingCool(what)}
                      />}
            </div>
        )
    }
}

