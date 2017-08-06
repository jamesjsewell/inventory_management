import React, { Component, PropTypes } from "react"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"

class HomeLayout extends Component {

    render() {
        console.log(this.props)
        return (
            <form
                onSubmit={() => {
                    this.props.onSomethingCool("fuck")
                }}
            >
                <button type="submit" />

            </form>
        )
    }
}

export default reduxForm({
    form: "testForm"
})(HomeLayout)
