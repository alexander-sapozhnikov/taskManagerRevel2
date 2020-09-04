import {taskData} from "../../data/taskData.js";
import {informAboutErrorWithWorkData} from "../../supporting/helpFunction.js";
import {clickEditTask, idTask} from "./blockTaskForViewBoard.js"

let projectTeam
let project
const HeightHourPX = 50
const HeightKanbanForOneDay = 486

// let mapHeightFreeInKanbanOneDay = new Map()

export function blockKanban(pt, pr){
    projectTeam = pt
    project = pr
    let columnEmployeeForDay = makeColumnEmployeesForDay()

    let date = new Date();

    let formatDate = {
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };

    let i = 0
    let mainRowsKanban = []
    let dataMainRowsKanban = []

    while(i < 3){
        if(date.getDay() > 0 && date.getDay() < 6) {
            let dateId = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear()
            dataMainRowsKanban.push(new Date(date))

            let columnEmployeeForThisDay = webix.copy(columnEmployeeForDay)

            for(let i = 1; i < columnEmployeeForThisDay.length; i++){
                columnEmployeeForThisDay[i].body.id += "_date_" + dateId
            }

            mainRowsKanban.push({
                header : date.toLocaleString("ru", formatDate),
                body : {
                    id : dateId,
                    multi: true,
                    view: "accordion",
                    cols: columnEmployeeForThisDay,
                }
            })
            i++
        }
        date.setDate(date.getDate() + 1)
    }


    webix.ui({
        view:"accordion",
        id: "blockKanban",
        type:"clean",
        multi: true,
        rows : mainRowsKanban
    }, $$("blockKanban"))

    dataMainRowsKanban.forEach(date =>{
        projectTeam.employees.forEach((employee) => {
            getTasksForEmployee(employee, date)
        })
    })


}

function makeColumnEmployeesForDay(){
    let listHours =[
        { id:1, date:"9:00"},
        { id:2, date:"10:00"},
        { id:3, date:"11:00"},
        { id:4, date:"12:00"},
        { id:5, date:"14:00"},
        { id:6, date:"15:00"},
        { id:7, date:"16:00"},
        { id:8, date:"17:00"},
        { id:9, date:"18:00"}
    ]

    let kanbanListForDay = [
        {
            header:"Время",
            width : 150,
            body :{
                view:"list",
                template:"<div style = 'height: " +HeightHourPX+ "px; " +
                    "text-align: center;'>#date#</div>",
                type : {
                    height : "auto"

                },
                scroll : false,
                height : HeightKanbanForOneDay,
                weight : 50,
                data: listHours,
            },
        }
    ]


    projectTeam.employees.forEach((employee) => {
        kanbanListForDay.push({
            header: employee.firstName + " " + employee.lastName,
            body :{
                id : "employee_" + employee.idEmployee,
            },
        })
    })

    return kanbanListForDay
}

export function getTasksForEmployee(employee, date){
    let id = "employee_" + employee.idEmployee + "_date_" + date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear()

    webix.extend($$(id), webix.ProgressBar);
    $$(id).showProgress({
        type:"icon",
        hide : false
    });

    let dataKanban = []
    taskData.getByEmployeeAndDate(employee, date)
        .then(response =>  response.json())
        .then( response => {
            if(response.error){
                informAboutErrorWithWorkData(response)
                return
            }
            if(!response.data){
                response.data = []
            }
            dataKanban.push(...response.data)
            drawKanbanEmployee(dataKanban, employee, date)
        })
        .catch(error => informAboutErrorWithWorkData(error))
}

function drawKanbanEmployee(dataKanban, employee, date){
    let padding = 2
    let id = "employee_" + employee.idEmployee + "_date_" + date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear()
    // mapHeightFreeInKanbanOneDay.set(id, HeightKanbanForOneDay)
    webix.ui({
        id : id,
        view:"list",
        idEmployee : employee.idEmployee,
        dateKanban : date,
        template: function(obj){
            let urgent = ""
            for(let i = 0; i < obj.urgency.idUrgency; ++i){
                urgent += "<i class=\"fas fa-angle-up urgentInTaskInKanban\"></i>"
            }
            let heightForTask = (obj.theoreticalTimeWork * HeightHourPX + (obj.theoreticalTimeWork+ (obj.theoreticalTimeWork * 10 % 10 !==0 ? +1 : +0))*padding*2)
            // let heightMaxForBlock = mapHeightFreeInKanbanOneDay.get(id)
            // if(heightForTask > heightMaxForBlock) heightForTask = heightMaxForBlock
            // heightMaxForBlock -= heightForTask
            // mapHeightFreeInKanbanOneDay.set(id, heightMaxForBlock)
            return "<div style = 'height: " +heightForTask+  "px' " +
                " class = 'taskInKanban'>"
                + "<div class = 'textTaskInKanban'>"
                +"<p>"+ obj.formulation + " </br>" +obj.status.nameStatus + "</p>"
                + "</div><div class='urgentBlockInTaskInKanban'>"
                + urgent
                +"</div></div>"
        },
        type : {
            height : "auto",
        },
        drag : true,
        select:true,
        scroll : false,
        data: dataKanban,
        on: {
            onBeforeDrag : clickOnBeforeDragBlockKanban,
            onAfterDrop : clickOnBeforeDropBlockKanban,
            onItemClick : clickEditTask,
            onAfterAdd :  clickAfterAddInKanbanList,
        },

    }, $$(id))
}



function clickAfterAddInKanbanList(){
    let source = webix.DragControl.getContext();
    let id = source.to.getFirstId()
    while(id){
        let task = source.to.getItem(id)
        task.position = (source.to.getIndexById(id))
        task.employee.idEmployee = +source.to.B.idEmployee
        task.dateExecution = source.to.B.dateKanban
        taskData.update(task)
        id = source.to.getNextId(id)
    }
}

function clickOnBeforeDropBlockKanban(){
    let source = webix.DragControl.getContext();
    let task = source.to.getItem(source.source[0])

    //idTask - это id блока task
    if(source.from.B.id === idTask){
        source.from.add(task)
    } else {
        // mapHeightFreeInKanbanOneDay.set(source.from.B.id, HeightKanbanForOneDay)
        // mapHeightFreeInKanbanOneDay.set(source.to.B.id, HeightKanbanForOneDay)
        // source.from.render()
        // source.to.render()
    }
}

function clickOnBeforeDragBlockKanban(context){
    let task = this.getItem(context.source[0])
    if(task.listTask.project.idProject !== project.idProject){
        webix.message({
            text: "Это задание из другого проекта!",
            type:"error",
            expire: 3000,
        })
        return false
    }
}