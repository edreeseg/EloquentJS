// The sum of a range

const range = (start, end, step) => {
    results = [];
        for (let i = start; step > 0 ? i <= end : i >= end; i+=step)
            results.push(i);
    return results;
}

const sum = (arr) => arr.reduce((a, b) => a + b);

// Reversing an array

const reverseArray = (arr) => {
    newArr = [];
    arr.forEach(x => newArr.unshift(x));
    return newArr;
}

const reverseArrayInPlace = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        arr.splice(i, 0, arr[arr.length-1]);
        arr.splice(arr.length-1, 1);
    } return arr;
}

// A List

const arrayToList = (arr) => {
    let list = {};
    list.value = arr.splice(0, 1)[0];
    arr.length === 0 ? list.rest = null : list.rest = arrayToList(arr);
    return list;
}

const listToArray = (list) => {  // I think this is messy, would like to come back and refactor.
    listArr = [];
    const pushValues = (list) => {
        listArr.push(list.value);
        return list.rest === null ? listArr : pushValues(list.rest);
    }
    return pushValues(list);
}

const prepend = (list, element) => {
    if (list.rest == null) {
        list.rest = {value: list.value, rest: null};
        list.value = element;
    } else {
        list.rest = prepend(list.rest, list.value);
        list.value = element;
    } return list.rest;
}

const nth = (list, element) => {
    let counter = 0;
    function helper(list, element) {
        if (counter === element)
            return list.value;
        else {
            counter++
            return list.rest == null ? undefined : helper(list.rest, element);
        }
    } return helper(list, element);
}

// Deep Comparison

const deepEqual = (obj1, obj2) => {
    for (let key in obj1) {
        if (typeof obj1[key] === "object" && typeof obj2[key] === "object")
            return deepEqual(obj1[key], obj2[key]);
        else if (obj1[key] !== obj2[key])
            return false;
    } return true;
}