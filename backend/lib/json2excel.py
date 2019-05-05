import os
import re
import json
import pandas as pd
from backend.lib.tool_function_lib import load_json_file
from backend.lib.config import CONFIG

standard_foods_jsonFile = os.path.join(CONFIG.save_folder, 'standard_foods.json')
standard_attributes_jsonFile = os.path.join(CONFIG.save_folder, 'standard_attributes.json')
general_foods_jsonFile = os.path.join(CONFIG.save_folder, 'general_foods.json')

food_code2id_file = os.path.join(CONFIG.json_tree_folder, 'standardFoodCode2SystemID.json')
attribute_code2id_file = os.path.join(CONFIG.json_tree_folder, 'standardAttributeCode2SystemID.json')

excel_standardFoods_saveFile = os.path.join(CONFIG.save_folder, 'standard_foods.xlsx')
excel_standardAttributes_saveFile = os.path.join(CONFIG.save_folder, 'standard_attributes.xlsx')
excel_generalFoods_saveFile = os.path.join(CONFIG.save_folder, 'general_foods.xlsx')


def id2code(code2id_filePath):
    code2id_data = load_json_file(code2id_filePath)
    return dict(zip(code2id_data.values(), code2id_data.keys()))


def excel_standard_foods():
    def synonyms_num_list(original_list):
        synonyms_num = []
        for i in original_list:
            synonyms_num.append(len(i['synonyms']))
        return synonyms_num, max(synonyms_num)

    standard_foods = load_json_file(standard_foods_jsonFile)
    food_id2code = id2code(food_code2id_file)

    synonyms_num, max_num = synonyms_num_list(standard_foods[2:])
    col_name = ['序号', '一级分类名称', '编码', '同义词数量', '同义词']
    for i in range(max_num - 1):
        col_name.append('')
    excelData = pd.DataFrame(columns=col_name)

    for food_id, node in enumerate(standard_foods[2:], start=1):
        row = [food_id, node['name'], food_id2code.get(node['id']), synonyms_num[food_id - 1]]
        for i in node['synonyms'].keys():
            row.append(i)
        na_len = max_num + 4 - len(row)
        for i in range(na_len):
            row.append('')
        excelData.loc[food_id - 1] = row
    excelData.to_excel(excel_standardFoods_saveFile, index=None)


def excel_standard_attributes():
    standard_attributes = load_json_file(standard_attributes_jsonFile)
    attribute_id2code = id2code(attribute_code2id_file)
    col_name = ['序号', '编码', '属性描述名称', '大类编码', '上级编码']
    excelData = pd.DataFrame(columns=col_name)
    for attribute_id, node in enumerate(standard_attributes[2:], start=1):
        row = [attribute_id, attribute_id2code[node['id']], node['name'],
               attribute_id2code[node['id']][1],
               attribute_id2code[node['parent_id']]]
        excelData.loc[attribute_id - 1] = row
    excelData.to_excel(excel_standardAttributes_saveFile, index=None)


def excel_general_foods():
    def find_node(id, node_list):
        for node in node_list:
            if node['id'] == id:
                return node

    def find_path(id, node_list, path_list):
        node = find_node(id, node_list)
        if node['name'] != 'root':
            find_path(node['parent_id'], node_list, path_list)
        path_list.append(node['name'])
        return path_list

    general_foods = load_json_file(general_foods_jsonFile)
    header = ['主键', '父ID', '名称', '食品编码', '分类+属性码', '路径', 'ROWID']
    writer=pd.ExcelWriter(excel_generalFoods_saveFile)
    for field, sheet in CONFIG.general_filed_sheetname.items():
        excelData = pd.DataFrame(columns=header)
        field_id2code = id2code(os.path.join(CONFIG.json_tree_folder, field+'Code2SystemID.json'))
        field_list = general_foods[field]
        for i, node in enumerate(field_list[2:]):
            path = find_path(node['id'], field_list, [])
            row = [re.sub('\D', '', node['id']), re.sub('\D', '', node['parent_id']), node['name'],
                   field_id2code.get(node['id']), node['id'], '_'.join(path[1:]), node['id'] ]
            excelData.loc[i] = row
        excelData.to_excel(writer, sheet_name=sheet, index=None)
    writer.save()


def export_from_json():
    excel_standard_foods()
    excel_standard_attributes()
    excel_general_foods()

if __name__ == '__main__':
    export_from_json()
