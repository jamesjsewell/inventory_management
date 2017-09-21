import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { bindActionCreators } from "redux";
import * as duck from "../duck";
import Cookies from "universal-cookie";

const cookies = new Cookies();

@connect(
    state => duck.selector(state),
    dispatch => ({
        actions: bindActionCreators(duck, dispatch)
    })
)
class Authentication extends Component {
    componentWillMount() {
        var token = cookies.get("token");
        var user = cookies.get("user");
        if (token) {
            if (!this.props.authenticated) {
                this.props.actions.authenticate(user);
            }
        } else {
            this.props.actions.setShelterCookie();
        }
    }

    componentWillReceiveProps(nextProps) {
        var token = cookies.get("token");
        var user = cookies.get("user");

        if (token) {
            if (nextProps.authenticated) {
                if (
                    this.props.location.pathname.includes(
                        this.props.routes.loginPath
                    )
                ) {
                    this.props.history.push("/" + this.props.routes.homePath);
                }
            } else {
                this.props.actions.authenticate(user);
            }
        } else {
            this.props.actions.setShelterCookie();
        }
    }

    render() {
        return <div />;
    }
}

export default withRouter(Authentication);
