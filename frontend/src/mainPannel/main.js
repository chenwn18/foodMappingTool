import React, {Component} from 'react';
import {Spin} from "antd";
import {StandardModifyView} from "../standardModify/main";
import {loadedFlag} from "../lib/getData";

class MainPanel extends Component {
    state = {
        loaded: false
    };

    render() {
        if (!this.state.loaded)
            return (<Spin size='large'/>);
        return (
            <div>
                <StandardModifyView/>
            </div>
        );
    }
}

export class App extends Component {
    updateLoadedFlag = (loaded) => {
        this.setState({loadedFlag: loaded})
    };

    render() {
        return (
            <MainPanel loaded={this.state.loadedFlag}/>
        )
    }
}