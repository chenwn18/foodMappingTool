import React, {Component} from 'react';
import {Row, Col} from "antd";
import {GeneralFoodTree} from "./generalFoodTree";
import {StandardFoodTree} from "./standardFoodTree";
import './main.css'

export class MappingView extends Component {
    state = {
        field: '化学'
    };

    render() {
        return (
            <div>
                <Row type='flex' justify='center' align='top' gutter={48}>
                    <Col span={8}>
                        <header><h2>化学污染物食品分类</h2></header>
                        <GeneralFoodTree field={this.state.field}/>
                    </Col>
                    <Col span={8}>
                        <header><h2>标准食品分类</h2></header>
                        <StandardFoodTree/>
                    </Col>
                </Row>
            </div>
        )
    }
}
