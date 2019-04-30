import generalFoods from '../testData/general_foods';
import standardFoods from '../testData/standard_foods';
import standardAttributes from '../testData/standard_attributes';
import {arrayToDict} from "./toolFunction";

export function getStandardFoods() {
    return arrayToDict(standardFoods)
}

export function getStandardAttributes() {
    return arrayToDict(standardAttributes)
}

export function getFieldFoods(field) {
    if (!(field in generalFoods))
        return {};
    return arrayToDict(generalFoods[field]);
}
// export function getStandardFoodTree() {
//     let idNodeDict = getStandardFoods();
//     let rootID = findRootNodeID(idNodeDict);
//     return makeTree(rootID, idNodeDict);
// }
//
//
// export function getFieldFoodTree(field) {
//     let idNodeDict = getFieldFoods(field);
//     let rootID = findRootNodeID(idNodeDict);
//     return makeTree(rootID, idNodeDict);
// }
//
// export function getStandardAttributeTree() {
//     let idNodeDict = getStandardAttributes();
//     let rootID = findRootNodeID(idNodeDict);
//     return makeTree(rootID, idNodeDict);
// }