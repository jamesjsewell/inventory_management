import React, { Component } from "react"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"
import { Button, Grid, Segment, Input, Form } from "semantic-ui-react"
import { FormField } from "../../formHelpers/formFields.js"
import ResetPassword from "../../authComponents/resetPasswordComponent.js"

class ResetPasswordPage extends Component {
    render() {
        return (
            <Grid container>

                <Grid.Column>
                    <Segment>
                        <ResetPassword match={this.props.match} />
                    </Segment>
                </Grid.Column>

            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        null: null
    }
}

export default connect(mapStateToProps)(ResetPasswordPage)
