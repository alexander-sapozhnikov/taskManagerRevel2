import {informAboutErrorWithWorkData} from "./helpFunction.js";

class DataUsualAction{
    remove(item, URL){
        fetch(URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)})
        .then(reason => reason)
        .then(reason => {if(!reason.ok)informAboutErrorWithWorkData(reason)})
        .catch(reason => informAboutErrorWithWorkData(reason));
    }


    save(item, URL){
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)})
        .then(response => response.json())
        .then(response => {if (response.error) informAboutErrorWithWorkData(response)})
        .catch(reason => informAboutErrorWithWorkData(reason));
    }


    update(item, URL){
        fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)})
        .then(response => response.json())
        .then(response => {if (response.error) informAboutErrorWithWorkData(response)})
        .catch(reason => informAboutErrorWithWorkData(reason));
    }
}

let dataUsualAction = new DataUsualAction()

export {dataUsualAction}