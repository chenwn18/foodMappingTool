import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Layout, Spin, Menu, Affix} from "antd";
import {StandardModifyView} from "../standardModify/main";
import {MappingView} from "../mapping/main";
import {PrivateRoute} from "../login/privateRoute";
import {isLoggedIn} from "../login/auth";
import {LoginView} from "../login/loginView";
import './main.css'

const {Header, Content, Footer} = Layout;

class MainPanel extends Component {
    render() {
        if (!this.props.loaded)
            return (<Spin size='large'/>);
        const userName = isLoggedIn() ? localStorage.username : '请先登录';
        return (
            <Router>
                <Layout className="layout">
                    <Affix offsetTop={0}>
                        <Header>

                            <div className="welcome">欢迎您，{userName}！</div>
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                defaultSelectedKeys={['login']}
                                style={{lineHeight: '64px'}}
                            >
                                <Menu.Item key="login"><Link to='/'>登录</Link></Menu.Item>
                                <Menu.Item key="mapping"><Link to='/mapping'>食品映射</Link></Menu.Item>
                                <Menu.Item key="standardModify"><Link to='/standardModify'>标准修订</Link></Menu.Item>
                            </Menu>

                        </Header>
                    </Affix>
                    <Content style={{padding: '0 50px', marginTop: '100px'}}>
                        <PrivateRoute exact isloggedin={isLoggedIn()} path='/mapping' component={MappingView}/>
                        <PrivateRoute exact isloggedin={isLoggedIn()} path='/standardModify'
                                      component={StandardModifyView}/>
                        <Route exact path='/' component={LoginView}/>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                    </Footer>
                </Layout>
            </Router>
        );
    }
}

export class App extends Component {
    state = {
        loaded: false
    };
    changeLoadedFlag = (loaded) => this.setState({loaded: loaded});

    render() {
        return (
            <MainPanel loaded={this.state.loaded}/>
        )
    }
}