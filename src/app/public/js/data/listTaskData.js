import {dataUsualAction} from "../supporting/dataUsualAction.js";

const URL = "/listTask/"

class ListTaskData{
    getByProject(idProject){ 
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
