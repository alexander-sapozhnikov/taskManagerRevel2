import {listTaskData} from "../data/listTaskData.js";
import {taskData} from "../data/taskData.js";
import {showPage} from "../showPage.js";
import {mainData, Order} from "../data/mainData.js";
import {informAboutErrorWithWorkData} from "../supporting/helpFunction.js";
import {employeeData} from "../data/employeeData.js";
import {projectData} from "../data/projectData.js";
import {deleteEmployeeFromTasks} from "../supporting/helpFunction.js";

/**
 * нужно изменить clickeditTask на все поля что бы получала дданные
 */
let order
let projectTeam
const idBlockTask = "blockTask"

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
                body: {id : "blockKanban",},
                collapsed:false
            },
            {
                gravity : 1.8,
                header:"Задачи проекта",
                body: {id : idBlockTask,},
                collapsed:false
            },
        ]
    }, $$(order.bodyBlockId))
    blockProjectTeam()
    blockKanban()
    blockTasks()

}

function blockProjectTeam(){
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

function blockKanban(){
    let heightHourPX = 50

    let kanbanList = [
        {
            header:"Время", 
            body :{ 
                    view:"list",
                    template:"<div style = 'height: " +heightHourPX+ "px;'>#date#</div>",
                    type : {
                        height : "auto"
                    },
                    scroll : false,
                    data:[
                        { id:1, date:"9:00"},
                        { id:2, date:"10:00"},
                        { id:3, date:"11:00"},
                        { id:4, date:"12:00"},
                        { id:5, date:"13:00"},
                        { id:6, date:"14:00"},
                        { id:7, date:"15:00"},
                        { id:8, date:"16:00"},
                        { id:9, date:"17:00"},
                        { id:10, date:"18:00"},
                    ],
                },
        }
    ]


    projectTeam.employees.forEach((employee) => {
        kanbanList.push({
            header: employee.firstName + " " + employee.lastName,
            height: "auto",
            body :{
                    id : "employee" + employee.idEmployee,

                },
        })
    })

    webix.ui({
        id : "blockKanban",
        multi:true,
        view:"accordion",
        cols: kanbanList

    }, $$("blockKanban"))

    projectTeam.employees.forEach((employee) => {
        getTasksForEmployee("employee" + employee.idEmployee, employee)
    })

    
}

function getTasksForEmployee(id, employee){
    let dataKanban = []
    taskData.getByEmployee(employee)
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
            drawKanbanEmployee(id, dataKanban)
        })
        .catch(error => informAboutErrorWithWorkData(error))
}

function drawKanbanEmployee(id, dataKanban){
    let heightHourPX = 50
    let padding = 2
    webix.ui({
        id : id,
        view:"list",
        template: function(obj){
            return "<div style = 'height: "
                + (obj.theoreticalTimeWork * heightHourPX + (obj.theoreticalTimeWork+ (obj.theoreticalTimeWork > 1 ? +1 : +0))*padding)+ "px'>"
                + obj.formulation + "</div>"
        },
        type : {
            height : "auto"
        },
        drag : true,
        select:true,
        scroll : false,
        data: dataKanban,
        on: {
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
        taskData.update(task)
        id = source.to.getNextId(id)
    }
}

function clickOnBeforeDropBlockKanban(context){
    let source = webix.DragControl.getContext();
    let task = source.to.getItem(source.source[0])
    //id block wich we want insert his id example employee1
    task.employee ={}
    task.employee.idEmployee = +source.to.B.id.slice(8)
    taskData.update(task)
    if(source.from.B.id === idBlockTask){
        source.from.add(task)
    }
}

let activeListTask
function blockTasks(){
    webix.extend($$(idBlockTask), webix.ProgressBar);
    $$(idBlockTask).showProgress({
        type:"icon",
        hide : false
    });

    listTaskData.getByProject(order.dataBody.data.idProject)
        .then(response =>  response.json())
        .then( response => {
            if(response.error){
                informAboutErrorWithWorkData(response)
                return
            }
            if(!response.data){
                response.data = []
            }
            drawBlockTasks(response.data)
        })
        .catch(error => informAboutErrorWithWorkData(error))
}

function drawBlockTasks(listTasks){
    let tasks = []

    webix.ui({
        id : idBlockTask,
        view:"accordion",
        type:"clean",
        rows:[
            {
                header: "Список задач",
                body : {
                    rows : [
                        {
                            view:"list",
                            id : "blockListTask",
                            template: "#nameListTask#"
                                + "<span class='editTask fas fa-edit' style = ' font-size : 17px; cursor: pointer; float: right'></span>"
                                + " <span class='deleteTask fas fa-trash' style = ' font-size : 17px; cursor: pointer; float: right'></span> ",
                            data: listTasks,
                            select: true,
                            onClick: {
                                "deleteTask" : clickDeleteListTask,
                                "editTask" : clickEditListTask,

                            },
                            on: {
                                onItemClick: clickChoiceListTask,
                            },
                        },
                        {
                            view: "button",
                            template: "<span class='far fa-plus-square'  style = 'font-size : 18px; cursor: pointer'> Добавить список задач</span> ",
                            height : 35,
                            on:{
                                onItemClick: clickAddListTask,
                            }
                        },
                    ]
                }
            },
            {
                header: "Задачи",
                collapsed: true,
                body : {
                    rows :[
                        {
                            height: 35,
                            view:"toolbar",
                            elements:[
                                {
                                    view:"text",
                                    id:"blockTasksFind",
                                    label:"Поиск ",
                                    css:"fltr",
                                    labelWidth:60
                                }
                            ]
                        },
                        {
                            view:"list",
                            id : idBlockTask,
                            template: "#formulation#"
                                + "<span class='editTask fas fa-edit' style = ' font-size : 17px; cursor: pointer; float: right'></span>"
                                + " <span class='deleteTask fas fa-trash' style = ' font-size : 17px; cursor: pointer; float: right'></span> ",
                            select: true,
                            data: tasks,
                            drag : true,
                            onClick: {
                                "deleteTask" : clickDeleteTask,
                            },
                            on: {
                                onBeforeDrag: clickOnBeforeDragBlockTask,
                                onBeforeDrop : clickOnBeforeDropBlockTask,
                                onItemClick : clickEditTask,
                            },
                        },
                        {
                            view: "button",
                            template: "<i class='far fa-plus-square'  style = 'font-size : 18px; cursor: pointer'> Добавить задачу</i> ",
                            height : 35,
                            on:{
                                onItemClick: clickAddTask,
                            }
                        },
                    ]
                }
            }
        ]
    }, $$(idBlockTask))

    $$("blockTasksFind").attachEvent("onTimedKeyPress",function(){
        var value = this.getValue().toLowerCase();
        $$(idBlockTask).filter(function(obj){
            console.log(obj.title)
            return obj.formulation.toLowerCase().indexOf(value) > -1
                || obj.description.toLowerCase().indexOf(value) > -1;
        })
    });
}

function clickOnBeforeDragBlockTask(context){
    if($$(idBlockTask).getItem(context.start).employee.idEmployee > 0){
        webix.message("Это задание уже есть на доске")
        return false
    }
}

function clickOnBeforeDropBlockTask(context){
    let source = webix.DragControl.getContext();
    if(source.from.B.id === idBlockTask){
        return false
    }
    let task = source.from.getItem(source.source[0])
    task.employee ={}
    task.employee.idEmployee = 0

    let id = context.to.getFirstId()
    while(id){
        if(context.to.getItem(id).idTask === task.idTask){
            context.to.getItem(id).employee.idEmployee = 0
            break
        }
        id = context.to.getNextId(id)
    }

    source.from.remove(source.source[0])
    taskData.update(task)
    return false
}



function clickAddTask(){
    if(!activeListTask){
        webix.message({
            text:"Для добавления задач выберете список.",
            type:"error",
            expire: 1000,
        })
        return
    }
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody);

    newOrder.dataHeader = {
        innerHeaderTitle : mainData.wordAdd + " задачу"
    }

    newOrder.dataBody = {
        state : mainData.stateTask,
        dataBase : mainData.stateTask,
        oldOrder : order,
        idInDataBase : activeListTask.idListTask 
    }

    showPage(newOrder)
}

function clickEditTask(id){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody)

    newOrder.dataHeader = {
         innerHeaderTitle : mainData.wordEdit + " задачу"
    }

    newOrder.dataBody = { 
        state : mainData.stateTask,
        form : mainData.typeFormEdit,
        data : this.getItem(id),
        objActive : this,
        dataBase : mainData.stateTask,
        oldOrder : order,
        idInDataBase : this.getItem(id).idTask
    }
    showPage(newOrder)
    return false
}

