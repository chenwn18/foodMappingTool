import React, {Component} from 'react'
import {Button, Modal, Form, Input,message} from 'antd';

const CollectionCreateForm = Form.create({name: 'form_in_modal'})(
    // eslint-disable-next-line
    class extends React.Component {
        render() {
            const {
                visible,loading, onCancel, onCreate, form
            } = this.props;
            const {getFieldDecorator} = form;
            return (
                <Modal
                    visible={visible}
                    title="创建新结点"
                    footer={[
                        <Button key="back" onClick={onCancel}>取消</Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={onCreate}>
                            确认创建
                        </Button>,
                    ]}
                >
                    <Form layout="vertical">
                        <Form.Item label="名称">
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: '请输入新增结点的名称！'}],
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <Form.Item label="描述（可选）">
                            {getFieldDecorator('note')(<Input type="textarea"/>)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    }
);

export class AddStandardNode extends Component {
    state = {
        visible: false,
    };

    showModal = () => {
        this.setState({visible: true});
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({loading: true});
            console.log('Received values of form: ', values);
            console.log(this.props.id);
            this.props.addNode(this.props.id, values.name, values.note, (response) => {
                if(response==='success')
                    message.info('success');
                else
                    message.error(response);
                form.resetFields();
                this.setState({loading: false, visible: false});
            });
        });
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render() {
        return (
            <div>
                <a href="#" onClick={this.showModal}>插入孩子结点</a>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    loading={this.state.loading}
                />
            </div>
        );
    }
}
