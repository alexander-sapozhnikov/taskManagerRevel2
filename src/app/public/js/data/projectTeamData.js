import {dataUsualAction} from "../supporting/dataUsualAction.js";
import {employeeAndProjectTeamData} from "./employeeAndProjectTeamData.js";
import {projectData} from "./projectData.js";

function ProjectTeam(idProjectTeam, nameProjectTeam, teamLead, employees){
    this.idProjectTeam = idProjectTeam
    this.nameProjectTeam = nameProjectTeam
    this.teamLead = teamLead
    this.employees = employees
}

const URL = "/projectTeam/"

class ProjectTeamData{
    getAll(){
        return fetch(URL);
    }

    get(idProjectTeam){
        return fetch(URL + idProjectTeam);
    }

    getByProject(projectTeam){
        return fetch(URL + "project/"+ projectTeam.idProjectTeam);
    }

    remove(item, index){
        if(item.idProjectTeam) {
            //dlt team
            dataUsualAction.remove(item, URL)
        } else if(item.idProject) {
            //dlt project in team
            item.nameProject = ""
            projectData.update(item)
        } else {
            //dlt employee in team
            employeeAndProjectTeamData.remove(index, item.idEmployee)
        }
    }

    save(item){
        item.teamLead = {}
        item.teamLead.idEmployee = +item.idTeamLead
        dataUsualAction.save(item, URL)
    }

    update(item, idProjectTeam){
        item.idProjectTeam = idProjectTeam
        item.teamLead = {}
        if(item.idTeamLead){
            //update team lead
            item.teamLead.idEmployee = +item.idTeamLead
            dataUsualAction.update(item, URL)
        } else if (item.idEmployee){
            //upd employee in team
            employeeAndProjectTeamData.add(idProjectTeam, item.idEmployee)
        } else if (item.idProject){
            //upd project in team
            item.projectTeam = {}
            item.projectTeam.idProjectTeam = +idProjectTeam
            projectData.update(item)
        }
    }
}

let projectTeamData = new ProjectTeamData()

export {projectTeamData}