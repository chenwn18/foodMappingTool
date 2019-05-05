import React, {Component} from 'react'
import {Modal, Button, message} from 'antd';
import {Field, getAttributeNodes, getFoodNode, Name, Path} from "../lib/getData";
import {deleteMapping} from "../lib/postData";

export class DeleteMappingModal extends Component {
    state = {
        loading: false,
        visible: false,
    };

    showModal = () => this.setState({visible: true,});
    handleOk = () => {
        this.setState({loading: true});
        deleteMapping(this.props.generalID, this.props.standardID, this.props.field, (response) => {
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
        const attributeName = getAttributeNodes(this.props.generalID, this.props.standardID, this.props.field).map(attNode => attNode[Name]).join('|');
        if (!attributeName)
            return (<div>
                <p>确认移除{this.props.field}领域的<span className='emphasize1'>{generalFood[Path]}</span>与：</p>
                <p>标准食品<span className='emphasize2'>{standardFood[Path]}</span>的映射关系吗？</p>
            </div>);
        else if (!standardFood)
            return (<div>
                <p>确认移除{generalFood[Field]}领域的<span className='emphasize1'>{generalFood[Path]}</span>与：</p>
                <p>标准属性<span className='emphasize2'>{attributeName}</span>的映射关系吗？</p>
            </div>);
        else
            return (<div>
                <p>确认移除{generalFood[Field]}领域的<span className='emphasize1'>{generalFood[Path]}</span>与：</p>
                <p>标准食品<span className='emphasize2'>{standardFood[Path]}</span></p>
                <p>+</p>
                <p>属性<span className='emphasize2'>{attributeName}</span>的映射关系吗？</p>
            </div>);

    };
    handleCancel = () => {
        this.setState({visible: false});
    };

    render() {
        const {visible, loading} = this.state;
        return (
            <div>
                <a href="#" onClick={this.showModal}>
                    删除
                </a>
                <Modal
                    visible={visible}
                    title="映射删除确认"
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