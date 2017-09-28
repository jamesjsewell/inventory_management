import React, { Component, PropTypes } from "react";
import {
	Menu,
	Segment,
	Grid,
	Sidebar,
	Header,
	Button,
	Dimmer
} from "semantic-ui-react";

export default class NavbarLayout extends Component {
	render() {
		var currentUrl = window.location.pathname;
		const {
			sidebarVisible,
			authenticated,
			action_onClickLink,
			action_sidebarVis,
			routes
		} = this.props;

		return (
			<Grid columns={1} container centered divided>
				<Grid.Row centered only="computer" padded>

					<Grid.Column>

						<Menu size={"big"} pointing floating fluid secondary>

							<Menu.Menu>
								<Menu.Item
									header
									id={routes.homePath} //the url
									name="shelter"
									active={currentUrl.includes(
										routes.homePath
									)}
									onClick={action_onClickLink.bind(this)}
								/>
							</Menu.Menu>

							<Menu.Menu>
								<Menu.Item
									header
									id={routes.sheltersMapPath} //the url
									name="interactive map"
									active={currentUrl.includes(
										routes.sheltersMapPath
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
													? routes.profilePath
													: ""
											} //the url
											name={
												authenticated
													? routes.profilePath
													: ""
											}
											active={currentUrl.includes(
												routes.profilePath
											)}
											onClick={action_onClickLink.bind(
												this
											)}
										/>
									</Menu.Menu>
								: null}

							<Menu.Menu>
								<Menu.Item
									header
									id={routes.aboutPath} //the url
									name="about"
									active={currentUrl.includes(
										routes.aboutPath
									)}
									onClick={action_onClickLink.bind(this)}
								/>
							</Menu.Menu>

							<Menu.Menu position="right">
								<Menu.Item
									header
									id={
										authenticated
											? routes.logoutPath
											: routes.loginPath
									} //the url
									name={
										authenticated
											? routes.logoutPath
											: routes.loginPath
									}
									active={currentUrl.includes(
										authenticated
											? routes.logoutPath
											: routes.loginPath
									)}
									onClick={action_onClickLink.bind(this)}
								/>
							</Menu.Menu>

						</Menu>

					</Grid.Column>

				</Grid.Row>

				<Grid.Row>

					<Grid.Column only="tablet mobile">

						{sidebarVisible
							? null
							: <Button onClick={action_sidebarVis.bind(this)}>
									{" "}Menu{" "}
								</Button>}

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
								<Menu.Item as={Segment} compact basic>
									<Segment basic>
										<Button
											basic
											size="tiny"
											floated="right"
											icon="remove"
											onClick={action_sidebarVis.bind(
												this
											)}
										/>
									</Segment>
								</Menu.Item>
								<Menu.Item
									header
									id={routes.homePath} //the url
									name="shelter"
									active={currentUrl.includes(
										routes.homePath
									)}
									onClick={action_onClickLink.bind(this)}
								/>
							</Menu.Menu>

							<Menu.Menu>
								<Menu.Item
									header
									id={routes.sheltersMapPath} //the url
									name="interactive map"
									active={currentUrl.includes(
										routes.sheltersMapPath
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
													? routes.profilePath
													: ""
											} //the url
											name={
												authenticated
													? routes.profilePath
													: ""
											}
											active={currentUrl.includes(
												routes.profilePath
											)}
											onClick={action_onClickLink.bind(
												this
											)}
										/>
									</Menu.Menu>
								: null}

							<Menu.Menu>
								<Menu.Item
									header
									id={routes.aboutPath} //the url
									name="about"
									active={currentUrl.includes(
										routes.aboutPath
									)}
									onClick={action_onClickLink.bind(this)}
								/>
							</Menu.Menu>

							<Menu.Menu position="right">
								<Menu.Item
									header
									id={
										authenticated
											? routes.logoutPath
											: routes.loginPath
									} //the url
									name={
										authenticated
											? routes.logoutPath
											: routes.loginPath
									}
									active={currentUrl.includes(
										authenticated
											? routes.logoutPath
											: routes.loginPath
									)}
									onClick={action_onClickLink.bind(this)}
								/>
							</Menu.Menu>
						</Sidebar>

					</Grid.Column>

				</Grid.Row>
			</Grid>
		);
	}
}
