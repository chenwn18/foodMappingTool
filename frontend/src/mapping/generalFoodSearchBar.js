import React, {Component} from 'react'
import {TreeSelect} from 'antd';
import {getFoodNode, getGeneralFoodTree, ID, Name, ParentID} from "../lib/getData";

// const TreeNode = TreeSelect.TreeNode;
let TreeData = getGeneralFoodTree();

function transformTreeData(rootNode) {
    rootNode.key = rootNode[ID];
    rootNode.value = rootNode[ID];
    rootNode.title = rootNode[Name];
    for (let i = 0; i < rootNode.children.length; i++)
        transformTreeData(rootNode.children[i]);
    return rootNode;
}

let rootID = {};
for (let field in TreeData) {
    TreeData[field] = [transformTreeData(TreeData[field])];
    rootID[field] = TreeData[field][0][ID];
}

export class GeneralFoodSearchBar extends Component {
    state = {
        // value: this.props.defaultGeneralFoodID,
        expandedKeys: []
    };

    // dfs(nodeID, callBack) {
    //     let node = getFoodNode(nodeID, this.props.field);
    //     if (!node)
    //         return;
    //     callBack(node);
    //     for (let i = 0; i < node.children.length; i++) {
    //         this.dfs(node.children[i], callBack);
    //     }
    // }

    onChange = (value) => {
        // this.setState(state => state.value = value);
        this.props.setGeneralFoodID(value);
    };
    // onSearch = (inputValue) => {
    //     if (inputValue === '') {
    //         this.setState(state => state.expandedKeys = []);
    //         return;
    //     }
    //     let expandedKeys = [];
    //     this.dfs(rootID[this.props.field], node => {
    //         if (node[Name].indexOf(inputValue) > -1)
    //             expandedKeys.push(node[ParentID]);
    //     });
    //     this.setState(state => state.expandedKeys = expandedKeys);
    // };
    filterTreeNode = (inputValue, node) => {
        let currentID = node.key;
        while (currentID && currentID !== rootID) {
            let generalFoodNode = getFoodNode(currentID, this.props.field);
            if (generalFoodNode[Name].indexOf(inputValue) > -1)
                return true;
            currentID = generalFoodNode[ParentID];
        }
        return false;
    };

    render() {
        return (
            <TreeSelect
                allowClear
                showSearch
                style={{width: 300}}
                value={this.props.value}
                filterTreeNode={this.filterTreeNode}
                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                placeholder="Please select"
                treeData={TreeData[this.props.field]}
                onChange={this.onChange}
                // onSearch={this.onSearch}
                // treeExpandedKeys={this.state.expandedKeys}
            />
        );
    }
}
