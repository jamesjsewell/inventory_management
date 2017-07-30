import React, { Component } from "react"
import { connect } from "react-redux"
import bindActionCreators from "redux"
import PropTypes from "prop-types"
import Cookies from "universal-cookie"
import { protectedTest } from "../../actions/authActions"
import { withRouter } from "react-router"

const cookies = new Cookies()

class Authentication extends Component {
    componentWillMount() {
        var token = cookies.get("token")
        var user = cookies.get("user")
        if (token) {
            if (!this.props.authenticated) {
                this.props.protectedTest(user)
            }
        }
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {
        var token = cookies.get("token")
        var user = cookies.get("user")

        if (token) {
            if (nextProps.authenticated) {
                if (
                    this.props.location.pathname.includes(
                        this.props.routes.login
                    )
                ) {
                    this.props.history.push("/" + this.props.routes.home)
                }
            } else {
                this.props.protectedTest(user)
            }
        }
    }

    render() {
        return <div />
    }
}

function mapStateToProps(state) {
    return {
        authenticated: state.auth.authenticated,
        user: state.auth.user,
        routes: state.nav.routes
    }
}

export default withRouter(
    connect(mapStateToProps, { protectedTest })(Authentication)
)
