import {mainData, Order} from "../../data/mainData.js";
import {showPage} from "../../showPage.js";
import {deleteEmployeeFromTasks} from "../../supporting/helpFunction.js";

let projectTeam
let order
export function blockProjectTeam(pt, o){
    projectTeam = pt
    order = o
    webix.ui({
        rows : [
            {
                align : "center",
                view:"label",
                label : "Team Lead: ",
            },
            {
                align : "center",
                view:"label",
                label : projectTeam.teamLead.firstName + " " + projectTeam.teamLead.lastName,
            },
            {
                align : "center",
                view:"label",
                label : "Сотрудники: ",
            },
            {
                view : "list",
                template : "#firstName#  #lastName#",
                select : true,
                data: projectTeam.employees
            },
            {
                view: "button",
                template: "<i class='changeProjectTeam fas fa-exchange-alt' style = 'font-size : 16px; text-align: center; cursor: pointer;'> Сменить проектную группу</i> ",
                height : 35,
                on:{
                    onItemClick: clickChangeProjectTeam
                }
            },
        ],
    }, $$("blockProjectTeam"))
}

function clickChangeProjectTeam(){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody);

    newOrder.dataHeader = {
        headerTitle : $$(mainData.headerTitleId).getValue(),
        innerHeaderTitle : mainData.wordEdit + " проетную группу"
    }

    newOrder.dataBody = {
        state : mainData.stateChangeProjectTeamInProject,
        form : mainData.typeFormEdit,
        dataBase : mainData.stateProject,
        idInDataBase : order.dataBody.data.idProject,
        oldOrder : order,
        helpFunction : resetTaskForOtherProjectTeam
    }

    showPage(newOrder)
}

function resetTaskForOtherProjectTeam(){
    projectTeam.employees.forEach(employee => {
        deleteEmployeeFromTasks(employee, order.dataBody.data.idProject)
    })
}