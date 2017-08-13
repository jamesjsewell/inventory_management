import React, { Component } from "react"
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import createHistory from "history/createBrowserHistory"
// import Navbar from "./pages/navBarComponent.js"
// import Register from "./authComponents/registerComponent.js"
// import Login from "./authComponents/loginComponent.js"
// import Authentication from "./authComponents/requireAuthComponent.js"
// import ResetPasswordPage
//     from "./pages/resetPasswordPage/resetPasswordPageComponent.js"
// import HomePage from "./pages/homePage/homePageComponent.js"
// import AuthPage from "./pages/authPage/authPageComponent.js"
// import ProfilePage from "./pages/profilePage/profilePageComponent.js"
// import NotAuthenticatedPage
//     from "./pages/notAuthenticatedPage/notAuthenticatedPageComponent.js"
// import {
//     setActiveNavLink,
//     hideSidebar,
//     activateSidebar
// } from "../actions/navActions.js"
// import { dataIsLoading } from "../actions/testActions.js"
import {
    Menu,
    Segment,
    Grid,
    Sidebar,
    Header,
    Button,
    Dimmer,
    Loader,
    Container,
    Icon,
    Divider
} from "semantic-ui-react"

import HomeView from "../features/home/components/HomeView.jsx"
import Navbar from "../features/navbar/components/NavbarView.jsx"
import UserSessionView from "../features/userSession/components/UserSessionView.jsx"
import ResetPasswordView from "../features/userSession/components/ResetPasswordView.jsx"

class Blank extends Component {
    render() {
        return <div />
    }
}

class RouterConfig extends Component {
    handleHideSidebar() {
        //this.props.hideSidebar()
    }

    render() {
        return (
            <Router>

                <Container as={Segment} secondary stretched>

                    <Dimmer active={this.props.loadingData} page>

                        <Grid columns="equal" padded>

                            <Grid.Row>

                                <Grid.Column>
                                    <Loader size="big">Loading</Loader>
                                </Grid.Column>

                            </Grid.Row>

                            <Divider hidden />

                            <Grid.Row>

                                <Grid.Column>
                                    <Button
                                        onClick={() => {
                                            //this.props.dataIsLoading(false)
                                        }}
                                    >
                                        finish testing
                                    </Button>
                                </Grid.Column>

                            </Grid.Row>

                        </Grid>

                    </Dimmer>

                    <Navbar />
                    <Blank Authentication="Authentication" />

                    <Switch>
                        <Route
                            location={location}
                            key={location.key}
                            path="/reset-password/:resetToken"
                            component={ResetPasswordView}
                        />
                        <Route
                            path="/profile"
                            component={this.props.user ? ProfilePage : Blank}
                        />
                        <Route path="/login" component={UserSessionView} />
                        <Route path="/register" component={Blank} />
                        <Route exact path="/" component={HomeView} />
                        <Route path="*" component={HomeView} />

                    </Switch>

                </Container>

            </Router>
        )
    }
}

// user: state.auth.user,
// sidebarVisible: state.nav.sidebarVisible,
// loadingData: state.data.loadingData

function mapStateToProps(state) {
    return {}
}

// {
//     setActiveNavLink, hideSidebar, dataIsLoading
// }
export default withRouter(connect(mapStateToProps)(RouterConfig))
