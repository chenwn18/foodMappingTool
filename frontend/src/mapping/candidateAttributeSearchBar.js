import React, {Component} from 'react'
import {TreeSelect} from 'antd';
import {getAttributeNode, getStandardAttributeTree, ID, Name, ParentID} from "../lib/getData";

// const TreeNode = TreeSelect.TreeNode;
let TreeData = getStandardAttributeTree();

function transformTreeData(rootNode) {
    rootNode.key = rootNode[ID];
    rootNode.value = rootNode[ID];
    rootNode.title = rootNode[Name];
    for (let i = 0; i < rootNode.children.length; i++)
        transformTreeData(rootNode.children[i]);
    return rootNode;
}

TreeData = [transformTreeData(TreeData)];
const rootID = TreeData[0][ID];

export class CandidateAttributeSearchBar extends Component {
    // state = {
    //     value: undefined,
    // };

    onChange = (value) => {
        // this.setState({value: value});
        // console.log(value);
        this.props.setStandardAttributeIDs(value.map(d => d.value));
    };
    filterTreeNode = (inputValue, node) => {
        let currentID = node.key;
        while (currentID && currentID !== rootID) {
            let attributeNode = getAttributeNode(currentID);
            if (attributeNode[Name].indexOf(inputValue) > -1)
                return true;
            currentID = attributeNode[ParentID];
        }
        return false;
    };

    render() {
        return (
            <TreeSelect
                showSearch
                multiple
                treeCheckable
                treeCheckStrictly
                style={{width: 300}}
                value={this.props.IDs.map(id => {
                    return {label: getAttributeNode(id)[Name], value: id}
                })}
                // treeNodeLabelProp={Name}
                // treeNodeFilterProp={Name}
                filterTreeNode={this.filterTreeNode}
                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                placeholder="Please select"
                allowClear
                treeData={TreeData}
                // treeDefaultExpandAll
                onChange={this.onChange}
            />
        );
    }
}
