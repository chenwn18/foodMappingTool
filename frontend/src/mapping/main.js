import React, {Component} from 'react';
import {Row, Col, Affix, Divider} from "antd";
import {GeneralFoodTree} from "./generalFoodTree";
import {StandardFoodTree} from "./standardFoodTree";
import {GeneralFoodSearchBar} from "./generalFoodSearchBar";
import {CandidateFoodSearchBar} from "./candidateFoodSearchBar";
import {CandidateAttributeSearchBar} from "./candidateAttributeSearchBar";
import {getCandidate} from "../lib/getData";
import {ConfirmMappingModal} from "./confirmMappingModal";
import './main.css'
import {FieldSelect} from "./fieldSelect";

export class MappingView extends Component {
    state = {
        standardFoodID: '',
        standardAttributeIDs: [],
        generalFoodID: '',
        candidateFoodIDs: [],
        field: '化学',
        highlight: false
    };

    setMappingBoxHighlight(highlight) {
        this.setState({highlight: highlight});
    }

    getCandidate(generalID) {
        getCandidate(generalID, this.state.field, (candidateFoodIDs, candidateAttributeIDs) =>
            this.setState({
                candidateFoodIDs: candidateFoodIDs,
                standardAttributeIDs: candidateAttributeIDs
            }));
    }

    setStandardFoodID(id) {
        this.setState({standardFoodID: id});
    }

    setStandardAttributeIDs(ids) {
        this.setState({standardAttributeIDs: ids});
    }

    setGeneralFoodID(id) {
        this.setState({generalFoodID: id});
        this.getCandidate(id);
        // this.getCandidateFoodIDs(id);
        // this.getCandidateAttributeIDs(id);
    }

    setField(field) {
        this.setState({field: field});
        this.setGeneralFoodID();
    }

    render() {
        return (
            <div id='mapping'>
                <header>
                    <h1 className='title'>食品分类映射工具</h1>
                    <span id="selectField">
                        <h3>领域选择</h3>
                        <FieldSelect value={this.state.field} setField={this.setField.bind(this)}/>
                    </span>
                    <Divider/>
                </header>
                <Row type='flex' justify='center' align='top' gutter={48}>
                    <Col span={8}>
                        <header>
                            <h2>{this.state.field}食品分类</h2>
                            <Divider/>
                            <div className='introduction'>
                                <p>单击结点将出现在右侧工作台</p>
                                <p>鼠标停留显示映射关系</p>
                                <p>输入食品名称可搜索</p>
                            </div>
                        </header>
                        <GeneralFoodTree field={this.state.field} setGeneralFoodID={this.setGeneralFoodID.bind(this)}
                                         setStandardFoodID={this.setStandardFoodID.bind(this)}
                                         setStandardAttributeIDs={this.setStandardAttributeIDs.bind(this)}
                                         setMappingBoxHighlight={this.setMappingBoxHighlight.bind(this)}/>
                    </Col>

                    <Col className={'mappingBox' + (this.state.highlight ? " highlight" : "")} span={8}>
                        <Affix offsetTop={0}>
                            <header>
                                <h2>映射工作台</h2>
                                <Divider/>
                                <div className='introduction'>
                                    <p>左右两侧单击的食品将出现于此</p>
                                    <p>选择框可按名称搜索</p>
                                    <p>随页面滚动</p>
                                </div>
                            </header>
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
                            <ConfirmMappingModal generalID={this.state.generalFoodID}
                                                 standardID={this.state.standardFoodID}
                                                 standardAttributeIDs={this.state.standardAttributeIDs}
                                                 field={this.state.field}/>
                        </Affix>
                    </Col>

                    <Col span={8}>
                        <header>
                            <h2>标准食品分类</h2>
                            <Divider/>
                            <div className='introduction'>
                                <p>单击结点将出现在右侧工作台</p>
                                <p>可根据名称或同义词搜索</p>
                                <p>鼠标停留显示映射关系</p>
                            </div>
                        </header>
                        <StandardFoodTree setGeneralFoodID={this.setGeneralFoodID.bind(this)}
                                          setStandardAttributeIDs={this.setStandardAttributeIDs.bind(this)}
                                          setStandardFoodID={this.setStandardFoodID.bind(this)}
                                          setField={this.setField.bind(this)}
                                          setMappingBoxHighlight={this.setMappingBoxHighlight.bind(this)}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}
