import os; os.chdir(os.path.join(__file__, *(['..'] * 3)))
from backend.lib.config import CONFIG
from backend.lib.tool_function_lib import load_json_file, save_json_file
from shutil import copy2
import time

from backend.lib.basic_class import GeneralFoodNode, StandardFoodNode, StandardAttribute
from backend.lib.candidate_class import CANDIDATE


# 定义装饰器，实现版本管理功能
def version_control(func):
    def wrapper(self, *args, **kwargs):
        # record operation history into nodes as: 
        # [{
        #   'time': timestamp, 'called': the_name_of_function_called, 
        #   'data': input_arguments_and_other_information,
        #   'description': formatted string based on 'data' above, one can comment or delete it, if not needed
        # }, {.}, ...]
        func_name = func.__name__.split('_')
        args_dict = dict(zip(func.__code__.co_varnames[1: 1 + len(args)], args)); args_dict.update(kwargs)
        try:
            if len(func_name) > 2: 
                if func_name[1] == 'standard': 
                    if func_name[2] == 'food':
                        if func_name[0] == 'modify':
                            food_id = args_dict['food_id']
                            old_name, old_note = self.standard_foods[food_id].name, self.standard_foods[food_id].note
                            old_synonyms = self.standard_foods[food_id].synonyms
                            
                            result = func(self, *args, **kwargs)
                            
                            if not hasattr(self.standard_foods[food_id], 'history'): self.standard_foods[food_id].history = []
                            self.standard_foods[food_id].history.append({'time': round(time.time()), 'called': func.__name__})
                            history = self.standard_foods[food_id].history[-1]
                            
                            if func_name[3] == 'info':
                                history.update({
                                    'data': {'id': food_id, 'old_name': old_name, 'old_note': old_note, 'new_name': args_dict['new_name'], 'new_note': args_dict['new_note']},
                                    'description': '%s - modify standard food info [%s] (id:[%s], name:[%s], note:[%s])' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()), self.standard_foods[food_id].name, food_id, ' -> '.join([old_name, args_dict['new_name']]), ' -> '.join([old_note, args_dict['new_note']])), 
                                })
                            elif func_name[3] == 'synonyms':
                                history.update({
                                    'data': {'id': food_id, 'old_synonyms': old_synonyms, 'new_synonyms': args_dict['new_synonyms']},
                                    'description': '%s - modify standard food synonyms [%s] (id:[%s], synonyms: %s)' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()), self.standard_foods[food_id].name, food_id, ' -> '.join([repr(old_synonyms), repr(args_dict['new_synonyms'])])), 
                                })
                        else:
                            result = func(self, *args, **kwargs)
                            
                            if not hasattr(self.standard_foods[result], 'history'): self.standard_foods[result].history = []
                            self.standard_foods[result].history.append({'time': round(time.time()), 'called': func.__name__})
                            history = self.standard_foods[result].history[-1]
                            
                            if func_name[0] == 'insert':
                                history.update({
                                    'data': {'id': result, 'parent_id': args_dict['parent_id'], 'name': args_dict['name'], 'note': args_dict.get('note', '')},
                                    'description': '%s - insert standard food [%s] (id:[%s], parend_id:[%s])' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()), args_dict['name'], result, args_dict['parent_id']), 
                                })
                            elif func_name[0] == 'delete':
                                history.update({
                                    'data': {'id': result},
                                    'description': '%s - delete standard food [%s] (id:[%s])' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()), self.standard_foods[result].name, result), 
                                })
                    elif func_name[2] == 'attribute':
                        result = func(self, *args, **kwargs)
                        
                        if not hasattr(self.standard_attributes[result], 'history'): self.standard_attributes[result].history = []
                        self.standard_attributes[result].history.append({'time': round(time.time()), 'called': func.__name__})
                        history = self.standard_attributes[result].history[-1]
                        
                        if func_name[0] == 'insert':
                            history.update({
                                'data': {'id': result, 'parent_id': args_dict['parent_id'], 'name': args_dict['name'], 'note': args_dict.get('note', '')},
                                'description': '%s - insert standard attribute [%s] (id:[%s], parent_id:[%s])' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()), args_dict['name'], result, args_dict['parent_id']), 
                            })
                        elif func_name[0] == 'delete':
                            history.update({
                                'data': {'id': result},
                                'description': '%s - delete standard attribute [%s] (id:[%s])' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()), self.standard_attributes[result].name, result), 
                            })
                elif func_name[1] == 'general':
                    result = func(self, *args, **kwargs)
                    
                    field = args_dict['field']
                    if not hasattr(self.general_foods[field][result], 'history'): self.general_foods[field][result].history = []
                    self.general_foods[field][result].history.append({'time': round(time.time()), 'called': func.__name__})
                    history = self.general_foods[field][result].history[-1]
                    
                    if func_name[0] == 'insert':
                        history.update({
                            'data': {'id': result, 'parent_id': args_dict['parent_id'], 'name': args_dict['name'], 'note': args_dict.get('note', ''), 'ontology': args_dict.get('ontology', [])},
                            'description': '%s - insert general food [%s] (id:[%s], parent_id:[%s])' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()), args_dict['name'], result, args_dict['parent_id']), 
                        })
            elif len(func_name) == 2:
                if func_name[1] == 'mapping':
                    current_timestamp = round(time.time())
                    
                    if func_name[0] == 'add':
                        result = func(self, *args, **kwargs)
                        field, general_id, standard_id, attribute_ids = args_dict['field'], args_dict['general_id'], args_dict['standard_id'], args_dict['attribute_ids']
                        
                        if not hasattr(self.standard_foods[standard_id], 'history'): self.standard_foods[standard_id].history = []
                        self.standard_foods[standard_id].history.append({'time': current_timestamp, 'called': func.__name__})
                        standard_history = self.standard_foods[standard_id].history[-1]
                
                        if not hasattr(self.general_foods[field][general_id], 'history'): self.general_foods[field][general_id].history = []
                        self.general_foods[field][general_id].history.append({'time': current_timestamp, 'called': func.__name__})
                        general_history = self.general_foods[field][general_id].history[-1]
                        
                        standard_history.update({
                            'data': {'id': standard_id, 'field': field, 'general_id': general_id, 'attribute_id': attribute_ids},
                            'description': '%s - add mapping between [%s] (id:[%s]) and [%s]:[%s] (id:[%s]) with attribute [%s] (id:[%s])' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()), self.standard_foods[standard_id].name, standard_id, field, self.general_foods[field][general_id].name, general_id, ', '.join([self.standard_attributes[ai].name for ai in attribute_ids]), ', '.join(attribute_ids))
                        })
                        general_history.update({
                            'data': {'id': general_id, 'standard_id': standard_id, 'attribute_id': attribute_ids},
                            'description': '%s - add mapping between [%s] (id:[%s]) and standard food [%s] (id:[%s]) with attribute [%s] (id:[%s])' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()), self.general_foods[field][general_id].name, general_id, self.standard_foods[standard_id].name, standard_id, ', '.join([self.standard_attributes[ai].name for ai in attribute_ids]), ', '.join(attribute_ids))
                        })
                    
                    elif func_name[0] == 'delete':
                        field, general_id = args_dict['field'], args_dict['general_id']
                        standard_ids = self.general_foods[field][general_id].ontology
            
                        if not hasattr(self.general_foods[field][general_id], 'history'): self.general_foods[field][general_id].history = []
                        self.general_foods[field][general_id].history.append({'time': current_timestamp, 'called': func.__name__})
                        general_history = self.general_foods[field][general_id].history[-1] 
                        general_history.update({
                            'data': {'id': general_id, 'standard_ids': standard_ids},
                            'description': '%s - delete mapping between [%s] (id:[%s]) and standard food [%s] (id:[%s])' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()), self.general_foods[field][general_id].name, general_id, ', '.join([self.standard_foods[standard_id].name for standard_id in standard_ids]), ', '.join(standard_ids))
                        })
                        
                        for standard_id in standard_ids:
                            if not hasattr(self.standard_foods[standard_id], 'history'): self.standard_foods[standard_id].history = []
                            self.standard_foods[standard_id].history.append({'time': current_timestamp, 'called': func.__name__})
                            standard_history = self.standard_foods[standard_id].history[-1]
                            standard_history.update({
                                'data': {'id': standard_id, 'field': field, 'general_id': general_id},
                                'description': '%s - delete mapping between [%s] (id:[%s]) and [%s]:[%s] (id:[%s])' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()), self.standard_foods[standard_id].name, standard_id, field, self.general_foods[field][general_id].name, general_id)
                            })
                        
                        result = func(self, *args, **kwargs)
            else:
                result = func(self, *args, **kwargs)
        except Exception as e:
            return str(e)
        # 没有出现异常，为有效操作
        self.operation_num += 1
        if CONFIG.record_history and self.operation_num >= self.save_version_interval:
            self.save_as_history()
            self.operation_num = 0
        else:
            self.save_version()
        return result

    return wrapper


