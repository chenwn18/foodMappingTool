import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {StandardFoodTree} from "./mapping/standardFoodTree";


ReactDOM.render(<StandardFoodTree/>, document.getElementById('root'));
// ReactDOM.render(<SearchForest/>, document.getElementById('root'));
// ReactDOM.render(<SearchTree/>, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
