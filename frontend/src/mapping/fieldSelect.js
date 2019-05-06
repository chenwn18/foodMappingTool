import React, {Component} from 'react'
import {Radio} from 'antd';
import {getFields} from "../lib/getData";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export class FieldSelect extends Component {
    onChange = (e) => {
        this.props.setField(e.target.value);
    };

    render() {
        const fields = getFields();
        const RadioButtons = fields.map(field => (<RadioButton value={field}>{field}</RadioButton>));
        return (
            <div className='select'>
                <RadioGroup value={this.props.value} onChange={this.onChange} size="large">
                    {RadioButtons}
                </RadioGroup>
            </div>
        )
    }
}
