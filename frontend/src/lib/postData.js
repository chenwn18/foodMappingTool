import reqwest from 'reqwest'
import {updateGeneralFoods, updateStandardAttributes, updateStandardFoods} from "./getData";

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
    }, (resp) => {
        updateGeneralFoods(resp);
        updateStandardFoods(resp);
        callback(resp);
    });
}

export function deleteMapping(generalID, standardID, field, callback) {
    const url = '/deleteMapping/' + field + '/' + generalID + '/' + standardID;
    postData(url, [], (resp) => {
        updateGeneralFoods(resp);
        updateStandardFoods(resp);
        callback(resp);
    });
}

export function deleteStandardFood(standardID, callback) {
    const url = 'deleteStandardFood/' + standardID;
    postData(url, [], (resp) => {
        updateGeneralFoods(resp);
        updateStandardFoods(resp);
        callback(resp);
    });
}

export function deleteStandardAttribute(attributeID, callback) {
    const url = 'deleteStandardAttribute/' + attributeID;
    postData(url, [], (resp) => {
        updateStandardAttributes(resp);
        updateStandardFoods(resp);
        callback(resp);
    });
}

export function addStandardFood(parentID, name, note, callback) {
    const url = 'addStandardFood/' + parentID + '/' + name + '/' + note;
    postData(url, [], (resp) => {
        updateStandardFoods(resp);
        callback(resp);
    });
}

export function addStandardAttribute(parentID, name, note, callback) {
    const url = 'addStandardAttribute/' + parentID + '/' + name + '/' + note;
    postData(url, [], (resp) => {
        updateStandardAttributes(resp);
        callback(resp);
    });
}

export function changeStandardFoodParent(id, newParentID, callback) {
    const url = '/changeStandardFoodParent/' + id + '/' + newParentID;
    postData(url, [], (resp) => {
        updateStandardFoods(resp);
        callback(resp);
    });
}

export function changeAttributeParent(id, newParentID, callback) {
    const url = '/changeAttributeParent/' + id + '/' + newParentID;
    postData(url, [], (resp) => {
        updateStandardAttributes(resp);
        callback(resp);
    });
}

export function modifyAttributeInfo(id, name, note, callback) {
    const url = '/modifyStandardAttributeInfo/' + id + '/' + name + '/' + note;
    postData(url, [], (resp) => {
        updateStandardAttributes(resp);
        callback(resp);
    });
}

export function modifyStandardFoodInfo(id, name, note, callback) {
    const url = '/modifyStandardFoodInfo/' + id + '/' + name + '/' + note;
    postData(url, [], (resp) => {
        updateStandardFoods(resp);
        callback(resp);
    });
}

// export function login(userName, redirectURL) {
//     const url = '/login';
//     let formData = new FormData();
//     formData.append(userName, userName);
//     fetch(url, {method: 'POST', body: formData}).then(res => res.json()).then(data => {
//         localStorage.setItem('access_token', data.access_token);
//         localStorage.setItem('username', data.username);
//         if (localStorage.getItem("access_token") !== null && localStorage.getItem("access_token") !== "undefined") {
//             window.location.replace(redirectURL);
//         } else {
//             alert(data.error);
//         }
//     }).catch(err => console.log(err));
// }