import React, {Component} from 'react'
import {Select, TreeSelect} from 'antd';
import {getFoodNode, getGeneralFoodTree, goThroughFoodNodes, ID, Name, ParentID} from "../lib/getData";


function transformTreeData(rootNode) {
    rootNode.key = rootNode[ID];
    rootNode.value = rootNode[ID];
    rootNode.title = rootNode[Name];
    for (let i = 0; i < rootNode.children.length; i++)
        transformTreeData(rootNode.children[i]);
    return rootNode;
}

export class GeneralFoodSearchBar extends Component {
    state = {
        // value: this.props.defaultGeneralFoodID,
        expandedKeys: []
    };
    TreeData = {};
    rootID = {};

    getData() {
        this.TreeData = getGeneralFoodTree();
        for (let field in this.TreeData) {
            this.TreeData[field] = [transformTreeData(this.TreeData[field])];
            this.rootID[field] = this.TreeData[field][0][ID];
        }
    }

    onChange = (value) => {
        // this.setState(state => state.value = value);
        this.props.setGeneralFoodID(value);
    };
    onSearch = (inputValue) => {
        if (inputValue === '') {
            this.setState({expandedKeys: []});
            return;
        }
        const expandedKeys = goThroughFoodNodes((node) => node[Name].indexOf(inputValue) > -1 ? node[ParentID] : null, this.props.field).filter(d => d);
        this.setState({expandedKeys});
    };
    onExpand = (expandedKeys) => this.setState({expandedKeys});
    filterTreeNode = (inputValue, node) => {
        let currentID = node.key;
        while (currentID && currentID !== this.rootID) {
            let generalFoodNode = getFoodNode(currentID, this.props.field);
            if (generalFoodNode[Name].indexOf(inputValue) > -1)
                return true;
            currentID = generalFoodNode[ParentID];
        }
        return false;
    };

    render() {
        this.getData();
        let value = this.props.value;
        if (value === '')
            value = undefined;
        return (
            <div className='selectTrees' id='generalFoodSearchTree'>
                <TreeSelect
                    allowClear
                    showSearch
                    size='large'
                    className='select'
                    value={value}
                    filterTreeNode={this.filterTreeNode}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    placeholder="在此搜索选择或直接单击左侧结点"
                    treeData={this.TreeData[this.props.field]}
                    onChange={this.onChange}
                    onSearch={this.onSearch}
                    treeExpandedKeys={this.state.expandedKeys}
                    onTreeExpand={this.onExpand}
                    getPopupContainer={() => document.getElementById('generalFoodSearchTree')}
                />
            </div>
        );
    }
}
