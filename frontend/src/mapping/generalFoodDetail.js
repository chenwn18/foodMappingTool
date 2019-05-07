import React, {Component} from 'react';
import {ID, Name, Path, getFoodNode, getOntologyNodes, getAttributeNodes, Field} from "../lib/getData";
import {Divider, Table} from "antd";
import {DeleteMappingModal} from "./deleteMappingModal";
import {OperationHistoryModal} from "./operationHistoryModal";

export class GeneralFoodDetail extends Component {

    modifyMapping = (standardID, attributeIDs) => {
        this.props.setStandardFoodID(standardID);
        this.props.setGeneralFoodID(this.props.id);
        this.props.setStandardAttributeIDs(attributeIDs);
        this.props.setMappingBoxHighlight(true);
        setTimeout(() => {
            this.props.setMappingBoxHighlight(false)
        }, 2000);
    };
    ontologyTable = () => {
        const ontologyNodes = getOntologyNodes(this.props.id, this.props.field);
        const ontologyData = ontologyNodes.map(node => {
            const attributeNodes = getAttributeNodes(this.props.id, node[ID], this.props.field);
            return {
                key: node[ID],
                name: node[Name],
                attribute: attributeNodes.map(node => node[Name]).join('|'),
                attributeIDs: attributeNodes.map(node => node[ID]),
                path: <a href="#" onClick={() => this.props.setStandardFoodID(node[ID])}>{node[Path]}</a>
            }
        });
        const columns = [{
            title: '本体名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '属性',
            dataIndex: 'attribute',
            key: 'attribute',
            render: text => <a href="javascript:">{text}</a>
        }, {
            title: '本体路径',
            dataIndex: 'path',
            key: 'path'
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <DeleteMappingModal generalID={this.props.id} field={this.props.field} standardID={record.key}/>
                    <Divider type='vertical'/>
                    <a href="#" onClick={() => this.modifyMapping(record.key, record.attributeIDs)}>修改</a>
                </span>
            )
        }];
        return <Table columns={columns} dataSource={ontologyData}/>
    };

    render() {
        const item = getFoodNode(this.props.id, this.props.field);
        return (
            <div>
                <p>路径：{item[Path]}</p>
                <OperationHistoryModal id={this.props.id} field={this.props.field}/>
                {this.ontologyTable()}
            </div>
        )
    }
}