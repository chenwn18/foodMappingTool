import reqwest from 'reqwest'

function postData(url, data, callback) {
    reqwest({
        url: url + '?time=' + (new Date().getTime()),
        method: 'post',
        data: data,
        success: callback
    })
}

export function addMapping(field, generalID, standardID, standardAttributeIDs, callback) {
    postData('/addMapping', {
        field: field,
        generalID: generalID,
        standardID: standardID,
        standardAttributeIDs: standardAttributeIDs
    }, callback);
}

export function deleteMapping(generalID, standardID, field, callback) {
    postData('/deleteMapping/' + field + '/' + generalID + '/' + standardID, [], callback);
}

export function deleteStandardFood(standardID) {
    console.log('deleteStandardFood: ' + standardID);
}

export function deleteStandardAttribute(attributeID) {
    console.log('deleteStandardAttribute: ' + attributeID);
}

export function addStandardFood(parentID, name, note) {
    console.log('addStandardFood: ' + parentID + ' ' + name + ' ' + (note || ''));
}

export function addStandardAttribute(parentID, name, note) {
    console.log('addStandardAttribute: ' + parentID + ' ' + name + ' ' + (note || ''));
}

export function changeFoodParent(id, newParentID, field = null) {
    console.log('changeParent: ' + id + ' ' + newParentID);
}

export function changeAttributeParent(id, newParentID) {
    console.log('changeAttributeParent: ' + id + ' ' + newParentID);
}

export function modifyAttributeInfo(id, name, note, callback) {
    const url = '/modifyStandardAttributeInfo/' + id + '/' + name + '/' + note;
    postData(url, [], callback);
}

export function modifyStandardFoodInfo(id, name, note, callback) {
    const url = '/modifyStandardFoodInfo/' + id + '/' + name + '/' + note;
    postData(url, [], callback);
}