import React, {Component} from "react";
import {Divider, Select} from 'antd';
import {getFoodNode, getSynonymNames, goThroughNodes, ID, Name, Path} from "../lib/getData";

const Option = Select.Option;

export class CandidateFoodSearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionIDs: this.props.candidateIDs
        };
    }

    // onChange(value) {
    //     this.props.setStandardFoodID(value);
    // }

    //
    // onBlur() {
    //     console.log('blur');
    // }
    //
    // onFocus() {
    //     console.log('focus');
    // }

    onSearch = (val) => {
        if (val === '')
            this.setState({
                optionIDs: this.props.candidateIDs
            });
        else
            this.setState({
                optionIDs: goThroughNodes(d => d).filter(node => {
                    return node[Name].indexOf(val) > -1 || getSynonymNames(node[ID]).join('|').indexOf(val) > -1;
                }).map(node => node[ID])
            });
    };

    filterOption = (input, option) => {
        if (input === '')
            return option.props.value in this.props.candidateIDs;
        let node = getFoodNode(option.props.value);
        return node[Name].indexOf(input) > -1 || getSynonymNames(node[ID]).join('|').indexOf(input) > -1;
    };
    options = () => this.state.optionIDs.map(id => {
        let node = getFoodNode(id);
        return (
            <Option value={id}>
                <span>{node[Name]}</span>
                <Divider type='vertical'/>
                <span>{node[Path]}</span>
            </Option>);
    });

    render() {
        return (
            <Select
                showSearch={true}
                defaultActiveFirstOption={true}
                size='large'
                style={{width: 500}}
                placeholder="选择候选项，如无合适候选，输入名称搜索"
                notFoundContent="没有找到相关标准食品！"
                // optionFilterProp="children"
                onChange={this.props.setStandardFoodID}
                // onFocus={onFocus}
                // onBlur={onBlur}
                onSearch={this.onSearch}
                filterOption={this.filterOption}//{(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {this.options()}
            </Select>
        )
    }
}

CandidateFoodSearchBar.defaultProps = {
    candidateIDs: ['食品2', '食品3', '食品4']
};
