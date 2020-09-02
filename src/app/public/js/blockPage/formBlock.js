import {mainData} from "../data/mainData.js";
import {projectTeamData} from "../data/ProjectTeamData.js";
import {statusData} from "../data/statusData.js";
import {urgencyData} from "../data/urgencyData.js";
import {employeeData} from "../data/employeeData.js"
import {projectData} from "../data/projectData.js"
import {choiseDataBase, clickBackToMain, informAboutErrorWithWorkData} from "../supporting/helpFunction.js";
import {showPage} from "../showPage.js";
import {taskData} from "../data/taskData.js";


let order
let buttons = [
    { 
        view:"button", 
        value:"Отменить" ,
        click : clickCancelAndCloseForAll
    },
    { 
        view:"button", 
        value:"Добавить", 
        css:"webix_primary",
        click : clickAddConfirm
    }
]



// обработчики кнопок пока только для удаления потвержедния и добавления с меню
export function formBlock(o){
    order = o;

    webix.ui({
        id : order.bodyBlockId,
        view: "template"
    }, $$(order.bodyBlockId))

    webix.extend($$(order.bodyBlockId), webix.ProgressBar);
    $$(order.bodyBlockId).showProgress({
        type:"icon",
        hide : false
    });

    switch(order.dataBody.form){
        case mainData.typeFormEdit:
            buttons[1].value = "Редактировать"
            buttons[1].click = clickEditConfirm
            break
        case mainData.typeFormDelete:
            buttons[1].value = "Уверен"
            buttons[1].click = clickDeleteConfirm
            break
        default:
            buttons[1].value = "Добавить"
            buttons[1].click = clickAddConfirm
    }

    switch(order.dataBody.state){
        case mainData.stateProject:
            fieldProject();
            break;
        case mainData.stateProjectTeam:
            fieldProjectTeam();
            break;
        case mainData.stateEmployee:
            fieldEmployee();
            break;
        case mainData.stateDelete:
            fieldDelete();
            break;
        case mainData.stateChangeTeamLeadInProjectTeam:
            fieldChangeTeamLeadInProjectTeam()
            break;
        case mainData.satefieldAddEmployeeInProjectTeam:
            fieldAddEmployeeInProjectTeam()
            break
        case mainData.stateFieldAddProjectInProjectTeam:
            fieldAddProjectInProjectTeam()
            break
        case mainData.stateChangeProjectTeamInProject:
            changeProjectTeamInProject()
            break
        case mainData.stateTask:
            fieldTask()
            break
        case mainData.stateListTask:
            fieldListTask()
            break
            
    }
}


function fieldProject(){
    let data = {}
    
    let options = [{
        id : 0,
        value : ""
    }]

    data.elements = [
        {
            name: "nameProject",
            view: "text",
            label: "Имя проекта*:",
            labelWidth: 200
        },
        {
            name: "idProjectTeam",
            view: "select",
            label: "Проектная группа: ",
            labelWidth: 200,
            value: 0,
            options: options
        }
    ]

    data.rules = {"nameProject": webix.rules.isNotEmpty}

    projectTeamData.getAll()
        .then(response => response.json())
        .then(response => {
                if (response.error != null) {
                    informAboutErrorWithWorkData(response)
                    return
                }
                response.data.forEach(({idProjectTeam, nameProjectTeam}) => {
                    options.push({
                        id: idProjectTeam,
                        value: nameProjectTeam
                    })
                })
                drawField(data)
        })
}

