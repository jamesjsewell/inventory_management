import React, { Component, PropTypes } from "react"
import { Menu, Segment, Grid, Sidebar, Header, Button } from "semantic-ui-react"

export default class NavbarLayout extends Component {

    render() {
        console.log(this.props)
        console.log(this.state)
        var currentUrl = window.location.pathname
        const {
            sidebarVisible,
            authenticated,
            action_onClickLink,
            action_sidebarVis
        } = this.props
        return (
            <Grid columns={1} container centered divided>
                <Grid.Row centered only="computer" padded>

                    <Grid.Column>

                        <Menu size={"big"} pointing floating fluid secondary>

                            <Menu.Menu>
                                <Menu.Item
                                    header
                                    id={this.props.homePath} //the url
                                    name="home"
                                    active={currentUrl.includes(
                                        this.props.homePath
                                    )}
                                    onClick={action_onClickLink.bind(this)}
                                />
                            </Menu.Menu>

                            {authenticated
                                ? <Menu.Menu>
                                      <Menu.Item
                                          header
                                          id={
                                              authenticated
                                                  ? this.props.profilePath
                                                  : ""
                                          } //the url
                                          name={
                                              authenticated
                                                  ? this.props.profilePath
                                                  : ""
                                          }
                                          active={currentUrl.includes(
                                              this.props.profilePath
                                          )}
                                          onClick={action_onClickLink.bind(
                                              this
                                          )}
                                      />
                                  </Menu.Menu>
                                : null}

                            <Menu.Menu position="right">
                                <Menu.Item
                                    header
                                    id={
                                        authenticated
                                            ? this.props.logoutPath
                                            : this.props.loginPath
                                    } //the url
                                    name={
                                        authenticated
                                            ? this.props.logoutPath
                                            : this.props.loginPath
                                    }
                                    active={currentUrl.includes(
                                        authenticated
                                            ? this.props.logoutPath
                                            : this.props.loginPath
                                    )}
                                    onClick={action_onClickLink.bind(this)}
                                />
                            </Menu.Menu>

                        </Menu>

                    </Grid.Column>

                </Grid.Row>

                <Grid.Row>

                    <Grid.Column only="tablet mobile">

                        <Button onClick={action_sidebarVis.bind(this)}>
                            Menu
                        </Button>

                        <Sidebar
                            as={Menu}
                            size="massive"
                            animation="push"
                            width="wide"
                            visible={sidebarVisible}
                            icon="labeled"
                            vertical
                            stackable
                            inverted={false}
                        >
                            <Menu.Menu>
                                <Menu.Item
                                    header
                                    id={this.props.homePath} //the url
                                    name="home"
                                    active={currentUrl.includes(
                                        this.props.homePath
                                    )}
                                    onClick={action_onClickLink.bind(this)}
                                />
                            </Menu.Menu>

                            {authenticated
                                ? <Menu.Menu>
                                      <Menu.Item
                                          header
                                          id={
                                              authenticated
                                                  ? this.props.profilePath
                                                  : ""
                                          } //the url
                                          name={
                                              authenticated
                                                  ? this.props.profilePath
                                                  : ""
                                          }
                                          active={currentUrl.includes(
                                              this.props.profilePath
                                          )}
                                          onClick={action_onClickLink.bind(
                                              this
                                          )}
                                      />
                                  </Menu.Menu>
                                : null}

                            <Menu.Menu position="right">
                                <Menu.Item
                                    header
                                    id={
                                        authenticated
                                            ? this.props.logoutPath
                                            : this.props.loginPath
                                    } //the url
                                    name={
                                        authenticated
                                            ? this.props.logoutPath
                                            : this.props.loginPath
                                    }
                                    active={currentUrl.includes(
                                        authenticated
                                            ? this.props.logoutPath
                                            : this.props.loginPath
                                    )}
                                    onClick={action_onClickLink.bind(this)}
                                />
                            </Menu.Menu>
                        </Sidebar>

                    </Grid.Column>

                </Grid.Row>
            </Grid>
        )
    }
}
