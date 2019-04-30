import React, {Component} from 'react'
import {Tree, Input, Popover, Table, Divider} from 'antd'
import {getStandardFoods, getFieldFoods, getStandardAttributes} from "../lib/getData";
import {findRootNodeID} from "../lib/toolFunction";
import './main.css'

const {TreeNode} = Tree;
const Search = Input.Search;

const standardFoodNodeDict = getStandardFoods();
const standardAttributesDict = getStandardAttributes();
let generalFoods = {};
const ParentID = 'parent_id';
const Name = 'name';
const ID = 'id';
const Synonyms = 'synonyms';
const Path = 'path';
const Entity = 'entity';
const rootID = findRootNodeID(standardFoodNodeDict);
const getParentKey = (key) => {
    return standardFoodNodeDict[key][ParentID];
};

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
        return item[Name].indexOf(value) > -1 || Object.keys(item[Synonyms]).join('|').indexOf(value) > -1;
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
        const expandedKeys = Object.values(standardFoodNodeDict).map((item) => {
            if (this.containQueryValue(item, value)) {
                return getParentKey(item[ID]);
            }
            return null;
        }).filter((item) => item);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };
    entityTable = (item) => {
        const entityDict = item[Entity];
        let entityData = [];
        for (let field in entityDict) {
            if (!(field in generalFoods)) {
                generalFoods[field] = getFieldFoods(field);
            }
            for (let entityID in entityDict[field]) {
                let foodNode = generalFoods[field][entityID];
                let attributeNodes = entityDict[field][entityID].map(attributeID => standardAttributesDict[attributeID][Name]);
                entityData.push({
                    field: field,
                    name: foodNode[Name],
                    attribute: attributeNodes.join('|'),
                    path: foodNode[Path]
                })
            }
        }
        const columns = [{
            title: '领域',
            dataIndex: 'field',
            key: 'field',
            render: text => <a href="javascript:">{text}</a>
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '属性',
            dataIndex: 'attribute',
            key: 'attribute',
            render: text => <a href="javascript:">{text}</a>
        }, {
            title: '路径',
            dataIndex: 'path',
            key: 'path'
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a href="javascript:">删除</a>
                    <Divider type='vertical'/>
                    <a href="javascript:">修改</a>
                </span>
            )
        }];
        return <Table columns={columns} dataSource={entityData}/>
    };
    detailContent = (item, searchValue) => {
        let synonyms = Object.keys(item[Synonyms]).join('|');
        const index = synonyms.indexOf(searchValue);
        const beforeStr = synonyms.substr(0, index);
        const afterStr = synonyms.substr(index + searchValue.length);
        synonyms = index > -1 ? (
            <span>
                {beforeStr}
                <span className="nameSearched">{searchValue}</span>
                {afterStr}
            </span>
        ) : <span>{synonyms || '无'}</span>;
        return (
            <div>
                <p>别称：{synonyms}</p>
                <p>路径：{item[Path]}</p>
                {this.entityTable(item)}
            </div>
        )
    };
    treeNodeTitleWithPopover = ((item, title, searchValue) => {
        return (
            <Popover placement='right' title={item[Name]} content={this.detailContent(item, searchValue)}>
                {title}
            </Popover>
        );
    });

    render() {
        const {searchValue, expandedKeys, autoExpandParent} = this.state;
        const loop = IDs => IDs.map(id => {
            const item = standardFoodNodeDict[id];
            const index_origin = item[Name].indexOf(searchValue);
            const index_synonym = Object.keys(item[Synonyms]).join('|').indexOf(searchValue);
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
                <TreeNode key={item[ID]} title={this.treeNodeTitleWithPopover(item, title, searchValue)}>
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
                    {loop([rootID])}
                </Tree>
            </div>
        );
    }
}
