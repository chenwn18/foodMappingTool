import React, {Component} from 'react'
import {Select, TreeSelect} from 'antd';
import {getAttributeNode, getStandardAttributeTree, ID, Name, ParentID} from "../lib/getData";

function transformTreeData(rootNode) {
    rootNode.key = rootNode[ID];
    rootNode.value = rootNode[ID];
    rootNode.title = rootNode[Name];
    for (let i = 0; i < rootNode.children.length; i++)
        transformTreeData(rootNode.children[i]);
    return rootNode;
}


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
        while (currentID && currentID !== this.rootID) {
            let attributeNode = getAttributeNode(currentID);
            if (attributeNode[Name].indexOf(inputValue) > -1)
                return true;
            currentID = attributeNode[ParentID];
        }
        return false;
    };
    TreeData = [];
    rootID = '';

    render() {
        this.TreeData = [transformTreeData(getStandardAttributeTree())];
        this.rootID = this.TreeData[0][ID];
        return (
            <div className='selectTrees' id='candidateAttributeSearchTree'>
                <TreeSelect
                    showSearch
                    multiple
                    treeCheckable
                    treeCheckStrictly
                    size='large'
                    className='select'
                    value={
                        this.props.IDs
                            .map(id => {
                                return {label: getAttributeNode(id)[Name], value: id}
                            })
                    }
                    // treeNodeLabelProp={Name}
                    // treeNodeFilterProp={Name}
                    filterTreeNode={this.filterTreeNode}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    placeholder="留空表示等价映射，可多选。"
                    allowClear
                    treeData={this.TreeData}
                    // treeDefaultExpandAll
                    onChange={this.onChange}
                    getPopupContainer={() => document.getElementById('candidateAttributeSearchTree')}
                />
            </div>
        );
    }
}
