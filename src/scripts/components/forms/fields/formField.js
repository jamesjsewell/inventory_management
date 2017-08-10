import { Field, reduxForm } from "redux-form"
import { Button, Segment, Input, Form, Header} from "semantic-ui-react"
import React, { Component } from "react"

export const FormField = ({
    input,
    label,
    type,
    placeholder,
    required,
    asyncValidation,
    meta: { touched, error, warning, value, asyncValidating }
}) => (
    <Form.Field className={asyncValidating ? 'async-validating' : ''} required={required} error={error && touched ? true : false} >
        <Header sub size="tiny">{label}</Header>
        <Input
            type={type}
            value={input.value}
            onChange={(param, data) => input.onChange(data.value)}
            placeholder={placeholder}
            onBlur={(param, data) => input.onBlur(param)}
            
        />
        {touched &&
            ((error &&
                <Segment compact color="red">
                    <span>{error}</span>
                </Segment>) ||
                (warning &&
                    <Segment compact color="red">
                        <span>{warning}</span>
                    </Segment>))}
    </Form.Field>
)
