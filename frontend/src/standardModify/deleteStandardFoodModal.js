import React, {Component} from 'react'
import {Modal, Button, Table, message} from 'antd';
import {deleteStandardFood} from "../lib/postData";
import {Entity, getAttributeNode, getFoodChildrenIDs, getFoodNode, getOntologyNodes, Name, Path} from "../lib/getData";

export class DeleteStandardFoodModal extends Component {
    state = {
        loading: false,
        visible: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({loading: true});
        deleteStandardFood(this.props.id, (response) => {
            if (response === 'success')
                message.info('success');
            else
                message.error(response);
            this.setState({loading: false, visible: false});
        });
    };
    modalInfo = () => {
        let ids = getFoodChildrenIDs(this.props.id);
        let node = getFoodNode(this.props.id);
        let info1 = <p>确认删除<span className='emphasize1'>{node[Path]}</span>吗？</p>;
        if (ids.length > 1)
            info1 = <p>确认删除<span className='emphasize1'>{node[Path]}</span>及其<span
                className='emphasize1'>{(ids.length - 1)}个孩子结点</span>吗？</p>;
        let entityData = [];
        ids.forEach(id => {
            node = getFoodNode(id);
            let entityDict = node[Entity];
            for (let field in entityDict) {
                for (let entityID in entityDict[field]) {
                    let foodNode = getFoodNode(entityID, field);
                    entityData.push({
                        key: entityID + id,
                        field: field,
                        food: node[Name] + ' | ' + node[Path],
                        entity: foodNode[Name] + ' | ' + foodNode[Path],
                        attribute: entityDict[field][entityID].map(attributeID => getAttributeNode(attributeID)[Name]).join('|'),
                    })
                }
            }
        });
        let info2 = '';
        if (entityData.length > 0)
            info2 = <p className='warning'> 警告！这些属性被删除后，如下映射关系将受到影响！</p>;
        const columns = [{
            title: '待删除结点',
            dataIndex: 'food',
            key: 'food',
            render: text => <a href="#">{text}</a>
        }, {
            title: '相关领域',
            dataIndex: 'field',
            key: 'field'
        }, {
            title: '实体结点',
            dataIndex: 'entity',
            key: 'entity'
        }, {
            title: '属性',
            dataIndex: 'attribute',
            key: 'attribute',
            render: text => <a href="#">{text}</a>
        }];
        if (entityData.length > 0)
            return (<div>
                {info1}
                {info2}
                <Table columns={columns} dataSource={entityData}/>
            </div>);
        else
            return info1;
    };
    handleCancel = () => {
        this.setState({visible: false});
    };

    render() {
        const {visible, loading} = this.state;
        return (
            <div>
                <a href="#" onClick={this.showModal}>
                    删除结点
                </a>
                <Modal
                    visible={visible}
                    centered
                    title={<span className='modalTitle'>删除确认</span>}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="danger" loading={loading} onClick={this.handleOk}>
                            确认
                        </Button>,
                    ]}
                >
                    {this.modalInfo()}
                </Modal>
            </div>
        );
    }
}