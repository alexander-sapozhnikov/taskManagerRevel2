import {mainData, Order} from "../data/mainData.js";
import {showPage} from "../showPage.js";
import {projectData} from "../data/projectData.js";
import {employeeData} from "../data/employeeData.js";
import {informAboutErrorWithWorkData} from "../supporting/helpFunction.js";
import {projectTeamData} from "../data/projectTeamData.js"
import {deleteEmployeeFromTasks} from "../supporting/helpFunction.js";

let order
const idEmployeeBlock = "employeeDataview"
export function editProjectTeamBlock(o){
    order = o
    webix.extend($$(order.bodyBlockId), webix.ProgressBar);
    $$(order.bodyBlockId).showProgress({
        type:"icon",
        hide : false
    });

    projectTeamData.get(order.dataBody.data.idProjectTeam)
        .then(response =>  response.json())
        .then( response => {
            if(response.error){
                informAboutErrorWithWorkData(response)
                return
            }
            if(!response.data){
                response.data = {}
            }
            order.dataBody.data = response.data
            drawEditProjectTeamBlock()
        })
        .catch(error => informAboutErrorWithWorkData(error))
}

function drawEditProjectTeamBlock(){
    webix.ui({
        id : order.bodyBlockId,
        cols :[
            {
                height : 0,
                rows:[
                    {
                        cols : [{},{id : "blockTeamLead"},{},]
                    },
                    {
                        align : "center",
                        view:"label",
                        label : "Сотрудники",
                    },
                    {
                        id : idEmployeeBlock,
                    }
                ]
            },
            {
                view:"resizer"
            },
            {
                id : "blockProject"
            }
        ]
    }, $$(order.bodyBlockId))

    blockTeamLead()
    blockEmployee()
    blockProject()
}

function blockTeamLead(){
    webix.extend($$("blockTeamLead"), webix.ProgressBar);
    $$("blockTeamLead").showProgress({
        type:"icon",
        hide : false
    });
    $$("blockTeamLead").disable()

    let teamLead = {
        firstName : "",
        lastName : ""
    }

    projectTeamData.get(order.dataBody.data.idProjectTeam)
        .then(response =>  response.json())
        .then( response => {
            if(response.error){
                informAboutErrorWithWorkData(response)
                return
            }
            if(response.data){
                teamLead = response.data.teamLead
            }
            drawBlockTeamLead(teamLead)
        })
        .catch(error => informAboutErrorWithWorkData(error))
}

function drawBlockTeamLead(teamLead){
    webix.ui({
        id : "blockTeamLead",
        cols : [
            {
                id : "nameTeamLead",
                view:"label", 
                align: "center",
                label : "Team Lead : "+ teamLead.firstName+ " " + teamLead.lastName,
                width : 250
            },
            {
                align: "left",
                view : "icon",
                width : 0,
                icon : "wxi-pencil",
                click : clickChangeTeamLead
            }
        ]            
    }, $$("blockTeamLead"))
}

function blockEmployee(){
    webix.extend($$(idEmployeeBlock), webix.ProgressBar);
    $$(idEmployeeBlock).showProgress({
        type:"icon",
        hide : false
    });
    $$(idEmployeeBlock).disable()

    employeeData.getByProjectTeam(order.dataBody.data)
        .then(response =>  response.json())
        .then( response => {
            if(response.error){
                informAboutErrorWithWorkData(response)
                return
            }
            if(!response.data){
                response.data = []
            }
            response.data.push({addNew: true})
            drawBlockEmployee(response)
        })
        .catch(error => informAboutErrorWithWorkData(error))
}

function drawBlockEmployee(employees){
    webix.ui({
        id : idEmployeeBlock,
        view:"dataview",
        select:true,
        xCount:7,
        height: 0,
        type: {
            width:"auto",
            height: 150,
            template: getTemplateEmployee,
        },
        data: employees,
        onClick : {
            "deleteBtn" : clickDeleteItem,
            "addBtn" : clickAddEmployee,
        },
    }, $$(idEmployeeBlock))
}

function blockProject() {
    webix.extend($$("blockProject"), webix.ProgressBar);
    $$("blockProject").showProgress({
        type:"icon",
        hide : false
    });

    $$("blockProject").disable()

    projectData.getProjectByProjectTeam(order.dataBody.data)
        .then(response =>  response.json())
        .then( response => {
            if(response.error){
                informAboutErrorWithWorkData(response)
                return
            }
            if(!response.data){
                response.data = []
            }
            response.data.push({addNew: true})
            drawBlockProject(response)
        })
        .catch(error => informAboutErrorWithWorkData(error))

}

function drawBlockProject(projects){
    webix.ui({
        id: "blockProject",
        width: "auto",
        rows: [
            {
                align: "center",
                view: "label",
                label: "Проекты",
            },
            {
                id: "projectDataview",
                view: "list",
                width: 250,
                height: 0,
                type: {
                    width: "auto",
                    height: "auto",
                    template: getTemplateProject,
                },
                select: true,
                data: projects,
                onClick: {
                    "deleteBtn": clickDeleteItem,
                    "addBtn": clickAddProject,
                },
            }
        ]
    }, $$("blockProject"))
}

