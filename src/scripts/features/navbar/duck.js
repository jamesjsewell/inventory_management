import { combineReducers } from "redux"
import _ from "underscore"
import { createStructuredSelector } from "reselect"
import Cookies from "universal-cookie"

const cookies = new Cookies()

const SET_ACTIVE_NAV_LINK = "evanescent/navbar/SET_ACTIVE_NAV_LINK",
	SHOW_HIDE_SIDEBAR = "evanescent/navbar/SHOW_HIDE_SIDEBAR"

// Actions
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

export function logoutUser(error) {
	return function(dispatch) {
		dispatch({ type: UNAUTH_USER, payload: error || "" })
		cookies.remove("token", { path: "/" })
		cookies.remove("user", { path: "/" })
	}
}

// Reducers
const INITIAL_STATE = { activeNavTab: "", sidebarVisible: false }

function navLinkReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case SET_ACTIVE_NAV_LINK: {
			return _.extend({}, state, { activeNavTab: action.payload })
		}
	}

	return state
}

function sidebarReducer(state = INITIAL_STATE, action) {
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

// Selectors
const activeNavTab = state => state.nav.activeNavTab
const sidebarVisible = state => state.nav.sidebarVisible
const authenticated = state => state.auth.authenticated

export const selector = createStructuredSelector({
	activeNavTab,
	sidebarVisible,
	authenticated
})