function fieldProjectTeam(){
    let data = {}

    let optionsTeamLead = [{
        id : 0,
        value : ""
    }]
    let options = []


    data.elements = [
        { 
            name : "nameProjectTeam",
            view:"text", 
            label:"Имя проектной группы*:",
            labelWidth: 200
        },

        {
            name: "idTeamLead",
            view:"select", 
            label:"Team Lead: ",
            labelWidth: 200, 
            options: optionsTeamLead
        },

        { 
            name :  "employees",
            view: "dbllist", 
            list:{
                minHeight: 100,
                maxHeight: 300,
                scroll: true  
            },
            labelBottomLeft:"Все сотрудники",
            labelBottomRight:"Выбранные сотрудники",
            data: options
        }
    ]

    data.rules = {
        "nameProjectTeam": webix.rules.isNotEmpty
    }

    employeeData.getAll()
        .then(response => response.json())
        .then(response => {
            if (response.error != null) {
                informAboutErrorWithWorkData(response)
                return
            }

            response.data.forEach(({idEmployee, lastName, firstName}) => {
                options.push({
                    id : idEmployee,
                    value : firstName + " " + lastName
                })
            });

            optionsTeamLead.push(...options)
            drawField(data)
        })
}

function fieldEmployee(){
    let data = {}
    let item = order.dataBody.data

    data.elements = [
        { 
            name : "firstName",
            view: "text", 
            label:"Имя*:",
            labelWidth: 200,
            value: item ? item.firstName : ""
        },
        { 
            name : "middleName",
            view: "text", 
            label:"Отчество:",
            labelWidth: 200,
            value: item ? item.middleName : ""
        },
        { 
            name : "lastName",
            view: "text", 
            label:"Фамилия*:",
            labelWidth: 200,
            value: item ? item.lastName : ""
        },
    ]

    data.rules = {
        "firstName": webix.rules.isNotEmpty,
        "lastName": webix.rules.isNotEmpty
    }

    data.state = mainData.stateEmployee
    drawField(data)
}

function fieldDelete(){
    let data = {}

    data.elements = [
        { 
            view:"label", 
            width : 200,
            label:"Вы точно хотите удалить?"
        }
    ]

    data.rules = {}

    data.state = mainData.stateDelete

    drawField(data)
}

function fieldChangeTeamLeadInProjectTeam(){
    let data = {}

    let optionsTeamLead = []

    data.elements = [
        {
            name: "idTeamLead",
            view:"select", 
            label:"Team Lead: ",
            labelWidth: 100, 
            options: optionsTeamLead
        },
    ]

    employeeData
        .getAll()
        .then(response => response.json())
        .then(response => {
            if (response.error != null) {
                informAboutErrorWithWorkData(response)
                return
            }

            response.data.forEach(({idEmployee, lastName, middleName, firstName}) => {
                optionsTeamLead.push({
                    id : idEmployee,
                    value : lastName + " " + middleName + " " + firstName
                })
            });

            drawField(data)
        })
}

function fieldAddEmployeeInProjectTeam(){
    let data = {}
    let options = []

    let employeeInProjectTeam = []

    order.dataBody.objActive.B.data.data.forEach(el => {
        employeeInProjectTeam.push({
            firstName: el.firstName,
            middleName: el.middleName,
            lastName: el.lastName,
            idEmployee: el.idEmployee
        })
    })

    data.elements = [
        {
            name: "idEmployee",
            view:"select", 
            label:"Сотрудник: ",
            labelWidth: 100, 
            options: options
        },
    ]

    data.rules = {
        "idEmployee": webix.rules.isNotEmpty
    }

    employeeData.getAll()
        .then(response => response.json())
        .then(response => {
            if (response.error != null) {
                informAboutErrorWithWorkData(response)
                return
            }
            response.data.forEach((employee) => {
                if(!employeeInProjectTeam.includes(employee)){
                    options.push({
                        id : employee.idEmployee,
                        value : employee.lastName + " " + employee.firstName
                    })
                }
            });
            drawField(data)
        })


}

