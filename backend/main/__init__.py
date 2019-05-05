from flask import render_template
from flask import Blueprint, request
from backend.lib.all_data import all_data
import json

main = Blueprint('main', __name__, template_folder='templates', static_folder='static', static_url_path="/static")


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


@main.route('/modifyStandardAttributeInfo/<id>/<name>/<note>', methods=['POST'])
def modify_standard_attribute_info(id, name, note):
    return all_data.modify_standard_attribute_info(id, name, note)


@main.route('/getCandidate/<field>/<general_id>', methods=['GET'])
def get_candidate(field, general_id):
    candidate_foods, candidate_attributes = all_data.getCandidateIds(field, general_id)
    return json.dumps({'candidateFoods': candidate_foods, 'candidateAttributes': candidate_attributes})


@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def index(path):
    return render_template('index.html')
