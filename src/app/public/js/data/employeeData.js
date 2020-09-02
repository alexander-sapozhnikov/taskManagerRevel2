import {dataUsualAction} from "../supporting/dataUsualAction.js";

export function Employee(idEmployee, firstName, middleName, lastName){
    this.idEmployee = idEmployee;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
}

const URL = "/employee/"

class EmployeeData{

    getAll(){
        return fetch(URL);
    }

    getById(idEmployee){
        return fetch(URL + idEmployee);
    }

    getByProjectTeam(projectTeam){
        return fetch(URL + "projectTeam/" + projectTeam.idProjectTeam);
    }

    remove(item){
        dataUsualAction.remove(item, URL)
    }

    save(item){
        dataUsualAction.save(item, URL)
    }

    update(item, idEmployee){
        item.idEmployee = idEmployee
        dataUsualAction.update(item, URL)
    }
}

let employeeData = new EmployeeData()

export {employeeData}
