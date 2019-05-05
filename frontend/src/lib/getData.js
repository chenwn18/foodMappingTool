import generalFoods from '../testData/general_foods';
import standardFoods from '../testData/standard_foods';
import standardAttributes from '../testData/standard_attributes';
import {arrayToDict, findRootNodeID, makeTree} from "./toolFunction";
import reqwest from "reqwest";

const standardFoodsDict = getStandardFoods();
const standardAttributesDict = getStandardAttributes();
const generalFoodsDict = getGeneralFoods();

export const ID = 'id';
export const ParentID = 'parent_id';
export const Name = 'name';
export const Ontology = 'ontology';
export const Synonyms = 'synonyms';
export const Path = 'path';
export const Field = 'field';
export const Entity = 'entity';

//ToDo: check parameters!
export function getParentFoodID(nodeID, field = null) {
    if (!field)
        return standardFoodsDict[nodeID][ParentID];
    else
        return generalFoodsDict[field][nodeID][ParentID];
}

export function getFoodNode(nodeID, field = null) {
    if (!field)
        return standardFoodsDict[nodeID];
    else
        return generalFoodsDict[field][nodeID];
}

export function getFoodChildrenIDs(nodeID, field = null) {
    let IDs = [nodeID];
    let res = [];
    while (IDs.length > 0) {
        let id = IDs.pop();
        res.push(id);
        if (!field)
            IDs.push(...standardFoodsDict[id].children);
        else
            IDs.push(...generalFoodsDict[field][id].children);
    }
    return res;
}

export function getAttributeChildrenIDs(attributeID) {
    let IDs = [attributeID];
    let res = [];
    while (IDs.length > 0) {
        let id = IDs.pop();
        res.push(id);
        IDs.push(...standardAttributesDict[id].children);
    }
    return res;
}

export function getParentAttributeID(nodeID) {
    return standardAttributesDict[nodeID][ParentID];
}

export function getAttributeNode(nodeID) {
    return standardAttributesDict[nodeID]
}

export function getRootFoodID(field) {
    if (!field)
        return findRootNodeID(standardFoodsDict);
    else
        return findRootNodeID(generalFoodsDict[field]);
}

export function getRootAttributeID(field) {
    return findRootNodeID(standardAttributesDict);
}

export function getSynonymNames(nodeID) {
    return Object.keys(standardFoodsDict[nodeID][Synonyms]);
}

export function getAttributeNodes(generalID, standardID, field) {
    return getFoodNode(standardID)[Entity][field][generalID].map(attID => getAttributeNode(attID));
}

export function getOntologyNodes(nodeID, field) {
    return generalFoodsDict[field][nodeID][Ontology].map(ontologyID => getFoodNode(ontologyID));
}

export function goThroughFoodNodes(callback, field = null) {
    if (!field)
        return Object.values(standardFoodsDict).map(callback);
    else
        return Object.values(generalFoodsDict[field]).map(callback);
}

export function goThroughAttributeNodes(callback) {
    return Object.values(standardAttributesDict).map(callback);
}

function getStandardFoods() {
    return arrayToDict(standardFoods);
}

function getStandardAttributes() {
    return arrayToDict(standardAttributes);
}


function getGeneralFoods() {
    let generals = {};
    for (let field in generalFoods)
        generals[field] = arrayToDict(generalFoods[field]);
    return generals;
}

// export function getStandardFoodTree() {
//     let idNodeDict = getStandardFoods();
//     let rootID = findRootNodeID(idNodeDict);
//     return makeTree(rootID, idNodeDict);
// }
//
//
export function getGeneralFoodTree() {
    let idNodeDict = getGeneralFoods();
    let result = {};
    for (let field in idNodeDict) {
        let rootID = findRootNodeID(idNodeDict[field]);
        result[field] = makeTree(rootID, idNodeDict[field]);
    }
    return result;
}

export function getStandardAttributeTree() {
    let idNodeDict = getStandardAttributes();
    let rootID = findRootNodeID(idNodeDict);
    return makeTree(rootID, idNodeDict);
}

export function getCandidate(generalID, field, callback) {
    const url = '/getCandidate/' + field + '/' + generalID;
    getData(url, (res) => {
        callback(res.candidateFoods, res.candidateAttributes);
    })
}

export function getCandidateFoodIDs(generalID, field) {
    return ['食品2', '食品3', '食品4'];
}

export function getCandidateAttributeIDs(generalID, field) {
    return ['属性2', '属性3', '属性4'];
}

function getData(url, callback) {
    reqwest({
        url: url + '?time=' + (new Date().getTime()),
        type: 'json',
        method: 'get',
        contentType: 'application/json',
        success: (res) => {
            callback(res);
        },
    });
}