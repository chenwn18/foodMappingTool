import React, {Component} from 'react';
import {Row, Col, Button} from "antd";
import {GeneralFoodTree} from "./generalFoodTree";
import {StandardFoodTree} from "./standardFoodTree";
import {GeneralFoodSearchBar} from "./generalFoodSearchBar";
import {CandidateFoodSearchBar} from "./candidateFoodSearchBar";
import {CandidateAttributeSearchBar} from "./candidateAttributeSearchBar";
import {addMapping} from "../lib/postData";
import {getCandidateAttributeIDs, getCandidateFoodIDs} from "../lib/getData";
import './main.css'

export class MappingView extends Component {
    state = {
        standardFoodID: '',
        standardAttributeIDs: [],
        generalFoodID: '',
        candidateFoodIDs: [],
        field: '化学'
    };

    getCandidateFoodIDs(generalID) {
        const candidateIDs = getCandidateFoodIDs(generalID, this.state.field) || [];
        this.setState(state => state.candidateFoodIDs = candidateIDs);
    }

    getCandidateAttributeIDs(generalID) {
        const attributeIDs = getCandidateAttributeIDs(generalID, this.state.field) || [];
        this.setState(state => state.standardAttributeIDs = attributeIDs);
    }

    setStandardFoodID(id) {
        console.log('food' + id);
        this.setState(state => state.standardFoodID = id);
    }

    setStandardAttributeIDs(ids) {
        console.log('att' + ids);
        this.setState(state => state.standardAttributeIDs = ids);
    }

    setGeneralFoodID(id) {
        console.log('general' + id);
        this.setState(state => state.generalFoodID = id);
        this.getCandidateFoodIDs(id);
        this.getCandidateAttributeIDs(id);
    }

    //todo: 对话框提示确认，等待服务器返回结果
    addMapping = () => {
        addMapping(this.state.generalFoodID, this.state.standardFoodID, this.state.standardAttributeIDs);
    };

    render() {
        return (
            <div>
                <Row type='flex' justify='center' align='top' gutter={48}>
                    <Col span={8}>
                        <header><h2>化学污染物食品分类</h2></header>
                        <GeneralFoodTree field={this.state.field} setGeneralFoodID={this.setGeneralFoodID.bind(this)}/>
                    </Col>
                    <Col span={8}>
                        <div>
                            <h3>选择普通食品</h3>
                            <GeneralFoodSearchBar setGeneralFoodID={this.setGeneralFoodID.bind(this)}
                                                  field={this.state.field} value={this.state.generalFoodID}/>
                        </div>
                        <div>
                            <h3>选择标准食品</h3>
                            <CandidateFoodSearchBar setStandardFoodID={this.setStandardFoodID.bind(this)}
                                                    value={this.state.standardFoodID}
                                                    candidateIDs={this.state.candidateFoodIDs}/>
                        </div>
                        <div>
                            <h3>选择标准属性</h3>
                            <CandidateAttributeSearchBar IDs={this.state.standardAttributeIDs}
                                                         setStandardAttributeIDs={this.setStandardAttributeIDs.bind(this)}/>
                        </div>
                        <div>
                            <Button onClick={this.addMapping} size='large' type='primary'>提交映射</Button>
                        </div>
                    </Col>
                    <Col span={8}>
                        <header><h2>标准食品分类</h2></header>
                        <StandardFoodTree setGeneralFoodID={this.setGeneralFoodID.bind(this)}
                                          setStandardAttributeIDs={this.setStandardAttributeIDs.bind(this)}
                                          setStandardFoodID={this.setStandardFoodID.bind(this)}/>
                    </Col>
                </Row>
            </div>
        )
    }
}
