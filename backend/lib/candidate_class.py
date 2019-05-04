import Levenshtein
from backend.lib.config import CONFIG
from backend.lib.tool_function_lib import load_json_file
from backend.lib.basic_class import GeneralFoodNode

class CANDIDATE(object):
    def __init__(self, general_foods, standard_foods):
        self.allSysNodes = self.load_allSys_nodes(self)
        self.reflectionIDS = self.load_reflections()
        self.allCode2Sysid = self.load_all_code2sysid()
        self.general_foods = general_foods
        self.standard_foods = standard_foods
        self.field_node = None

    @staticmethod
    def getIdCode(self, dict):
        resultDict = {}
        for child in dict['children']:
            obj = GeneralFoodNode(child['id'], child['name'], child['parent_id'], '', child['code'], '', '')
            resultDict[child['id']] = obj
        for child in dict['children']:
            dict = self.getIdCode(self, child)
            resultDict.update(dict)
        return resultDict

    @staticmethod
    def load_allSys_nodes(self):
        allSysNodes = {}
        json_data_chemis = load_json_file(CONFIG.chemisNodes)
        dict_chemis = self.getIdCode(self, json_data_chemis)
        allSysNodes['化学'] = dict_chemis
        json_data_break = load_json_file(CONFIG.breakNodes)
        dict_break = self.getIdCode(self, json_data_break)
        allSysNodes['暴发'] = dict_break
        json_data_micro = load_json_file(CONFIG.microNodes)
        dict_micro = self.getIdCode(self, json_data_micro)
        allSysNodes['微生物'] = dict_micro
        return allSysNodes

    @staticmethod
    def load_reflections():
        return load_json_file(CONFIG.between_general_systems)

    @staticmethod
    def load_all_code2sysid():
        allSysNodes = {}
        json_data_chemis = load_json_file(CONFIG.chemisCode2SysID)
        allSysNodes['化学'] = json_data_chemis
        json_data_break = load_json_file(CONFIG.breakCode2SysID)
        allSysNodes['暴发'] = json_data_break
        json_data_micro = load_json_file(CONFIG.microCode2SysID)
        allSysNodes['微生物'] = json_data_micro
        return allSysNodes

    def getSysIDs(self):
        generalSysIDS = []
        for key, value in self.reflectionIDS.items():
            ids = value.split(',')
            if int(ids[0]) == -1:
                chemisSysID = None
            else:
                chemisSysID = self.allCode2Sysid.get('化学').get(self.allSysNodes.get('化学').get(int(ids[0])).code)
            if int(ids[1]) == -1:
                breakSysID = None
            else:
                breakSysID = self.allCode2Sysid.get('暴发').get(self.allSysNodes.get('暴发').get(int(ids[1])).code)
            if int(ids[2]) == -1:
                microSysID = None
            else:
                microSysID = self.allCode2Sysid.get('微生物').get(self.allSysNodes.get('微生物').get(int(ids[2])).code)
            generalSysIDS.append([chemisSysID, breakSysID, microSysID])
        return generalSysIDS

    def getSysID(self, field: str, general_id: str):
        results = []
        generalSysIDS = self.getSysIDs()
        for ids in generalSysIDS:
            if field == '化学' and ids[0] == general_id:
                if ids[1] == None:
                    microSysID = self.general_foods['微生物'][ids[2]].ontology
                    results = microSysID
                elif ids[2] == None:
                    breakSysID = self.general_foods['暴发'][ids[1]].ontology
                    results = breakSysID
                else:
                    breakSysID = self.general_foods['暴发'][ids[1]].ontology
                    microSysID = self.general_foods['微生物'][ids[2]].ontology
                    if breakSysID == microSysID and len(breakSysID) != 0:
                        results = breakSysID
                    if breakSysID == None:
                        results = microSysID
                    if microSysID == None:
                        results = breakSysID
                break
            if field == '暴发' and ids[1] == general_id:
                if ids[0] == None:
                    microSysID = self.general_foods['微生物'][ids[2]].ontology
                    results = microSysID
                elif ids[2] == None:
                    chemisSysID = self.general_foods['化学'][ids[0]].ontology
                    results = chemisSysID
                else:
                    chemisSysID = self.general_foods['化学'][ids[0]].ontology
                    microSysID = self.general_foods['微生物'][ids[2]].ontology
                    if chemisSysID == microSysID and len(chemisSysID) != 0:
                        results = chemisSysID
                    if chemisSysID == None:
                        results = microSysID
                    if microSysID == None:
                        results = chemisSysID
                break
            if field == '微生物' and ids[2] == general_id:
                if ids[0] == None:
                    breakSysID = self.general_foods['暴发'][ids[1]].ontology
                    results = breakSysID
                elif ids[1] == None:
                    chemisSysID = self.general_foods['化学'][ids[0]].ontology
                    results = chemisSysID
                else:
                    chemisSysID = self.general_foods['化学'][ids[0]].ontology
                    breakSysID = self.general_foods['暴发'][ids[1]].ontology
                    if chemisSysID == breakSysID and len(chemisSysID) != 0:
                        results = chemisSysID
                    if chemisSysID == None:
                        results = breakSysID
                    if breakSysID == None:
                        results = chemisSysID
                break
        return results

    def getParentANDBrothers(self, field):
        related_nodes = []
        field_nodes_dict = self.allSysNodes.get(field)
        field_code2sysid = self.allCode2Sysid.get(field)
        parent_id = self.field_node.parent_id
        for node in field_nodes_dict.values():
            if parent_id == node.id:
                related_nodes.append(self.general_foods[field][field_code2sysid.get(node.code)])
            if (parent_id == node.parent_id) and (node.id != self.field_node.id):
                related_nodes.append(self.general_foods[field][field_code2sysid.get(node.code)])
        return related_nodes

    def getdistance(self, field, snode, rnode):
        dis = 0
        # 查找最小公共父节点
        snode_parent_list = []
        snode_parent_list.append(snode.id)
        node = self.general_foods[field][snode.id]
        while node.parent_id != "":
            snode_parent_list.append(node.parent_id)
            node = self.general_foods[field][node.parent_id]
        rnode_parent_list = []
        rnode_parent_list.append(rnode.id)
        node = self.general_foods[field][rnode.id]
        while node.parent_id != "":
            rnode_parent_list.append(node.parent_id)
            node = self.general_foods[field][node.parent_id]
        i = len(snode_parent_list) - 1
        j = len(rnode_parent_list) - 1
        while (i >= 0) and (j >= 0):
            if snode_parent_list[i] != rnode_parent_list[j]:
                dis = dis + i + j + 2
                break
            i = i - 1
            j = j - 1
        if i == -1:
            dis = j + 1
        if j == -1:
            dis = i + 1
        return dis

    def getIDSByTopology(self, field, similary_node_inorder):
        results = []
        distances = []
        related_nodes = self.getParentANDBrothers(field)
        for snode in similary_node_inorder.values():
            total_distance = 0
            dis_num = len(related_nodes)
            for rnode in related_nodes:
                if snode.id != rnode.id:
                    total_distance = total_distance + self.getdistance(field, snode, rnode)
                else:
                    dis_num = dis_num - 1
            distances.append(total_distance/dis_num)

        temp_distances = distances.copy()
        while len(temp_distances) != 0:
            field_id = list(similary_node_inorder.keys())[distances.index(min(temp_distances))]
            standard_id = self.general_foods['化学'][field_id].ontology
            if (len(standard_id) != 0) and (standard_id not in results):
                results.append(standard_id)
            temp_distances.pop(temp_distances.index(min(temp_distances)))
        return results

    def getBySimilarName(self, field:str, general_id:str):
        field_c2sid_dict = self.allCode2Sysid.get(field)
        sysCode = list(field_c2sid_dict.keys())[list(field_c2sid_dict.values()).index(general_id)]
        field_nodes_dict = self.allSysNodes.get(field)
        sysNodeName = ''
        for node in field_nodes_dict.values():
            if sysCode == node.code:
                sysNodeName = node.name
                self.field_node = node
                break
        field_standard_dict = self.general_foods[field]
        similarities = {}
        for node in field_standard_dict.values():
            sysNodeName = sysNodeName.replace('其他','')
            node.name = node.name.replace('其他','')
            if sysNodeName == node.name:
                similarities[node.id] = 0
            elif (sysNodeName in node.name) or (node.name in sysNodeName):
                similarities[node.id] = 1
            else:
                similarNum = Levenshtein.distance(sysNodeName, node.name)
                if len(sysNodeName) == len(node.name):
                    if similarNum < max(len(sysNodeName), len(node.name))/2:
                        similarities[node.id] = similarNum
                elif similarNum <= max(len(sysNodeName), len(node.name))/2:
                    similarities[node.id] = similarNum
                else:
                    continue

        # 节点相似度排序
        similary_node_inorder = {}
        for key, value in similarities.items():
            min = 100
            min_k = -1
            for k, v in similarities.items():
                if min > int(v) and (k not in similary_node_inorder.keys()):
                    min = int(v)
                    min_k = k
            similary_node_inorder[min_k] = self.general_foods[field][min_k]

        ids = self.getIDSByTopology(field, similary_node_inorder)
        return ids

    def getParentAttri(self, field, general_id):
        attributs = []
        # 找到所有父节点
        field_nodes_dict = self.allSysNodes.get(field)
        field_code2sysid = self.allCode2Sysid.get(field)
        parent_node = None
        for node in field_nodes_dict.values():
            if node.id == self.field_node.parent_id:
                parent_node = node
                break
        if parent_node == None:
            return attributs
        parent_nodes = []
        node = self.general_foods[field][field_code2sysid.get(parent_node.code)]
        parent_nodes.append(node)
        while node.parent_id != "":
            node = self.general_foods[field][node.parent_id]
            parent_nodes.append(node)
        for pn in parent_nodes:
            if len(pn.ontology) != 0:
                attr = self.standard_foods[pn.ontology[0]].entity[field][pn.id]
                if len(attr) != 0:
                    attributs.extend(attr)
        return attributs

    def getEqualNode(self, field, genreral_id):
        attributes = []
        generalSysIDS = self.getSysIDs()
        reflection = None
        for gsId in generalSysIDS:
            if genreral_id in gsId:
                reflection = gsId
                break
        if reflection == None:
            return attributes
        if field == '化学':
            if reflection[1] != None:
                break_node = self.general_foods['暴发'][reflection[1]]
                if len(break_node.ontology) != 0:
                    attr = self.standard_foods[break_node.ontology[0]].entity['暴发'][break_node.id]
                    attributes.extend(attr)
            if reflection[2] != None:
                micro_node = self.general_foods['微生物'][reflection[2]]
                if len(micro_node.ontology) !=0:
                    attr = self.standard_foods[micro_node.ontology[0]].entity['微生物'][micro_node.id]
                    attributes.extend(attr)
        if field == '暴发':
            if reflection[0] != None:
                chemis_node = self.general_foods['化学'][reflection[0]]
                if len(chemis_node.ontology) != 0:
                    attr = self.standard_foods[chemis_node.ontology[0]].entity['化学'][chemis_node.id]
                    attributes.extend(attr)
            if reflection[2] != None:
                micro_node = self.general_foods['微生物'][reflection[2]]
                if len(micro_node.ontology) != 0:
                    attr = self.standard_foods[micro_node.ontology[0]].entity['微生物'][micro_node.id]
                    attributes.extend(attr)
        if field == '微生物':
            if reflection[0] != None:
                chemis_node = self.general_foods['化学'][reflection[0]]
                if len(chemis_node.ontology) != 0:
                    attr = self.standard_foods[chemis_node.ontology[0]].entity['化学'][chemis_node.id]
                    attributes.extend(attr)
            if reflection[1] != None:
                break_node = self.general_foods['暴发'][reflection[1]]
                if len(break_node.ontology) != 0:
                    attr = self.standard_foods[break_node.ontology[0]].entity['暴发'][break_node.id]
                    attributes.extend(attr)
        return attributes

    def getAttriIds(self, field, general_id):
        attriIds = []
        # 所有祖先的属性
        attriIds.extend(self.getParentAttri(field, general_id))
        # 三系统等价节点的属性
        for attr in self.getEqualNode(field, general_id):
            if attr not in attriIds:
                attriIds.extend(self.getEqualNode(field, general_id))
        return attriIds