function fieldAddProjectInProjectTeam(){
    let data = {}
    let options = []

    // let projectInProjectTeam = order.dataBody.objActive.B.data.data

    data.elements = [
        {
            name: "idProject",
            view:"select", 
            label:"Проект: ",
            labelWidth: 100, 
            options: options
        },
    ]

    data.rules = {
        "idProject": webix.rules.isNotEmpty
    }

    projectData.getAll()
        .then(response => response.json())
        .then(response => {
            if (response.error != null) {
                informAboutErrorWithWorkData(response)
                return
            }
            response.data.forEach((project) => {
                if(project.projectTeam.idProjectTeam === 0){
                    options.push({
                        id : project.idProject,
                        value : project.nameProject
                    })
                }
            });

            drawField(data)
        })
}

function changeProjectTeamInProject(){
    let data = {}
    let options = []

    data.elements = [
        {
            name: "idProjectTeam",
            view:"select", 
            label:"Проектные команды: ",
            labelWidth: 160, 
            width : 350,
            options: options
        },
    ]

    data.rules = {
        "idProjectTeam": webix.rules.isNotEmpty
    }

    projectTeamData.getAll()
        .then(response => response.json())
        .then(response => {
            if (response.error != null) {
                informAboutErrorWithWorkData(response)
                return
            }
            response.data.forEach((projectTeam) => {
                options.push({
                    id : projectTeam.idProjectTeam,
                    value : projectTeam.nameProjectTeam
                })
            });

            drawField(data)
        })
}

let wait
let statusAll = []
let urgencyAll = []
let employeeAll = []
let item = {}
function fieldTask(){
    wait = 0;

    item = undefined
    if(order.dataBody.data) {
        wait++
        taskData.get(order.dataBody.data.idTask)
            .then(response => response.json())
            .then(response => {
                if (response.error != null) {
                    informAboutErrorWithWorkData(response)
                    return
                }
                item = response.data
                wait--
                drawFieldTask()
            })
    }

    wait++
    statusAll = []
    statusData.getAll()
        .then(response => response.json())
        .then(response => {
            if (response.error != null) {
                informAboutErrorWithWorkData(response)
                return
            }
            response.data.forEach(status => {
                statusAll.push({
                    id : status.idStatus,
                    value : status.nameStatus
                })
            })
            wait--
            drawFieldTask()
        })

    wait++
    urgencyAll = []
    urgencyData.getAll()
        .then(response => response.json())
        .then(response => {
            if (response.error != null) {
                informAboutErrorWithWorkData(response)
                return
            }
            response.data.forEach(urgency => {
                urgencyAll.push({
                    id : urgency.idUrgency,
                    value : urgency.nameUrgency
                })
            })
            wait--
            drawFieldTask()
        })

    wait++
    employeeAll = [{
        id : 0,
        value : ""
    }]
    employeeData.getAll()
        .then(response => response.json())
        .then(response => {
            if (response.error != null) {
                informAboutErrorWithWorkData(response)
                return
            }
            response.data.forEach(employee => {
                    employeeAll.push({
                        id : employee.idEmployee,
                        value : employee.firstName + " " + employee.middleName + " " + employee.lastName
                    })
                })
            wait--
            drawFieldTask()
        })

}

function drawFieldTask(){
    if(wait !== 0) return
    let data = {}
    let labelWidth = 180
    data.elements = [
        {
            name : "formulation",
            view: "text",
            label:"Формулировка*:",
            labelWidth: labelWidth,
            value: item ? item.formulation : ""
        },
        {
            name : "description",
            view: "textarea",
            label:"Описание:",
            labelWidth: labelWidth,
            height: 100,
            value: item ? item.description : ""
        },
        {
            name : "theoreticalTimeWork",
            view: "text",
            label:"Время работы (в часах):",
            labelWidth: labelWidth,
            value: item ? item.theoreticalTimeWork : ""
        },
        {
            name: "idStatus",
            view:"select",
            label:"Статус: ",
            value : item ? item.status.idStatus : 0,
            labelWidth: labelWidth,
            options: statusAll
        },
        {
            name: "idUrgency",
            view:"select",
            label:"Срочность: ",
            value : item ? item.urgency.idUrgency : 0,
            labelWidth: labelWidth,
            options: urgencyAll
        },
    ]

    data.rules = {
        "formulation": webix.rules.isNotEmpty,
        "theoreticalTimeWork": webix.rules.isNumber,
    }
    data.height = 400

    if(item){
        //for case with edit task
        data.elements.push({
            name : "realTimeWork",
            view: "text",
            label:"Время реальной работы (в часах):",
            labelWidth: labelWidth,
            value: item ? item.realTimeWork : 0
        })
        if(item.employee.idEmployee) {
            data.elements.push({
                view: "label",
                label: "Сотрудник: " + item.employee.firstName + " " + item.employee.middleName + " " + item.employee.lastName,
            })
        }

        data.rules.realTimeWork = webix.rules.isNumber

        data.height = 450

    }

    data.state = mainData.stateEmployee
    data.width = 700
    drawField(data)
}

