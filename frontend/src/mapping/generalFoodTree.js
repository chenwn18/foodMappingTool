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
    getAttributes = (nodeID, ontologyID) => {
        let attributeNodes = getAttributeNodes(nodeID, ontologyID, this.props.field);
        return attributeNodes.map(attNode => attNode[Name]);
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
    ontologyTable = (item) => {
        const ontologyNodes = this.getOntologyNodes(item[ID]);
        const ontologyData = ontologyNodes.map(node => {
            return {name: node[Name], attribute: this.getAttributes(item[ID], node[ID]).join('|'), path: node[Path]}
        });
        const columns = [{
            title: '本体名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '属性',
            dataIndex: 'attribute',
            key: 'attribute',
            render: text => <a href="javascript:">{text}</a>
        }, {
            title: '本体路径',
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
                    <Divider type='vertical'/>
                    <a href="javascript:">新增</a>
                </span>
            )
        }];
        return <Table columns={columns} dataSource={ontologyData}/>
    };
    detailContent = (item) => (
        <div>
            <p>路径：{item[Path]}</p>
            {this.ontologyTable(item)}
        </div>
    );
    treeNodeTitleWithPopover = ((item, title) => {
        return (
            <Popover placement='right' title={item[Name]} content={this.detailContent(item)}>
                {title}
            </Popover>
        );
    });

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
                <TreeNode key={item[ID]} title={this.treeNodeTitleWithPopover(item, title)}>
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
                    {loop([getRootFoodID(this.props.field)])}
                </Tree>
            </div>
        );
    }
}

GeneralFoodTree.defaultProps = {
    field: '化学'
};