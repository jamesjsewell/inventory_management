import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import { BrowserRouter, Route, Link } from "react-router-dom"
import thunk from "redux-thunk"
import RouterConfig from "./router.js"
import rootReducer from "./reducers.js"
import ReactGA from "react-ga"

// Initialize Google Analytics
ReactGA.initialize("UA-000000-01")

function logPageView() {
    ReactGA.pageview(window.location.pathname)
}

const middleware = applyMiddleware(thunk)
const store = createStore(rootReducer, middleware)

ReactDOM.render(

    <Provider store={store}>
        <BrowserRouter>
            <RouterConfig />
        </BrowserRouter>
    </Provider>,
    document.querySelector(".wrapper")
)