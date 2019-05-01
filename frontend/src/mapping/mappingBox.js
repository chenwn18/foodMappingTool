import React, {Component} from 'react';
import {StandardFoodDetail} from "./standardFoodDetail";
import {CandidateFoodSearchBar} from "./candidateFoodSearchBar";
import {CandidateAttributeSearchBar} from "./candidateAttributeSearchBar";

export class MappingBox extends Component {
    state = {
        standardFoodID: '',
        standardAttributeIDs: [],
        generalFoodID: ''
    };

    setStandardFoodID(id) {
        console.log(id);
        this.setState(state => state.standardFoodID = id);
    }

    render() {
        return (
            <div>
                <div>
                    <div>
                        <h3>选择标准食品</h3>
                        <CandidateFoodSearchBar setStandardFoodID={this.setStandardFoodID.bind(this)}
                                                candidateIDs={['食品2', '食品3', '食品4']}/>
                    </div>
                    <div>
                        <StandardFoodDetail id={this.state.standardFoodID}/>
                    </div>
                </div>
                <div>
                    <h3>选择标准属性</h3>
                    <CandidateAttributeSearchBar/>
                </div>
            </div>
        )
    }

}