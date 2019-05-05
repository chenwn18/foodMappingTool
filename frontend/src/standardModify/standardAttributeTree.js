import React, {Component} from 'react'
import {Tree, Input, Menu, Dropdown, Button, Modal} from 'antd'
import {
    ID,
    Name,
    getParentAttributeID,
    goThroughAttributeNodes,
    getAttributeNode,
    getRootAttributeID, Path
} from "../lib/getData";
import {AddStandardNode} from "./addStandardNode";
import {addStandardAttribute, changeAttributeParent, modifyAttributeInfo} from "../lib/postData";
import {DeleteStandardAttributeModal} from "./deleteStandardAttributeModal";
import {ModifyInfoModal} from "./modifyInofModal";


const {TreeNode} = Tree;
const Search = Input.Search;

class RightClickMenuWrapper extends Component {
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0"><ModifyInfoModal id={this.props.id} modifyInfo={modifyAttributeInfo}/></Menu.Item>
                <Menu.Item key="1"><AddStandardNode id={this.props.id} addNode={addStandardAttribute}/></Menu.Item>
                <Menu.Item key="2"><DeleteStandardAttributeModal id={this.props.id}/></Menu.Item>
            </Menu>
        );
        return (
            <Dropdown overlay={menu} trigger={['contextMenu']}>
                {this.props.content}
            </Dropdown>
        )
    }
}

export class StandardAttributeTree extends Component {
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
        changeAttributeParent(this.state.currentID, this.state.newParentID);
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
        const currentParentID = getParentAttributeID(id);
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
            newParentID = getParentAttributeID(dropKey);
        this.changeParent(dragKey, newParentID);

    };
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    containQueryValue = (item, value) => {
        return item[Name].indexOf(value) > -1;
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
        const expandedKeys = goThroughAttributeNodes((item) => {
            if (this.containQueryValue(item, value)) {
                return getParentAttributeID(item[ID]);
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
            const item = getAttributeNode(id);
            const index = item[Name].indexOf(searchValue);
            let title = <span>{item[Name]}</span>;
            if (index > -1) {
                const beforeStr = item[Name].substr(0, index);
                const afterStr = item[Name].substr(index + searchValue.length);
                title = (
                    <span>
                        {beforeStr}
                        <span className='nameSearched'>{searchValue}</span>
                        {afterStr}
                    </span>
                );
            }
            return (
                <TreeNode key={item[ID]} title={<RightClickMenuWrapper id={item[ID]} content={title}/>}>
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
                    {loop([getRootAttributeID()])}
                </Tree>
                <Modal
                    visible={this.state.changeParentModalVisible}
                    title="父节点变更确认"
                    footer={[
                        <Button key="back" onClick={this.handleChangeParentModalCancel}>取消</Button>,
                        <Button key="submit" type="primary" loading={this.state.changeParentModalLoading} onClick={this.handleChangeParentModalOK}>
                            确认变更
                        </Button>,
                    ]}
                >
                    <p>
                        确认将
                        <span
                            className='changeParentFrom'>{getAttributeNode(this.state.currentID || '属性0')[Name]}</span>
                        的父节点从
                        <span
                            className='changeParentFrom'>{getAttributeNode(getParentAttributeID(this.state.currentID || '属性1'))[Path]}</span>
                        变更为
                        <span
                            className='changeParentTo'>{getAttributeNode(this.state.newParentID || '属性1')[Path]} </span>
                        吗？
                    </p>
                </Modal>
            </div>
        );
    }
}
