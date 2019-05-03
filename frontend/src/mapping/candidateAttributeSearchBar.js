import React, {Component} from 'react'
import {TreeSelect} from 'antd';
import {getStandardAttributeTree, ID, Name} from "../lib/getData";

const TreeNode = TreeSelect.TreeNode;
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
console.log(TreeData);

export class CandidateAttributeSearchBar extends Component {
    state = {
        value: undefined,
    };

    onChange = (value) => {
        this.setState({value: value});
    };

    render() {
        return (
            <TreeSelect
                showSearch
                multiple
                style={{width: 300}}
                value={this.state.value}
                treeNodeLabelProp={Name}
                treeNodeFilterProp={Name}
                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                placeholder="Please select"
                allowClear
                treeData={TreeData}
                // treeDefaultExpandAll
                onChange={this.onChange}
            >
                {/*<TreeNode value="parent 1" title="parent 1" key="0-1">*/}
                {/*    <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">*/}
                {/*        <TreeNode value="leaf1" title="my leaf" key="random"/>*/}
                {/*        <TreeNode value="leaf2" title="your leaf" key="random1"/>*/}
                {/*    </TreeNode>*/}
                {/*    <TreeNode value="parent 1-1" title="parent 1-1" key="random2">*/}
                {/*        <TreeNode value="sss" title={<b style={{color: '#08c'}}>sss</b>} key="random3"/>*/}
                {/*    </TreeNode>*/}
                {/*</TreeNode>*/}
            </TreeSelect>
        );
    }
}
