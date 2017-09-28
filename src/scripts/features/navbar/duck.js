import { combineReducers } from "redux"
import _ from "underscore"
import { createStructuredSelector } from "reselect"
import Cookies from "universal-cookie"

const cookies = new Cookies()

const SET_ACTIVE_NAV_LINK = "evanescent/navbar/SET_ACTIVE_NAV_LINK",
	SHOW_HIDE_SIDEBAR = "evanescent/navbar/SHOW_HIDE_SIDEBAR"

// actions
import {logoutUser} from "../../util/userAuthentication/duck.js"
export {logoutUser}
export function setActiveNavLink(selectedItemName) {
	return function(dispatch) {
		dispatch({ type: SET_ACTIVE_NAV_LINK, payload: selectedItemName })
	}
}

export function activateSidebar() {
	return function(dispatch) {
		dispatch({ type: SHOW_HIDE_SIDEBAR, payload: true })
	}
}

export function hideSidebar() {
	return function(dispatch) {
		dispatch({ type: SHOW_HIDE_SIDEBAR, payload: false })
	}
}

// reducers
const init_nav = {
	activeNavTab: "",
	routes: {
		homePath: "shelter",
		sheltersMapPath: "interactive_map",
		loginPath: "login",
		logoutPath: "logout",
		profilePath: "profile",
		aboutPath: "about"
	}
}

function navLinkReducer(state = init_nav, action) {
	switch (action.type) {
		case SET_ACTIVE_NAV_LINK: {
			return _.extend({}, state, { activeNavTab: action.payload })
		}
	}

	return state
}

const init_sidebar = { sidebarVisible: false }

function sidebarReducer(state = init_sidebar, action) {
	switch (action.type) {
		case SHOW_HIDE_SIDEBAR: {
			return _.extend({}, state, { sidebarVisible: action.payload })
		}
	}

	return state
}

export default combineReducers({
	navLink: navLinkReducer,
	sidebar: sidebarReducer
})

// selectors
const activeNavTab = state => state.nav.navLink.activeNavTab
const sidebarVisible = state => state.nav.sidebar.sidebarVisible
const authenticated = state => state.auth.userSession.authenticated
const routes = state => state.nav.navLink.routes

export const selector = createStructuredSelector({
	activeNavTab,
	sidebarVisible,
	authenticated,
	routes
})
