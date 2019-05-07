import React, {Component} from 'react'
import {Modal, Button, Table} from 'antd';
import {getAttributeOperationRecord, getFoodOperationRecord,} from "../lib/getData";

export class OperationHistoryModal extends Component {
    state = {
        visible: false,
    };

    showModal = () => {
        if (!this.props.id)
            return;
        this.setState({
            visible: true,
        });
    };
    modalInfo = () => {
        const columns = [{
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            render: text => <a href="#">{text}</a>
        }, {
            title: '操作内容',
            dataIndex: 'operation',
            key: 'operation'
        }];
        let records = [];
        if (this.props.type === 'food') {
            if (!this.props.field || this.props.field === 'undefined')
                records = getFoodOperationRecord(this.props.id);
            else
                records = getFoodOperationRecord(this.props.id, this.props.field);
        } else
            records = getAttributeOperationRecord(this.props.id);
        return <Table columns={columns} dataSource={records}/>
    };
    handleCancel = () => {
        this.setState({visible: false});
    };

    render() {
        return (
            <div>
                <a href="#" onClick={this.showModal}>
                    查看操作历史
                </a>
                <Modal
                    visible={this.state.visible}
                    title={<span className='modalTitle'>操作历史记录</span>}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="ok" onClick={this.handleCancel}>OK</Button>,
                    ]}
                >
                    {this.modalInfo()}
                </Modal>
            </div>
        );
    }
}

OperationHistoryModal.defaultProps = {
    type: 'food',
    id: '',
    field: ''
};