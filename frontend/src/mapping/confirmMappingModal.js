import React, {Component} from 'react'
import {Modal, Button, Table, message} from 'antd';
import {addMapping} from "../lib/postData";
import {Field, getAttributeNode, getFoodNode, Name, Path} from "../lib/getData";

export class ConfirmMappingModal extends Component {
    state = {
        loading: false,
        visible: false,
    };

    showModal = () => {
        if (!this.props.generalID) {
            message.error('待映射的食品不能为空！');
            return;
        }
        if (!this.props.standardID && this.props.standardAttributeIDs.length === 0) {
            message.error('标准食品和标准属性不能同时为空！');
            return;
        }
        this.setState({
            visible: true,
        });
    };
    handleOk = () => {
        this.setState({loading: true});
        addMapping(this.props.field, this.props.generalID, this.props.standardID, this.props.standardAttributeIDs, (response) => {
            if (response === 'success')
                message.info(response);
            else
                message.error(response);
            this.setState({loading: false, visible: false});
        });
    };
    modalInfo = () => {
        const generalFood = getFoodNode(this.props.generalID, this.props.field);
        const standardFood = getFoodNode(this.props.standardID);
        const attributeName = this.props.standardAttributeIDs.map(attID => getAttributeNode(attID)[Name]).join('|');
        if (!generalFood)
            return '';
        if (!attributeName && !standardFood)
            return '';
        if (!attributeName)
            return (<div>
                <p>将{generalFood[Field]}领域的<span>{generalFood[Path]}</span>映射为：</p>
                <p>标准食品<span>{standardFood[Path]}</span>？</p>
            </div>);
        else if (!standardFood)
            return (<div>
                <p>将{generalFood[Field]}领域的<span>{generalFood[Path]}</span>映射为：</p>
                <p>标准属性<span>{attributeName}</span>？</p>
            </div>);
        else
            return (<div>
                <p>将{generalFood[Field]}领域的<span>{generalFood[Path]}</span>映射为：</p>
                <p>标准食品<span>{standardFood[Path]}</span></p>
                <p>+</p>
                <p>属性<span>{attributeName}</span>？</p>
            </div>);

    };
    handleCancel = () => {
        this.setState({visible: false});
    };

    render() {
        const {visible, loading} = this.state;
        return (
            <div>
                <Button size='large' type="primary" onClick={this.showModal}>
                    提交映射
                </Button>
                <Modal
                    visible={visible}
                    title="映射确认"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
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