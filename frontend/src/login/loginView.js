import React, {Component} from 'react';
import {Button, Dropdown, Menu, Icon, Input, Row, Col} from "antd";
import './loginView.css'

export class LoginView extends Component {
    state = {
        disabled: true
    };
    handleMenuClick = (e) => {
        localStorage.setItem('username', this.state.name);
        if (e.key === 'mapping')
            window.location.replace('/mapping');
        else
            window.location.replace('/standardModify');
    };
    onChange = (e) => {
        const name = e.target.value;
        if (name === '')
            this.setState({disabled: true});
        else {
            this.setState({
                disabled: false,
                name: name
            })
        }

    };

    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="mapping">食品映射</Menu.Item>
                <Menu.Item key="standardModify">标准修订</Menu.Item>
            </Menu>
        );

        return (
            <div id='login'>
                <Row type='flex' justify='center' align='middle' gutter={48}>>
                    <Col span={6}>
                        <h1>请输入姓名并选择任务类别</h1>
                    </Col>
                    <Col span={3}>
                        <Input placeholder='请输入姓名' onChange={this.onChange}/>
                        <Dropdown overlay={menu} trigger='click'>
                            <Button type='default' disabled={this.state.disabled}>
                                选择任务<Icon type='down'/>
                            </Button>
                        </Dropdown>
                    </Col>
                </Row>
            </div>
        )
    }
}