function getTemplateProject(data){
    if(data.addNew){
        return "<input class='addBtn' type='button' style = 'width: 126px; height: 100px; cursor: pointer' value='Добавить'/>"
    } else {
        return data.nameProject + "<br/>"
        + "<input class='deleteBtn' type='button' style = 'width: 126px; height: 50px; cursor: pointer' value='удалить'/>"
    }
}

function getTemplateEmployee(data){
    if(data.addNew){
        return "<input class='addBtn' type='button' style = 'width: 126px; height: 146px; cursor: pointer' value='Добавить'/>"
    } else {
        return data.firstName +"<br/>" 
            +  data.middleName+ "<br/>" 
            + data.lastName + "<br/>" 
            + "<input class='deleteBtn' type='button' style = 'width: 126px; height: 50px; cursor: pointer' value='удалить'/>"
    }
}



function clickChangeTeamLead(){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody);

    newOrder.dataHeader = {
        headerTitle : $$(mainData.headerTitleId).getValue(),
        innerHeaderTitle : mainData.wordEdit + "team lead"
    }

    newOrder.dataBody = {
        state : mainData.stateChangeTeamLeadInProjectTeam,
        data : order.dataBody.data.teamLead,
        form : mainData.typeFormEdit,
        objActive : $$("nameTeamLead"),
        dataBase : mainData.stateProjectTeam,
        helpFunction : updateTeamLead,
        idInDataBase : order.dataBody.data.idProjectTeam,

    }

    showPage(newOrder)
}
function updateTeamLead(){
    let employee = this.data
    projectData.getProjectByProjectTeam(order.dataBody.data)
    .then(response =>  response.json())
    .then( response => {
        if(response.error){
            informAboutErrorWithWorkData(response)
            return
        }
        if(!response.data){
            response.data = []
        }
        for(let project of response.data) {
            deleteEmployeeFromTasks(employee, project.idProject)
        }
    })
    .catch(error => informAboutErrorWithWorkData(error))
    blockTeamLead()
}

function clickDeleteItem(_, id){

    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody)

    let idHeader = mainData.employeeHeaderId

    if(this !== $$(idEmployeeBlock)){
        idHeader = mainData.projectTeamHeaderId
    }

    newOrder.dataHeader = {
         headerTitle : mainData.headerTitleMap.get(mainData.projectTeamHeaderId),
         innerHeaderTitle : mainData.wordDelete + mainData.headerTitleAndBackMap.get(idHeader)
    }

    newOrder.dataBody = { 
        state : mainData.stateDelete,
        form : mainData.typeFormDelete,
        data : this.getItem(id),
        objActive : this,
        dataBase : mainData.stateProjectTeam,
        idInDataBase : order.dataBody.data.idProjectTeam,
        helpFunction : restTaskForEmployeeOrProject
    }

    showPage(newOrder)
}

function restTaskForEmployeeOrProject(){
    if(this.data.idEmployee){
        let employee = this.data
        projectData.getProjectByProjectTeam(order.dataBody.data)
        .then(response =>  response.json())
        .then( response => {
            if(response.error){
                informAboutErrorWithWorkData(response)
                return
            }
            if(!response.data){
                response.data = []
            }
            for(let project of response.data) {
                deleteEmployeeFromTasks(employee, project.idProject)
            }
        })
        .catch(error => informAboutErrorWithWorkData(error))
    } else {
        let project = this.data
        employeeData.getByProjectTeam({idProjectTeam : this.idInDataBase})
            .then(response =>  response.json())
            .then( response => {
                if(response.error){
                    informAboutErrorWithWorkData(response)
                    return
                }
                if(!response.data){
                    response.data = []
                }
                for(let employee of response.data) {
                    deleteEmployeeFromTasks(employee, project.idProject)
                }
            })
            .catch(error => informAboutErrorWithWorkData(error))
    }
}

function clickAddEmployee(){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody);

    newOrder.dataHeader = {
        headerTitle : $$(mainData.headerTitleId).getValue(),
        innerHeaderTitle : mainData.wordAdd + mainData.headerTitleAndBackMap.get(mainData.employeeHeaderId)
    }

    newOrder.dataBody = {
        state : mainData.satefieldAddEmployeeInProjectTeam,
        dataBase : mainData.stateProjectTeam,
        form : mainData.typeFormEdit,
        data : order.dataBody.data, 
        objActive : this,
        idInDataBase : order.dataBody.data.idProjectTeam,
        helpFunction : blockEmployee
    }

    showPage(newOrder)
}

function clickAddProject(){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody);

    newOrder.dataHeader = {
        headerTitle : $$(mainData.headerTitleId).getValue(),
        innerHeaderTitle : mainData.wordAdd + mainData.headerTitleAndBackMap.get(mainData.projectHeaderId)
    }

    newOrder.dataBody = {
        state : mainData.stateFieldAddProjectInProjectTeam,
        dataBase : mainData.stateProjectTeam,
        form : mainData.typeFormEdit,
        data : order.dataBody.data, 
        objActive : this,
        idInDataBase : order.dataBody.data.idProjectTeam,
        helpFunction : blockProject
    }

    showPage(newOrder)
}