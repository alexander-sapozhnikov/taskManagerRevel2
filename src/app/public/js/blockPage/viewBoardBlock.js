import {informAboutErrorWithWorkData} from "../supporting/helpFunction.js";
import {employeeData} from "../data/employeeData.js";
import {projectData} from "../data/projectData.js";
import {blockProjectTeam} from "./viewBoard/blockProjectForViewBoard.js"
import {blockKanban} from "./viewBoard/blockKanbanForViewBoard.js"
import {blockTasks} from "./viewBoard/blockTaskForViewBoard.js"

let order
let projectTeam
export const idBlockTaskAndListTask = "blockTaskAndListTask"

export function viewBoardBlock(o){
    order = o
    webix.extend($$(order.bodyBlockId), webix.ProgressBar);
    $$(order.bodyBlockId).showProgress({
        type:"icon",
        hide : false
    });

    projectData.get(order.dataBody.data.idProject)
        .then(response =>  response.json())
        .then( response => {
            if(response.error){
                informAboutErrorWithWorkData(response)
                return
            }
            if(!response.data){
                response.data = {}
            }
            projectTeam = response.data.projectTeam
            getProjectTeamEmployee()

        })
        .catch(error => informAboutErrorWithWorkData(error))
}

function getProjectTeamEmployee(){
    employeeData.getByProjectTeam(projectTeam)
        .then(response =>  response.json())
        .then( response => {
            if(response.error){
                informAboutErrorWithWorkData(response)
                return
            }
            if(!response.data){
                response.data = []
            }
            projectTeam.employees = response.data
            drawViewBoardBlock()
        })
        .catch(error => informAboutErrorWithWorkData(error))
}

function drawViewBoardBlock(){
    webix.ui({
        id : order.bodyBlockId,
        multi:true,
        view:"accordion",
        type:"wide",
        cols:[
            {
                gravity : 1.3,
                header:"Проектная команда",
                body: {id : "blockProjectTeam",},
                collapsed:false },
            {
                gravity : 4,
                body: {
                    view:"scrollview",
                    scroll:"y",
                    height: 0,
                    width: 0,
                    body:{id : "blockKanban"}
                    },
                collapsed:false
            },
            {
                gravity : 1.8,
                header:"Задачи проекта",
                body: {id : idBlockTaskAndListTask},
                collapsed:false
            },
        ]
    }, $$(order.bodyBlockId))
    blockProjectTeam(projectTeam, order)
    blockKanban(projectTeam, order.dataBody.data)
    blockTasks(order)
}