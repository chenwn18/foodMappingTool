import React, {Component} from 'react';
import {Col, Row} from "antd";
import {StandardFoodTree} from "./standardFoodTree";
import {StandardAttributeTree} from "./standardAttributeTree";
import './main.css'
export class StandardModifyView extends Component {
    render() {
        return (
            <div>
                <Row type='flex' justify='center' align='top' gutter={48}>
                    <Col span={12}>
                        <StandardFoodTree/>
                    </Col>
                    <Col span={12}>
                        <StandardAttributeTree/>
                    </Col>
                </Row>
            </div>
        )
    }
}