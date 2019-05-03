import React, {Component} from 'react'
import {Tree, Input, Popover} from 'antd'
import {goThroughNodes, getParentFoodID, getRootFoodID, getFoodNode, getSynonymNames, ID, Name} from "../lib/getData";
import './standardFoodTree.css'
import {StandardFoodDetail} from "./standardFoodDetail";

const {TreeNode} = Tree;
const Search = Input.Search;

// const standardFoodNodeDict = getStandardFoods();
// const standardAttributesDict = getStandardAttributes();
// const generalFoods = getFieldFoods();
// const ParentID = 'parent_id';
// const Name = 'name';
// const ID = 'id';
// const Synonyms = 'synonyms';
// const Path = 'path';
// const Entity = 'entity';
// const rootID = findRootNodeID(standardFoodNodeDict);

export class StandardFoodTree extends Component {
    state = {
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
    };

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    containQueryValue = (item, value) => {
        return item[Name].indexOf(value) > -1 || getSynonymNames(item[ID]).join('|').indexOf(value) > -1;
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
                return getParentFoodID(item[ID]);
            }
            return null;
        }).filter((item) => item);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };

    render() {
        const {searchValue, expandedKeys, autoExpandParent} = this.state;
        const loop = IDs => IDs.map(id => {
            const item = getFoodNode(id);
            const index_origin = item[Name].indexOf(searchValue);
            const index_synonym = getSynonymNames(id).join('|').indexOf(searchValue);
            let title = <span>{item[Name]}</span>;
            if (index_origin > -1) {
                const beforeStr = item[Name].substr(0, index_origin);
                const afterStr = item[Name].substr(index_origin + searchValue.length);
                title = (
                    <span>
                        {beforeStr}
                        <span className='nameSearched'>{searchValue}</span>
                        {afterStr}
                    </span>
                );
            } else if (index_synonym > -1) {
                title = (
                    <span className='synonymSearched'>{item[Name]}</span>
                )
            }
            return (
                <TreeNode key={item[ID]} title={
                    <Popover placement='right' title={item[Name]}
                             content={<StandardFoodDetail id={item[ID]} searchValue={searchValue}
                                                          setStandardFoodID={this.props.setStandardFoodID.bind(this)}
                                                          setStandardAttributeIDs={this.props.setStandardAttributeIDs.bind(this)}
                                                          setGeneralFoodID={this.props.setGeneralFoodID.bind(this)}/>}>
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
                >
                    {loop([getRootFoodID()])}
                </Tree>
            </div>
        );
    }
}
