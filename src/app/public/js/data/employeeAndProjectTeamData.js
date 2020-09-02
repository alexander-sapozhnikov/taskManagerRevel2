import {informAboutErrorWithWorkData} from "../supporting/helpFunction.js";

const URL = "/employeeAndProjectTeam/"

class EmployeeAndProjectTeamData{

    add(idProjectTeam, idEmployee){
        let item = {
            idProjectTeam : +idProjectTeam,
            idEmployee : +idEmployee
        }
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

    remove(idProjectTeam, idEmployee){
        let item = {
            idProjectTeam : +idProjectTeam,
            idEmployee : +idEmployee
        }
        fetch(URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)})
            .then(response => response.json())
            .then(response => {if (response.error) informAboutErrorWithWorkData(response)})
            .catch(reason => informAboutErrorWithWorkData(reason));
    }
}

let employeeAndProjectTeamData = new EmployeeAndProjectTeamData()

export {employeeAndProjectTeamData}