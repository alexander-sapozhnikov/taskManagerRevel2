import {listTaskData} from "../../data/listTaskData.js";
import {informAboutErrorWithWorkData} from "../../supporting/helpFunction.js";
import {taskData} from "../../data/taskData.js";
import {mainData, Order} from "../../data/mainData.js";
import {showPage} from "../../showPage.js";
import {idBlockTaskAndListTask} from "../viewBoardBlock.js";
import {getTasksForEmployee} from "./blockKanbanForViewBoard.js";

let activeListTask
let order
const idBlockListTask = "blockListTask"
export const idTask = "blockTask"

export function blockTasks(o){
    order = o
    drawBlockListTaskAndTask()
    getListTask()
    drawBlockTask([])
}

function drawBlockListTaskAndTask(){
    webix.ui({
        id : idBlockTaskAndListTask,
        view:"accordion",
        type:"clean",
        rows:[
            {
                header: "Список задач",
                body : {
                    rows : [
                        {
                            id : idBlockListTask,
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
                            id : idTask,
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
    }, $$(idBlockTaskAndListTask))

    $$("blockTasksFind").attachEvent("onTimedKeyPress",function(){
        var value = this.getValue().toLowerCase();
        $$(idTask).filter(function(obj){
            return obj.formulation.toLowerCase().indexOf(value) > -1
                || obj.description.toLowerCase().indexOf(value) > -1;
        })
    });
}

function getListTask(){
    webix.extend($$(idBlockListTask), webix.ProgressBar);
    $$(idBlockListTask).showProgress({
        type:"icon",
        hide : false
    });

    listTaskData.getByProject(order.dataBody.data.idProject)
        .then(response => response.json())
        .then( response => {
            if(response.error){
                informAboutErrorWithWorkData(response)
                return
            }
            if(!response.data){
                response.data = []
            }
            drawBlockListTask(response.data)
        })
        .catch(error => informAboutErrorWithWorkData(error))
}

function drawBlockListTask(listTasks){
    webix.ui({
        id : idBlockListTask,
        view:"list",
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

    }, $$(idBlockListTask))
}


function drawBlockTask(tasks){
    webix.ui({
        id : idTask,
        view:"list",
        template: (task) => {
            return (task.employee.idEmployee > 0 ? "<i class='fas fa-hammer'></i> " : "")
                + task.formulation
                + "<span class='editTask fas fa-edit' style = ' font-size : 17px; cursor: pointer; float: right'></span>"
                + " <span class='deleteTask fas fa-trash' style = ' font-size : 17px; cursor: pointer; float: right'></span> "},
        select: true,
        data: tasks,
        drag : true,
        type : {
        },
        onClick: {
            "deleteTask" : clickDeleteTask,
        },
        on: {
            onBeforeDrag: clickOnBeforeDragBlockTask,
            onBeforeDrop : clickOnBeforeDropBlockTask,
            onItemClick : clickEditTask,
        },

    }, $$(idTask))
}

function clickAddListTask(){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody);

    newOrder.dataHeader = {
        innerHeaderTitle : mainData.wordAdd + " список задач"
    }

    newOrder.dataBody = {
        state : mainData.stateListTask,
        dataBase : mainData.stateListTask,
        idInDataBase : order.dataBody.data.idProject,
        helpFunction : getListTask
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
        data : $$(idBlockListTask).getItem(id),
        objActive : $$(idBlockListTask),
        dataBase : mainData.stateListTask,
        idInDataBase : $$(idBlockListTask).getItem(id).idListTask,
        helpFunction : getListTask
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
        data : $$(idBlockListTask).getItem(id),
        objActive : $$(idBlockListTask),
        dataBase : mainData.stateListTask,
        oldOrder : order,
    }
    showPage(newOrder)
    return false
}

function clickChoiceListTask(id){
    activeListTask = $$(idBlockListTask).getItem(id)
    if(!activeListTask) {
        webix.message({
            text:"Cписок задач не изменен.",
            type:"error",
            expire: 1000,
        })
        return
    }

    updateDataInTasks()

    webix.message({
        text:"Список задач изменен.",
        type:"success",
        expire: 1000,
    })
}


function clickOnBeforeDragBlockTask(context){
    if(this.getItem(context.start).employee.idEmployee > 0){
        webix.message("Это задание уже есть на доске")
        return false
    }
}

function clickOnBeforeDropBlockTask(context){
    let source = webix.DragControl.getContext();
    if(source.from.B.id === idBlockTaskAndListTask){
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
    context.to.render()
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
        idInDataBase : activeListTask.idListTask,
        helpFunction : updateDataInTasks
    }

    showPage(newOrder)
}

export function clickEditTask(id){
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
        idInDataBase : this.getItem(id).idTask,
        helpFunction : updateDataInBlockTaskAndBlockKanban
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
        data : $$(idTask).getItem(id),
        objActive : $$(idTask),
        dataBase : mainData.stateTask,
        helpFunction : updateDataInBlockTaskAndBlockKanban
    }
    showPage(newOrder)
    return false
}

function updateDataInBlockTaskAndBlockKanban(){
    let task = this.data
    let activeListTask = $$(idBlockListTask).getItem($$(idBlockListTask).getSelectedId())

    if(activeListTask
        && activeListTask.idListTask === task.listTask.idListTask){
        updateDataInTasks()
    }

    if(task.employee.idEmployee > 0){
        getTasksForEmployee(task.employee, new Date(task.dateExecution))
    }
}


function updateDataInTasks(){
    webix.extend($$(idTask), webix.ProgressBar);
    $$(idTask).showProgress({
        type:"icon",
        hide : false
    });

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
            $$(idTask).clearAll()
            $$(idTask).parse(response.data)
        })
        .catch(error => informAboutErrorWithWorkData(error))
}
