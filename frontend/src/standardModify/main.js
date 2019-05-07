import React, {Component} from 'react';
import {Col, Row, Divider} from "antd";
import {StandardFoodTree} from "./standardFoodTree";
import {StandardAttributeTree} from "./standardAttributeTree";
import './main.css'

export class StandardModifyView extends Component {
    render() {
        return (
            <div id='standardModify'>
                <header>
                    <h1 className='title'>标准分类系统修正工具</h1>
                    <Divider/>
                    <div className='introduction'>
                        <p>拖动结点可变更父结点</p>
                        <p>在结点上右键可弹出菜单</p>
                    </div>
                </header>
                <Row type='flex' justify='center' align='top' gutter={48}>
                    <Col span={9}>
                        <header><h2>标准食品分类</h2></header>
                        <StandardFoodTree/>
                    </Col>
                    <Divider type='vertical'/>
                    <Col span={9}>
                        <header><h2>标准属性</h2></header>
                        <StandardAttributeTree/>
                    </Col>
                </Row>
            </div>
        )
    }
}