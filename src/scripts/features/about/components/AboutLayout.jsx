import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
    Button,
    Grid,
    Segment,
    Input,
    Header,
    Modal,
    Icon,
    Container
} from "semantic-ui-react";

export default class AboutLayout extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Segment size="massive">

                <Container text size="massive">
                    Refugees, volunteers, and those donating supplies could use this prototype to keep track of what is in need at their shelter. Within the app, each "shelter" has a list of user submitted needs. Each user submitted need has a progress bar that indicates how much of the item is needed.
                    {" "}

                </Container>

            </Segment>
        );
    }
}
