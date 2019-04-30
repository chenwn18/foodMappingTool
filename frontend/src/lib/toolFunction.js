function deepCopy(node) {
    // ToDo: replace it by a deep copy function suitable for any type of object or array
    return JSON.parse(JSON.stringify(node));
}

function makeTree(rootID, idNodeDict) {
    let tree = deepCopy(idNodeDict[rootID]);
    let childrenIDs = deepCopy(tree.children);
    tree.children = [];
    for (let i = 0; i < childrenIDs.length; i++) {
        tree.children[i] = makeTree(childrenIDs[i], idNodeDict);
    }
    return tree;
}

export function arrayToDict(arr, ID = 'id', Path = 'path') {
    let resultDict = {};
    arr.forEach(d => resultDict[d[ID]] = d);
    let rootID = findRootNodeID(resultDict);
    for (let id in resultDict) {
        resultDict[id][Path] = getNodePath(id, resultDict, rootID);
    }
    return resultDict;
}

export function findRootNodeID(nodesDict, parentID = 'parent_id') {
    let id = Object.keys(nodesDict)[0];
    while (nodesDict[id][parentID] in nodesDict)
        id = nodesDict[id][parentID];
    while (nodesDict[id].children.length === 1)
        id = nodesDict[id].children[0];
    return id;
}

export function getNodePath(currentID, nodesDict, root_id = null, ParentID = 'parent_id', Name = 'name') {
    if (!(currentID in nodesDict))
        return '';
    if (!root_id)
        root_id = findRootNodeID(nodesDict);
    let path = [];
    let id = currentID;
    while (id !== root_id) {
        if (!(id in nodesDict))
            break;
        path.push(nodesDict[id][Name]);
        id = nodesDict[id][ParentID];
    }
    path.reverse();
    return path.join('→');
}