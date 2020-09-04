import {dataUsualAction} from "../supporting/dataUsualAction.js";

const URL = "/listTask/"

class ListTaskData{
    getByProject(idProject){
        // let xhr = new XMLHttpRequest();
        // xhr.open("GET", URL + "project/" + idProject)
        // xhr.send()
        // xhr.onload = function() {
        //     if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
        //         alert(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
        //     } else { // если всё прошло гладко, выводим результат
        //         alert(`Готово, получили ${xhr.response.length} байт`); // response -- это ответ сервера
        //     }
        // };
        //
        return fetch(URL + "project/" + idProject)
    }

    save(taskList, idProject){
        taskList.project = {}
        taskList.project.idProject = +idProject
        dataUsualAction.save(taskList, URL)
    }

    remove(taskList){
        dataUsualAction.remove(taskList, URL)
    }

    update(taskList, idListTask){
        taskList.idListTask = +idListTask
        dataUsualAction.update(taskList, URL)
    }
}

let listTaskData = new ListTaskData()

export {listTaskData}
