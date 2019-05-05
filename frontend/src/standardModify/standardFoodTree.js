import React, {Component} from 'react'
import {Tree, Input, Popover, Menu, Dropdown, Button, Modal} from 'antd'
import {
    goThroughFoodNodes,
    getParentFoodID,
    getRootFoodID,
    getFoodNode,
    getSynonymNames,
    ID,
    Name,
    Path
} from "../lib/getData";
import {DeleteStandardFoodModal} from "./deleteStandardFoodModal";
import {StandardFoodDetail} from "./standardFoodDetail";
import {AddStandardNode} from "./addStandardNode";
import {addStandardFood, changeFoodParent, modifyStandardFoodInfo} from "../lib/postData";
import {ModifyInfoModal} from "./modifyInofModal";

const {TreeNode} = Tree;
const Search = Input.Search;

class RightClickMenuWrapper extends Component {
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0"><ModifyInfoModal id={this.props.id} modifyInfo={modifyStandardFoodInfo}/></Menu.Item>
                <Menu.Item key="1"><DeleteStandardFoodModal id={this.props.id}/></Menu.Item>
                <Menu.Item key="2"><AddStandardNode id={this.props.id} addNode={addStandardFood}/></Menu.Item>
                {/*<Menu.Item key="3"><a href="#" onClick={() => this.props.changeParent()}>变更父节点</a></Menu.Item>*/}
            </Menu>
        );
        return (
            <Dropdown overlay={menu} trigger={['contextMenu']}>
                {this.props.content}
            </Dropdown>
        )
    }
}

export class StandardFoodTree extends Component {
    state = {
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        changeParentModalLoading: false,
        changeParentModalVisible: false,
        currentID: '',
        newParentID: ''
    };
    handleChangeParentModalOK = () => {
        this.setState({changeParentModalLoading: true});
        changeFoodParent(this.state.currentID, this.state.newParentID);
        setTimeout(() => {
            this.setState({
                changeParentModalLoading: false,
                changeParentModalVisible: false
            });
        }, 2000);
    };
    handleChangeParentModalCancel = () => {
        this.setState({changeParentModalVisible: false});
    };
    changeParent = (id, newParentID) => {
        const currentParentID = getParentFoodID(id);
        if (currentParentID === newParentID)
            return;
        this.setState({
            currentID: id,
            newParentID: newParentID,
            changeParentModalVisible: true
        });
    };
    onDrop = (info) => {
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        let newParentID = dropKey;
        if (info.dropToGap)
            newParentID = getParentFoodID(dropKey);
        this.changeParent(dragKey, newParentID);

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
        const expandedKeys = goThroughFoodNodes((item) => {
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
                    <RightClickMenuWrapper id={item[ID]} content={
                        <Popover placement='right' title={item[Name]}
                                 content={<StandardFoodDetail id={item[ID]} searchValue={searchValue}/>}>
                            {title}
                        </Popover>}/>}>
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
                    draggable
                    onDrop={this.onDrop}
                >
                    {loop([getRootFoodID()])}
                </Tree>
                <Modal
                    visible={this.state.changeParentModalVisible}
                    title="父节点变更确认"
                    footer={[
                        <Button key="back" onClick={this.handleChangeParentModalCancel}>取消</Button>,
                        <Button key="submit" type="primary" loading={this.state.changeParentModalLoading}
                                onClick={this.handleChangeParentModalOK}>
                            确认变更
                        </Button>,
                    ]}
                >
                    <p>
                        确认将
                        <span
                            className='changeParentFrom'>{getFoodNode(this.state.currentID || '食品1')[Name]}</span>
                        的父节点从
                        <span
                            className='changeParentFrom'>{getFoodNode(getParentFoodID(this.state.currentID || '食品1'))[Path]}</span>
                        变更为
                        <span
                            className='changeParentTo'>{getFoodNode(this.state.newParentID || '食品1')[Path]} </span>
                        吗？
                    </p>
                </Modal>
            </div>
        );
    }
}
