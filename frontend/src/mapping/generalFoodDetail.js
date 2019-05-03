import React, {Component} from 'react';
import {ID, Name, Path, getFoodNode, getOntologyNodes, getAttributeNodes} from "../lib/getData";
import {Divider, Popover, Table} from "antd";
import {deleteMapping} from "../lib/postData";

export class GeneralFoodDetail extends Component {
    getAttributes = (ontologyID) => {
        let attributeNodes = getAttributeNodes(this.props.id, ontologyID, this.props.field);
        return attributeNodes.map(attNode => attNode[Name]);
    };
    //todo: 对话框提示确认，返回修改结果，update显示
    deleteMapping = (ontologyID) => {
        deleteMapping(this.props.id, ontologyID, this.props.field);

    };
    ontologyTable = (item) => {
        const ontologyNodes = getOntologyNodes(item[ID], this.props.field);
        const ontologyData = ontologyNodes.map(node => {
            return {
                key: node[ID],
                name: node[Name],
                attribute: this.getAttributes(node[ID]).join('|'),
                path: node[Path]
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
                    <a href="#" onClick={() => this.deleteMapping(record.key)}>删除</a>
                    <Divider type='vertical'/>
                    <a href="#">修改</a>
                    <Divider type='vertical'/>
                    <a href="#">新增</a>
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
                {this.ontologyTable(item)}
            </div>
        )
    }
}