function fieldListTask(){
    let item = order.dataBody.data
    let data = {}

    data.elements = [
        { 
            name : "nameListTask",
            view:"text", 
            label:"Имя списка задач*:",
            labelWidth: 150,
            inputWidth : 260,
            value : item ? item.nameListTask : ""
        }
    ]

    data.rules = {"nameListTask": webix.rules.isNotEmpty}

    drawField(data)
}


function drawField(data){
    data.elements.push({
        cols: buttons
    })

    webix.ui({
        id : order.bodyBlockId,
        view: "form", 
        rules : data.rules,
        width : data.width ? data.width : "auto",
        height : data.height ? data.height : "auto",
        elements: data.elements,
    }, $$(order.bodyBlockId))
}

function clickDeleteConfirm(){
    let objActive = order.dataBody.objActive
    let dataBase = choiseDataBase(order.dataBody.dataBase)

    dataBase.remove(objActive.getItem(order.dataBody.data.id), order.dataBody.idInDataBase)
    objActive.remove(order.dataBody.data.id)
    objActive.refresh()

    clickCancelAndCloseForAll()

    webix.message({
        text:"Успешно удалено!",
        type:"success", 
        expire: 3000,
    })
}

function clickAddConfirm(){
    if(!$$(order.bodyBlockId).validate()){
        webix.message({
            text:"Некорректные данные!",
            type:"error", 
            expire: 2000,
        })
        return;
    }

    choiseDataBase(order.dataBody.dataBase).save($$(order.bodyBlockId).getValues(), order.dataBody.idInDataBase)

    webix.message({
        text:"Успешно добавлено!",
        type:"success", 
        expire: 3000,
    })
                
    clickCancelAndCloseForAll()
}

function clickEditConfirm(){
    if(!$$(order.bodyBlockId).validate()){
        webix.message({
            text:"Некорректные данные!",
            type:"error", 
            expire: 2000,
        })
        return;
    }

    choiseDataBase(order.dataBody.dataBase)
        .update($$(order.bodyBlockId).getValues(), order.dataBody.idInDataBase)

    webix.message({
        text:"Успешно сохранено!",
        type:"success", 
        expire: 3000,
    })
                
    clickCancelAndCloseForAll()
}

function clickCancelAndCloseForAll(){
    //осторожно showpage in progress bar ожет сбить данные
    if(order.dataBody.helpFunction){
        order.dataBody.helpFunction()
    }

    if(order.bodyBlockId.includes(mainData.popupBlock)){
        $$(mainData.popupBlock).hide()
        progressBar()
    } else {
        clickBackToMain()
    }
}

function progressBar(){
    if(order.dataBody.oldOrder){
        showPage(order.dataBody.oldOrder)
        $$(mainData.bodyBlockId).disable();
        webix.extend($$(mainData.bodyBlockId), webix.ProgressBar);
        let delay = 3000
        $$(mainData.bodyBlockId).showProgress({
            type:"top",
            delay: delay,
            hide:true
        });
        setTimeout(function(){
            $$(mainData.bodyBlockId).enable();
        }, delay);
        
    }
}