class AllData(object):
    def __init__(self):
        # key: id, value: a StandardFoodNode object
        self.standard_foods = self.load_standard_foods()
        # key: id, value: a StandardAttribute object
        self.standard_attributes = self.load_standard_attributes()
        # key: field, value: dict {key :id, value: a GeneralFoodNode object}
        self.general_foods = self.load_general_foods()
        # 每10次有效操作存储一次历史版本
        self.operation_num = 0
        self.save_version_interval = 10

    @staticmethod
    def load_standard_foods():
        json_data = load_json_file(CONFIG.standard_foods_file)
        result = dict()
        for food in json_data:
            obj = StandardFoodNode('', '', '')
            obj.from_json(food)
            result[obj.id] = obj
        return result

    @staticmethod
    def load_general_foods():
        json_data = load_json_file(CONFIG.general_foods_file)
        result = dict()
        for field, nodes in json_data.items():
            result[field] = dict()
            for food in nodes:
                obj = GeneralFoodNode('', '', '', '')
                obj.from_json(food)
                result[field][obj.id] = obj
        return result

    @staticmethod
    def load_standard_attributes():
        json_data = load_json_file(CONFIG.standard_attributes_file)
        result = dict()
        for attribute in json_data:
            obj = StandardAttribute('', '', '')
            obj.from_json(attribute)
            result[obj.id] = obj
        return result

    def save_version(self):
        # 每次操作后保存修改
        save_json_file(CONFIG.standard_foods_file, [x.to_json() for x in self.standard_foods.values()])
        save_json_file(CONFIG.standard_attributes_file, [x.to_json() for x in self.standard_attributes.values()])
        general_json_data = {}
        for field, nodes in self.general_foods.items():
            general_json_data[field] = [x.to_json() for x in nodes.values()]
        save_json_file(CONFIG.general_foods_file, general_json_data)

    def save_as_history(self):
        # 保存当前状态，并存为历史版本
        self.save_version()
        now_time = time.strftime('%Y%m%d-%H_%M_%S', time.localtime())
        folder_to_save = os.path.join(CONFIG.history_folder, now_time)
        os.makedirs(folder_to_save, exist_ok=True)
        copy2(CONFIG.standard_foods_file, folder_to_save)
        copy2(CONFIG.standard_attributes_file, folder_to_save)
        copy2(CONFIG.general_foods_file, folder_to_save)
        copy2(CONFIG.id_file, folder_to_save)

        # for example

    @version_control  # 对数据造成修改的操作添加此装饰器以便进行版本管理
    def insert_standard_food(self, parent_id: str, name: str, note: str = ''):
        """
        新增统一标准中的食品结点
        :param parent_id: 其父节点id
        :param name: 食品名称
        :param note: 备注
        :return: 新增结点id if 操作成功 else 错误信息
        """
        if parent_id not in self.standard_foods:
            # this should not happen without bug
            raise Exception('新增标准食品失败！父节点%s不存在！' % parent_id)
        parent_node: StandardFoodNode = self.standard_foods[parent_id]
        if parent_node.use_flag is False:
            raise Exception('新增标准食品失败！父节点已被移除，建议刷新页面以查看最新版本')
        # 从全局CONFIG中申请新id
        new_id = CONFIG.generate_new_id(field='食品')
        # 创建新结点
        new_node = StandardFoodNode(node_id=new_id, name=name, parent_id=parent_id, note=note)
        # 父结点的children中加入它的id
        parent_node.add_child(new_id)
        # 加入到standard_foods集合中
        self.standard_foods[new_id] = new_node
        return new_id

    @version_control
    def insert_general_food(self, field: str, parent_id: str, name: str, note: str = '', ontology: list = None):
        """
        新增其他领域的食品结点
        :param field: 领域名称
        :param parent_id: 父节点id
        :param name: 食品名称
        :param note: 备注
        :param ontology: 本体id的list
        :return: 新增结点id if 操作成功 else 错误信息
        """
        if field not in self.general_foods:
            raise Exception('新增食品结点失败，领域%s不存在' % field)
        field_foods = self.general_foods[field]
        if parent_id not in field_foods:
            raise Exception('新增食品结点失败，父节点%s不存在' % parent_id)
        parent_node: GeneralFoodNode = field_foods[parent_id]
        if parent_node.use_flag is False:
            raise Exception('新增标准食品失败！父节点已被移除，建议刷新页面以查看最新版本')
        # 从全局CONFIG中申请新id
        new_id = CONFIG.generate_new_id(field=field)
        # 创建新结点
        new_node = GeneralFoodNode(node_id=new_id, name=name, parent_id=parent_id, field=field, ontology=ontology,
                                   note=note)
        # 父结点的children中加入它的id
        parent_node.add_child(new_id)
        # 加入到general_foods集合中
        self.general_foods[field][new_id] = new_node
        return new_id

    @version_control
    def delete_standard_food(self, food_id: str):
        """
        删除统一标准中的食品结点
        :param food_id: 待删除结点的id
        :return: food_id if 操作成功 else 错误信息的字符串
        """
        if food_id not in self.standard_foods:
            raise Exception('删除标准食品失败！该结点%s不存在' % food_id)
        food_node: StandardFoodNode = self.standard_foods[food_id]
        if food_node.use_flag is False:
            raise Exception('删除标准食品失败！该食品已被移除，建议刷新页面以查看最新版本')
        # 从父结点的children中移除当前结点
        parent_node: StandardFoodNode = self.standard_foods[food_node.parent_id]
        parent_node.remove_child(food_id)

        # 递归设置当前结点及其孩子结点的use_flag，并移除相关映射关系
        def deprecate_food_and_its_children(root_id: str):
            root: StandardFoodNode = self.standard_foods[root_id]
            root.stop_in_use()  # 设置use_flag为False
            # 将该food_id从对应的各领域结点的ontology字段中移除
            for field, entity in root.entity.items():
                for general_id in entity.keys():
                    general_node: GeneralFoodNode = self.general_foods[field][general_id]
                    general_node.ontology.remove(root_id)
            # 深度优先遍历，移除所有孩子结点
            for child_id in root.children:
                deprecate_food_and_its_children(child_id)

        deprecate_food_and_its_children(food_id)
        return food_id

    @version_control
    def modify_standard_food_info(self, food_id: str, new_name: str, new_note: str):
        """
        修改指定id的标准结点的基本信息信息, name和note
        :param food_id:
        :param new_name:
        :param new_note:
        :return:
        """
        if food_id not in self.standard_foods:
            raise Exception('修改标准食品信息失败！该结点%s不存在' % food_id)
        food_node: StandardFoodNode = self.standard_foods[food_id]
        if food_node.use_flag is False:
            raise Exception('修改标准食品信息失败！该食品已被移除，建议刷新页面以查看最新版本')
        food_node.modify_info(new_name, new_note)
        return 'success'

    @version_control
    def modify_standard_food_synonyms(self, food_id: str, new_synonyms: dict):
        """
        修改指定id的标准结点的同义词信息
        :param new_synonyms:
        :return:
        """
        if food_id not in self.standard_foods:
            raise Exception('修改标准食品同义词失败！该结点%s不存在' % food_id)
        food_node: StandardFoodNode = self.standard_foods[food_id]
        if food_node.use_flag is False:
            raise Exception('修改标准食品同义词失败！该食品已被移除，建议刷新页面以查看最新版本')
        food_node.modify_synonyms(new_synonyms)
        return 'success'

    @version_control
    def insert_standard_attribute(self, parent_id: str, name: str, note: str = ''):
        """
        插入新的标准属性
        :param parent_id:
        :param name:
        :param note:
        :return:
        """
        # tips:  用CONFIG.generate_new_id(field='标准属性') 来自动生成新id，参考insert_standard_food
        if parent_id not in self.standard_attributes:
            # this should not happen without bug
            raise '新增标准属性失败！父节点%s不存在！' % parent_id
        parent_node: StandardAttribute = self.standard_attributes[parent_id]
        if parent_node.use_flag is False:
            return '新增标准属性失败！父节点已被移除，建议刷新页面以查看最新版本'
        # 从全局CONFIG中申请新id
        new_id = CONFIG.generate_new_id(field='属性')
        # 创建新结点
        new_node = StandardAttribute(attribute_id=new_id, name=name, parent_id=parent_id, note=note)
        # 父结点的children中加入它的id
        parent_node.add_child(new_id)
        # 加入到standard_attributes集合中
        self.standard_attributes[new_id] = new_node
        return new_id

    @version_control
    def delete_standard_attribute(self, attribute_id: str):
        """
        删除指定的标准属性，参考delete_standard_food, 注意一定要弄清self.standard_foods的entity字段长什么样
        :param attribute_id:
        :return:
        """
        if attribute_id not in self.standard_attributes:
            raise Exception('删除标准属性失败！该结点%s不存在' % attribute_id)
        attribute_node: StandardAttribute = self.standard_attributes[attribute_id]
        if attribute_node.use_flag is False:
            raise Exception('删除标准属性失败！该属性已被移除，建议刷新页面以查看最新版本')
        # 从父结点的children中移除当前结点
        parent_node: StandardAttribute = self.standard_attributes[attribute_node.parent_id]
        parent_node.remove_child(attribute_id)

        def get_attribute_and_its_children_id(root_id):
            def get_children_id(root_id):
                id_list_ = []
                for child_id in self.standard_attributes[root_id].children:
                    id_list_ += get_children_id(child_id)
                return self.standard_attributes[root_id].children + id_list_
            return [root_id] + get_children_id(root_id)

        id_list = get_attribute_and_its_children_id(attribute_id)

        def remove_attributes_in_mapping(root_id, id_list):
            root = self.standard_foods[root_id]
            for field, entity in root.entity.items():
                for general_id, attribute_ids in entity.items():
                    for ai in attribute_ids:
                        if ai in id_list:
                            attribute_ids.remove(ai)
            for child_id in self.standard_foods[root_id].children:
                remove_attributes_in_mapping(child_id, id_list)
        
        remove_attributes_in_mapping('食品0', id_list)
        
        # 递归设置当前结点及其孩子结点的use_flag，并移除相关映射关系
        def deprecate_attribute_and_its_children(root_id: str):
            root: StandardAttribute = self.standard_attributes[root_id]
            root.stop_in_use()  # 设置use_flag为False
            # 深度优先遍历，移除所有孩子结点
            for child_id in root.children:
                deprecate_attribute_and_its_children(child_id)

        deprecate_attribute_and_its_children(attribute_id)
        return attribute_id

    @version_control
    def add_mapping(self, field: str, general_id: str, standard_id: str, attribute_ids: list):
        """
        为某个领域的结点与统一标准的结点增加映射关系
        :param field: 领域名称
        :param general_id: 领域结点id
        :param standard_id: 统一标准id
        :param attribute_ids: 附加属性的id
        :return: 'success' if 操作成功 else 错误信息
        """
        if field not in self.general_foods:
            raise Exception('新增映射关系失败！领域名称“%s”错误!' % field)
        general_node: GeneralFoodNode = self.general_foods[field].get(general_id, None)
        if general_node is None:
            raise Exception('新增映射关系失败！领域“%s”中没有id为%s的结点！' % (field, general_node))
        standard_node: StandardFoodNode = self.standard_foods.get(standard_id, None)
        if standard_node is None:
            raise Exception('新增映射关系失败！统一标准中没有id为%s的结点' % standard_id)
        if general_node.use_flag is False or standard_node.use_flag is False:
            raise Exception('新增映射关系失败！映射结点已被删除，建议刷新页面以查看最新版本')
        if standard_id not in general_node.ontology:
            general_node.add_ontology(standard_id)
        standard_node.add_entity(field=field, general_id=general_id, attribute_ids=attribute_ids)
        return 'success'

    @version_control
    def delete_mapping(self, field: str, general_id: str):
        """
        删除某个结点到统一标准的映射
        :param field:
        :param general_id:
        :return:
        """
        if field not in self.general_foods:
            raise Exception('删除映射关系失败！领域名称“%s”错误!' % field)
        general_node: GeneralFoodNode = self.general_foods[field].get(general_id, None)
        if general_node is None:
            raise Exception('删除映射关系失败！领域“%s”中没有id为%s的结点！' % (field, general_node))
        if general_node.use_flag is False:
            raise Exception('删除映射关系失败！映射结点已被删除，建议刷新页面以查看最新版本')
        for i in range(len(general_node.ontology) - 1, -1, -1):
            standard_node: StandardFoodNode = self.standard_foods.get(general_node.ontology[i], None)
            general_node.remove_ontology(general_node.ontology[i])
            if standard_node is None:
                raise Exception('删除映射关系失败！统一标准中没有id为%s的结点' % general_node.ontology[i])
            standard_node.entity[field].pop(general_id)
        return 'success'

    def recoding(self):
        """
        根据当前的总体标准，按照以往的规则，为self.standard_nodes和self.standard_attributes设置编码
        :return:
        """
        def sequence_code(standards, code_prefix):
            code, child_num = {}, {}
            for id_, item in standards.items():
                if not child_num.get(id_):
                    child_num[id_] = 0
                if item.name == 'root':
                    assert len([c for c in item.children if standards[c].use_flag]) <= 26
                    code[id_] = code_prefix
                    for child in item.children:
                        if standards[child].use_flag:
                            child_num[id_] += 1
                            code[child] = code[id_] + chr(64 + child_num[id_])
                else:
                    if code_prefix == 'F0':
                        assert len([c for c in item.children if standards[c].use_flag]) <= 99
                        for child in item.children:
                            if standards[child].use_flag:
                                child_num[id_] += 1
                                code[child] = code[id_] + '%d%d' % (child_num[id_] // 10, child_num[id_] % 10)
                    else:
                        
                        for child in item.children:
                            if standards[child].use_flag:
                                child_num[id_] += 1
                                code[child] = code[id_] + ('' if standards[item.parent_id].name == 'root' else '.') + '%d%d' % (child_num[id_] // 10, child_num[id_] % 10) 
            return code
        
        for id_, item in sequence_code(self.standard_foods, 'F0').items():
            if self.standard_foods[id_].use_flag: self.standard_foods[id_].code = item
        
        for id_, item in sequence_code(self.standard_attributes, 'A').items():
            if self.standard_attributes[id_].use_flag: self.standard_attributes[id_].code = item

    
    def conflict_detect(self, field: str):
        """
        查找指定领域中映射存在冲突的结点
        :param field: 指定的领域
        :return: dict of {node_id:{conflict_field: conflict_id}}
        """
        pass

    def getCandidateIds(self, field: str, general_id: str):
        """
        提供候选标准ID的list
        :param field: 领域名称
        :param general_id: 普通领域ID
        :return: 标准ID list
        """
        results = dict()
        candidateIds = []
        candidate = CANDIDATE(self.general_foods, self.standard_foods)
        # 三系统映射给出的ID  first important
        # -------------------------------------------------------------------------
        idByGeneral = candidate.getSysID(field, general_id)
        if len(idByGeneral) != 0:
            candidateIds.extend(idByGeneral)

        # 名称相似度和拓扑结构匹配
        idBySameName = candidate.getBySimilarName(field, general_id)
        if len(idBySameName) != 0:
            for id in idBySameName:
                if id[0] not in candidateIds:
                    candidateIds.extend(id)
        results['candidate_id'] = candidateIds
        # -------------------------------------------------------------------------

        candidateAttriIds = candidate.getAttriIds(field, general_id)
        results['candidate_attribute'] = candidateAttriIds
        return candidateIds

all_data = AllData()  # singleton


def test():
    # you can write your own test codes here for test purpose
    # test for insert_standard_foods
    # root_id = CONFIG.generate_new_id('食品')
    # all_data.standard_foods[root_id] = StandardFoodNode(root_id, 'root', '')
    # all_data.insert_standard_food('食品0', 'food1')
    # all_data.insert_standard_food('食品0', 'food2')
    # all_data.insert_standard_food('食品1', 'food3')
    # all_data.insert_standard_food('食品1', 'food4')
    # all_data.insert_standard_food('食品3', 'food5')
    # all_data.insert_standard_food('食品0', 'food6')
    # all_data.insert_standard_food('食品0', 'food7')
    # all_data.insert_standard_food('食品1', 'food8')
    # all_data.insert_standard_food('食品1', 'food9')
    # all_data.insert_standard_food('食品3', 'food10')
    
    new_food_id = all_data.insert_standard_food('食品3', 'test_food')
    all_data.delete_standard_food(new_food_id)
    new_food_id = all_data.insert_standard_food('食品3', 'test_food')
    all_data.modify_standard_food_info(new_food_id, 'test_food', 'test_note')
    all_data.modify_standard_food_synonyms(new_food_id, {'test_synonym': 'test_source'})
    
    new_attribute_id = all_data.insert_standard_attribute('属性3', 'test_attribute')
    all_data.add_mapping('化学', '化学3', '食品3', ['属性3'])
    all_data.delete_mapping('化学', '化学3')
    all_data.add_mapping('化学', '化学3', '食品3', [new_attribute_id])
    
    all_data.delete_standard_attribute('属性3')
    all_data.delete_standard_food('食品3')
    
    all_data.recoding()

    # 化学657--鲤鱼  化学470--麦片
    # ids = all_data.getCandidateIds('化学', '化学657')


if __name__ == '__main__':
    test()