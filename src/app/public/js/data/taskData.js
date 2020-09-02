import {dataUsualAction} from "../supporting/dataUsualAction.js";

const URL = "/task/"

class TaskData{

    getByListTask(listTask){
        return fetch(URL + "listTask/" + listTask.idListTask);
    }

    getByEmployee(employee){
        return fetch(URL + "employee/" + employee.idEmployee);
    }

    save(task, idListTask){
        task.listTask = {
            idListTask : +idListTask
        }
        task.employee = {
            idEmployee : +task.idEmployee
        }
        task.status = {
            idStatus : +task.idStatus
        }
        task.urgency = {
            idUrgency : +task.idUrgency
        }
        task.theoreticalTimeWork = +task.theoreticalTimeWork
        dataUsualAction.save(task, URL)
    }

    remove(task){
        dataUsualAction.remove(task, URL)
    }

    update(task, idTask){
        if(!idTask) {
            task.idTask = +idTask
        }
        task.employee = {
            idEmployee : +task.idEmployee
        }
        task.status = {
            idStatus : +task.idStatus
        }
        task.urgency = {
            idUrgency : +task.idUrgency
        }
        task.theoreticalTimeWork = +task.theoreticalTimeWork
        task.realTimeWork = +task.realTimeWork
        dataUsualAction.update(task, URL)
    }
}

let taskData = new TaskData()

export {taskData}
