import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Link, NavLink } from "react-router-dom"
import { withRouter } from "react-router"
import * as duck from "../duck"
import NavbarLayout from "./NavbarLayout.jsx"

@connect(
    state => duck.selector(state),
    dispatch => ({
        actions: bindActionCreators(duck, dispatch)
    })
)
class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            homePath: "home",
            loginPath: "login",
            logoutPath: "logout",
            profilePath: "profile"
        }
    }
    handleItemClick(e) {
        e.preventDefault()
        var selectedItem = e.target.id.toLowerCase()
        this.props.actions.setActiveNavLink(selectedItem)

        if (selectedItem === this.state.logoutPath) {
            this.props.actions.logoutUser()
            selectedItem = this.state.loginPath
        }

        this.props.actions.hideSidebar()

        this.props.history.replace(`/${selectedItem}`)
    }

    showHideSideBar(e) {
        e.preventDefault()
        if (this.props.sidebarVisible) {
            this.props.actions.hideSidebar()
        } else {
            this.props.actions.activateSidebar()
        }
    }

    render() {
        var activeItem = window.location.pathname

        return (
            <NavbarLayout
                {...this.props}
                {...this.state}
                action_onClickLink={this.handleItemClick.bind(this)}
                action_sidebarVis={this.showHideSideBar.bind(this)}
            />
        )
    }
}
export default withRouter(Navbar)