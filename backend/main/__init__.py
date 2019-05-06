from flask import render_template
from flask import Blueprint, request
from backend.lib.all_data import all_data
import json
from backend.lib.config import CONFIG

main = Blueprint('main', __name__, template_folder='templates', static_folder='static', static_url_path="/static")


def read_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf8') as f:
            res = f.read()
    except Exception as e:
        print(e)
        res = '{}'
    return res


@main.route('/getStandardFoods', methods=['GET'])
def get_standard_foods():
    return read_file(CONFIG.standard_foods_file)


@main.route('/getStandardAttributes', methods=['GET'])
def get_standard_attributes():
    return read_file(CONFIG.standard_attributes_file)


@main.route('/getGeneralFoods', methods=['GET'])
def get_general_foods():
    return read_file(CONFIG.general_foods_file)


@main.route('/addMapping', methods=["POST"])
def add_mapping():
    field = request.form['field']
    general_id = request.form['generalID']
    standard_id = request.form['standardID']
    attribute_ids = request.form.getlist('standardAttributeIDs[]')
    response = all_data.add_mapping(field, general_id, standard_id, attribute_ids)
    print(response)
    return response


@main.route('/deleteMapping/<field>/<general_id>/<standard_id>', methods=['POST'])
def delete_mapping(field, general_id, standard_id):
    if standard_id == '':
        standard_id = None
    return all_data.delete_mapping(field, general_id, standard_id)


@main.route('/modifyStandardFoodInfo/<id>/<name>/<note>', methods=['POST'])
def modify_standard_food_info(id, name, note):
    return all_data.modify_standard_food_info(id, name, note)


@main.route('/modifyStandardAttributeInfo/<attribute_id>/<name>/<note>', methods=['POST'])
def modify_standard_attribute_info(attribute_id, name, note):
    return all_data.modify_standard_attribute_info(attribute_id, name, note)


@main.route('/deleteStandardFood/<food_id>', methods=['POST'])
def delete_standard_food(food_id):
    res = all_data.delete_standard_food(food_id)
    if res == food_id:
        return 'success'
    else:
        return res


@main.route('/deleteStandardAttribute/<attribute_id>', methods=['POST'])
def delete_standard_attribute(attribute_id):
    res = all_data.delete_standard_attribute(attribute_id)
    if res == attribute_id:
        return 'success'
    else:
        return res


@main.route('/addStandardFood/<parent_id>/<name>/<note>', methods=['POST'])
def add_standard_food(parent_id, name, note):
    res: str = all_data.insert_standard_food(parent_id, name, note)
    if res.startswith('食品'):
        return 'success'
    else:
        return res


@main.route('/addStandardAttribute/<parent_id>/<name>/<note>', methods=['POST'])
def add_standard_attribute(parent_id, name, note):
    res: str = all_data.insert_standard_attribute(parent_id, name, note)
    print(res)
    if res.startswith('属性'):
        return 'success'
    else:
        return res


@main.route('/changeStandardFoodParent/<food_id>/<new_parent_id>', methods=['POST'])
def change_standard_food_parent(food_id, new_parent_id):
    return all_data.modify_standard_food_parent(food_id, new_parent_id)


@main.route('/changeAttributeParent/<attribute_id>/<new_parent_id>', methods=['POST'])
def change_attribute_parent(attribute_id, new_parent_id):
    return all_data.modify_standard_attribute_parent(attribute_id, new_parent_id)


@main.route('/getCandidate/<field>/<general_id>', methods=['GET'])
def get_candidate(field, general_id):
    candidate_foods, candidate_attributes = all_data.getCandidateIds(field, general_id)
    return json.dumps({'candidateFoods': candidate_foods, 'candidateAttributes': candidate_attributes})


@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def index(path):
    return render_template('index.html')