function clickDeleteTask(_, id){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody)

    newOrder.dataHeader = {
         innerHeaderTitle : mainData.wordDelete + "задачу"
    }

    newOrder.dataBody = { 
        state : mainData.stateDelete,
        form : mainData.typeFormDelete,
        data : $$(idBlockTask).getItem(id),
        objActive : $$(idBlockTask),
        dataBase : mainData.stateTask,
    }
    showPage(newOrder)
    return false
}


function clickAddListTask(){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody);

    newOrder.dataHeader = {
        innerHeaderTitle : mainData.wordAdd + " список задач"
    }

    newOrder.dataBody = {
        state : mainData.stateListTask,
        dataBase : mainData.stateListTask,
        oldOrder : order,
        idInDataBase : order.dataBody.data.idProject
    }

    showPage(newOrder)
}

function clickEditListTask(_, id){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody)

    newOrder.dataHeader = {
         innerHeaderTitle : mainData.wordEdit + " список задач"
    }

    newOrder.dataBody = { 
        state : mainData.stateListTask,
        form : mainData.typeFormEdit,
        data : $$("blockListTask").getItem(id),
        objActive : $$("blockListTask"),
        dataBase : mainData.stateListTask,
        oldOrder : order,
        idInDataBase : $$("blockListTask").getItem(id).idListTask
    }
    showPage(newOrder)
    return false
}

function clickDeleteListTask(_, id){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody)

    newOrder.dataHeader = {
         innerHeaderTitle : mainData.wordDelete + "список задач"
    }

    newOrder.dataBody = { 
        state : mainData.stateDelete,
        form : mainData.typeFormDelete,
        data : $$("blockListTask").getItem(id),
        objActive : $$("blockListTask"),
        dataBase : mainData.stateListTask,
        oldOrder : order,
    }
    showPage(newOrder)
    return false
}

function clickChoiceListTask(id){
    webix.extend($$(idBlockTask), webix.ProgressBar);
    $$(idBlockTask).showProgress({
        type:"icon",
        hide : false
    });

    activeListTask = $$("blockListTask").getItem(id)

    if(!activeListTask) {
        webix.message({
            text:"Активный список задач не изменен.",
            type:"error",
            expire: 1000,
        })
        return
    }

    taskData.getByListTask(activeListTask)
        .then(response =>  response.json())
        .then( response => {
            if(response.error){
                informAboutErrorWithWorkData(response)
                return
            }
            if(!response.data){
                response.data = []
            }
            $$(idBlockTask).clearAll()
            $$(idBlockTask).parse(response.data)
            webix.message({
                text:"Активный список задач изменен.",
                type:"success",
                expire: 1000,
            })
        })
        .catch(error => informAboutErrorWithWorkData(error))
}