import React, {Component} from 'react';
import {Row, Col, Button} from "antd";
import {GeneralFoodTree} from "./generalFoodTree";
import {StandardFoodTree} from "./standardFoodTree";
import {GeneralFoodSearchBar} from "./generalFoodSearchBar";
import {CandidateFoodSearchBar} from "./candidateFoodSearchBar";
import {CandidateAttributeSearchBar} from "./candidateAttributeSearchBar";
import {getCandidate} from "../lib/getData";
import {ConfirmMappingModal} from "./confirmMappingModal";
import './main.css'

export class MappingView extends Component {
    state = {
        standardFoodID: '',
        standardAttributeIDs: [],
        generalFoodID: '',
        candidateFoodIDs: [],
        field: '化学'
    };

    getCandidate(generalID) {
        getCandidate(generalID, this.state.field, (candidateFoodIDs, candidateAttributeIDs) =>
            this.setState({
                candidateFoodIDs: candidateFoodIDs,
                standardAttributeIDs: candidateAttributeIDs
            }));
    }

    // getCandidateFoodIDs(generalID) {
    //     const candidateIDs = getCandidateFoodIDs(generalID, this.state.field) || [];
    //     this.setState(state => state.candidateFoodIDs = candidateIDs);
    // }
    //
    // getCandidateAttributeIDs(generalID) {
    //     const attributeIDs = getCandidateAttributeIDs(generalID, this.state.field) || [];
    //     this.setState(state => state.standardAttributeIDs = attributeIDs);
    // }

    setStandardFoodID(id) {
        this.setState(state => state.standardFoodID = id);
    }

    setStandardAttributeIDs(ids) {
        this.setState(state => state.standardAttributeIDs = ids);
    }

    setGeneralFoodID(id) {
        this.setState(state => state.generalFoodID = id);
        this.getCandidate(id);
        // this.getCandidateFoodIDs(id);
        // this.getCandidateAttributeIDs(id);
    }

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
                            <ConfirmMappingModal generalID={this.state.generalFoodID}
                                                 standardID={this.state.standardFoodID}
                                                 standardAttributeIDs={this.state.standardAttributeIDs}
                                                 field={this.state.field}/>

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
