import React, {Component} from 'react'
import {Tree, Input, Popover, Table, Divider} from 'antd'
import {
    goThroughNodes,
    getParentFoodID,
    getFoodNode,
    getOntologyNodes,
    getAttributeNodes,
    Name,
    ID, Path, Ontology, getRootFoodID
} from "../lib/getData";
import {GeneralFoodDetail} from "./generalFoodDetail";
import './generalFoodTree.css'

const {TreeNode} = Tree;
const Search = Input.Search;

// const standardFoodNodeDict = getStandardFoods();
// const standardAttributesDict = getStandardAttributes();
// const generalFoodNodeDict = getFieldFoods();
// const ParentID = 'parent_id';
// const Name = 'name';
// const ID = 'id';
// const Ontology = 'ontology';
// const Path = 'path';
// const Field = 'field';
// const Entity = 'entity';

export class GeneralFoodTree extends Component {
    state = {
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
    };
    getNode = (nodeID) => {
        return getFoodNode(nodeID, this.props.field);
    };
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    getOntologyNodes = (nodeID) => {
        return getOntologyNodes(nodeID, this.props.field);
    };

    containQueryValue = (item, value) => {
        if (item[Name].indexOf(value) > -1)
            return true;
        let ontologyNodes = this.getOntologyNodes(item[ID]);
        for (let i = 0; i < ontologyNodes.length; i++)
            if (ontologyNodes[i][Name].indexOf(value) > -1)
                return true;
        return false;
    };

    onChange = (e) => {
        const value = e.target.value;
        if (value === '') {
            this.setState({
                expandedKeys: [],
                searchValue: value,
                autoExpandParent: true
            });
            return;
        }
        const expandedKeys = goThroughNodes((item) => {
            if (this.containQueryValue(item, value)) {
                return getParentFoodID(item[ID], this.props.field);
            }
            return null;
        }, this.props.field).filter((item) => item);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };
    onSelect = (selectedKeys) => {
        this.props.setGeneralFoodID(selectedKeys[0]);
    };

    render() {
        const {searchValue, expandedKeys, autoExpandParent} = this.state;
        const loop = IDs => IDs.map(id => {
            const item = this.getNode(id);
            const index = item[Name].indexOf(searchValue);
            const haveOntology = item[Ontology].length > 0;
            const cssClass = haveOntology ? 'mapped' : 'unmapped';
            let title = <span className={cssClass}>{item[Name]}</span>;
            if (index > -1) {
                const beforeStr = item[Name].substr(0, index);
                const afterStr = item[Name].substr(index + searchValue.length);
                title = (
                    <span className={cssClass}>
                        {beforeStr}
                        <span className='nameSearched'>{searchValue}</span>
                        {afterStr}
                    </span>
                );
            }
            return (
                <TreeNode key={item[ID]} title={
                    <Popover placement='right' title={item[Name]}
                             content={<GeneralFoodDetail field={this.props.field} id={item[ID]}/>}>
                        {title}
                    </Popover>}>
                    {loop(item.children)}
                </TreeNode>
            );
        });

        return (
            <div>
                <Search style={{marginBottom: 8}} placeholder="Search" onChange={this.onChange}/>
                <Tree
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onSelect={this.onSelect}
                >
                    {loop([getRootFoodID(this.props.field)])}
                </Tree>
            </div>
        );
    }
}

GeneralFoodTree.defaultProps = {
    field: '化学'
};