import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
// import {MappingView} from "./mapping/main";
import {StandardModifyView} from "./standardModify/main";

// ReactDOM.render(<MappingView/>, document.getElementById('root'));
ReactDOM.render(<StandardModifyView/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
