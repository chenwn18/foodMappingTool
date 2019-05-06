import React, {Component} from "react";
import {Divider, Popover, Select} from 'antd';
import {getFoodNode, getSynonymNames, goThroughFoodNodes, ID, Name, Path} from "../lib/getData";
import {StandardFoodDetail} from "./standardFoodDetail";
import {deepCopy} from "../lib/toolFunction";

const Option = Select.Option;

export class CandidateFoodSearchBar extends Component {
    // constructor(props) {
    //     super(props);
    //     console.log(this.props.candidateIDs);
    //     this.state = {
    //         optionIDs: this.props.candidateIDs
    //     }
    // }
    state = {optionIDs: []};

    onChange = (value) => {
        // let optionIDs = deepCopy(this.state.optionIDs);
        // if (this.props.value !== '' && optionIDs.indexOf(this.props.value) < 0)
        //     optionIDs.push(this.props.value);
        // this.setState({
        //     optionIDs: optionIDs
        // });
        this.props.setStandardFoodID(value);
    };

    //
    // onBlur() {
    //     console.log('blur');
    // }
    //
    // onFocus() {
    //     console.log('focus');
    // }

    onSearch = (val) => {
        if (val === '') {
            this.setState({
                optionIDs: this.props.candidateIDs
            });
        } else
            this.setState({
                optionIDs: goThroughFoodNodes(d => d).filter(node => {
                    return node[Name].indexOf(val) > -1 || getSynonymNames(node[ID]).join('|').indexOf(val) > -1;
                }).map(node => node[ID]).filter((d, i, self) => self.indexOf(d) === i)
            });
    };
    onSelect = (val) => {
        this.props.setStandardFoodID(val);
    };
    getPopupContainer = (triggerNode) => {
        // console.log(triggerNode);
        // return document.body;
        return document.getElementById('foodSelection');
        // return triggerNode;
    };
    filterOption = (input, option) => {
        return true;
        // if (input === '')
        //     return option.props.value in this.props.candidateIDs;
        // let node = getFoodNode(option.props.value);
        // return node[Name].indexOf(input) > -1 || getSynonymNames(node[ID]).join('|').indexOf(input) > -1;
    };
    onFocus = () => {
        let optionIDs = deepCopy(this.props.candidateIDs);
        if (this.props.value !== '' && optionIDs.indexOf(this.props.value) < 0)
            optionIDs.push(this.props.value);
        this.setState({
            optionIDs: optionIDs
        })
    };
    options = () => {
        let optionIDs = deepCopy(this.state.optionIDs);
        if (this.props.value !== '' && optionIDs.indexOf(this.props.value) < 0)
            optionIDs.push(this.props.value);
        return optionIDs.map(id => {
            let node = getFoodNode(id);
            if (!node)
                return null;
            return (
                <Option value={id} key={id}>
                    <Popover overlayClassName='popOver' getPopupContainer={this.getPopupContainer} placement='left'
                             trigger='hover'
                             title={node[Name]}
                             content={<StandardFoodDetail id={id}/>}>
                        <span className='candidateName'>{node[Name]}</span>
                        <Divider type='vertical'/>
                        <span className='candidatePath'>{node[Path]}</span>
                    </Popover>
                </Option>);
        }).filter(d => d);
    };

    render() {
        let value = this.props.value;
        if (value === '')
            value = undefined;
        return (
            <div className='selectTrees' id='candidateStandardFoodSearchTree'>
                <Select
                    allowClear
                    showSearch
                    id='foodSelection'
                    className='select'
                    size='large'
                    placeholder="选择候选项，如无合适候选，输入名称搜索"
                    notFoundContent="没有找到相关标准食品！"
                    value={value}
                    onSelect={this.onSelect}
                    // optionFilterProp="children"
                    onChange={this.onChange}
                    onFocus={this.onFocus}
                    // onBlur={onBlur}
                    onSearch={this.onSearch}
                    filterOption={this.filterOption}//{(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    getPopupContainer={() => document.getElementById('candidateStandardFoodSearchTree')}
                >
                    {this.options()}
                </Select>
            </div>
        )
    }
}
