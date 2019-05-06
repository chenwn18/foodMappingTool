import React, {Component} from 'react';
import {Entity, getAttributeNode, getFoodNode, getSynonymNames, ID, Name, Path} from "../lib/getData";
import {Divider, Table} from "antd";
import {DeleteMappingModal} from "./deleteMappingModal";
import {OperationHistoryModal} from "./operationHistoryModal";

export class StandardFoodDetail extends Component {
    modifyMapping = (generalID, field, attributeIDs) => {
        this.props.setField(field);
        this.props.setStandardFoodID(this.props.id);
        this.props.setGeneralFoodID(generalID);
        this.props.setStandardAttributeIDs(attributeIDs);
        this.props.setMappingBoxHighlight(true);
        setTimeout(() => {
            this.props.setMappingBoxHighlight(false)
        }, 2000);
    };
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
                    path: <a href="#" onClick={() => this.props.setGeneralFoodID(foodNode[ID])}>{foodNode[Path]}</a>
                })
            }
        }
        const columns = [{
            title: '领域',
            dataIndex: 'field',
            key: 'field',
            render: text => <a href="javascript:">{text}</a>
        }, {
            title: '实体名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '属性',
            dataIndex: 'attribute',
            key: 'attribute',
            render: text => <a href="javascript:">{text}</a>
        }, {
            title: '实体路径',
            dataIndex: 'path',
            key: 'path'
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <DeleteMappingModal generalID={record.key} field={record.field} standardID={item[ID]}/>
                    <Divider type='vertical'/>
                    <a href="#" onClick={() => this.modifyMapping(record.key, record.field, record.attributeIDs)}>修改</a>
                </span>
            )
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