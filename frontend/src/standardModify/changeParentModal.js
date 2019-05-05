import React, {Component} from 'react'
import {Button, Modal} from 'antd';
import {changeAttributeParent} from "../lib/postData";

class ChangeParentModal extends Component {
    state = {
        loading: false,
        visible: false,
    };

    showModal = () => {
        this.setState({
            changeParentModalVisible: true,
        });
    };

    handleOk = () => {
        this.setState({changeParentModalLoading: true});
        changeAttributeParent(this.props.id, this.props.newParentID);
        setTimeout(() => {
            this.setState({changeParentModalLoading: false, changeParentModalVisible: false});
        }, 2000);
    };
    handleCancel = () => {
        this.setState({changeParentModalVisible: false});
    };

    render() {
        const {visible, loading} = this.state;
        return (
            <Modal
                visible={visible}
                title="父节点变更确认"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                        确认变更
                    </Button>,
                ]}
            />
        )
    }
}