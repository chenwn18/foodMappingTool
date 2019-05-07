import React, {Component} from 'react';
import {Entity, getAttributeNode, getFoodNode, getSynonymNames, ID, Name, Path} from "../lib/getData";
import {Table} from "antd";
import {OperationHistoryModal} from "../mapping/operationHistoryModal";

export class StandardFoodDetail extends Component {
    entityTable = (item) => {
        const entityDict = item[Entity];
        let entityData = [];
        for (let field in entityDict) {
            for (let entityID in entityDict[field]) {
                let foodNode = getFoodNode(entityID, field);
                let attributeIDs = entityDict[field][entityID];
                entityData.push({
                    key: entityID,
                    field: field,
                    name: foodNode[Name],
                    attribute: attributeIDs.map(attributeID => getAttributeNode(attributeID)[Name]).join('|'),
                    attributeIDs: attributeIDs,
                    path: foodNode[Path]
                })
            }
        }
        const columns = [{
            title: '领域',
            dataIndex: 'field',
            key: 'field',
            render: text => <a href="#">{text}</a>
        }, {
            title: '实体名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '属性',
            dataIndex: 'attribute',
            key: 'attribute',
            render: text => <a href="#">{text}</a>
        }, {
            title: '实体路径',
            dataIndex: 'path',
            key: 'path'
        }];
        return <Table columns={columns} dataSource={entityData}/>
    };

    render() {
        if (this.props.id === '')
            return (<div/>);
        const item = getFoodNode(this.props.id);
        const searchValue = this.props.searchValue;
        let synonyms = getSynonymNames(item[ID]).join('|');
        const index = synonyms.indexOf(searchValue);
        const beforeStr = synonyms.substr(0, index);
        const afterStr = synonyms.substr(index + searchValue.length);
        synonyms = index > -1 ? (
            <span>
                {beforeStr}
                <span className="nameSearched">{searchValue}</span>
                {afterStr}
            </span>
        ) : <span>{synonyms || '无'}</span>;
        return (
            <div>
                <p>别称：{synonyms}</p>
                <p>路径：{item[Path]}</p>
                <OperationHistoryModal id={this.props.id}/>
                {this.entityTable(item)}
            </div>
        )
    }
}

StandardFoodDetail.defaultProps = {
    searchValue: '',
    id: ''
};