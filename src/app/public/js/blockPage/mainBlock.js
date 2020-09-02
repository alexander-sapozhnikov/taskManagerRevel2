import {mainData, Order} from "./../data/mainData.js";
import {getHeaderIdForThisPage, choiseDataBase, 
    defineStateThroughTitleHeaderOrId, informAboutErrorWithWorkData} from "./../supporting/helpFunction.js";
import {showPage} from "./../showPage.js";

let order

export function mainBlock(o){
    order = o;

    webix.ui({
        view:"dataview",
        id: order.bodyBlockId,
        select: true,
        xCount : 6,
        width : 0,
        type: {
            height: 150,
            width: "auto",
            template:  getTemplate,
        },
        data : [],

        onClick : {
            "deleteBtn" : clickDeleteItem,
            "addBtn" : clickAddNewComponentInMainBlock,
            "editBtm" : clickEditItem,
        },

        on: {
            onSelectChange : clickOnItem
        },
    }, $$(order.bodyBlockId))


    webix.extend($$(order.bodyBlockId), webix.ProgressBar);
    $$(order.bodyBlockId).showProgress({
        type:"icon",
        hide : false
    });


    let dataBase = choiseDataBase(order.dataBody.dataBase)

    dataBase.getAll()
        .then(response =>  response.json())
        .then( response => {
                    if(response.error){
                        informAboutErrorWithWorkData(response)
                        return
                    }
                    response.data.push({addNew: true})
                    $$(order.bodyBlockId).parse(response.data);
                    $$(order.bodyBlockId).refresh();
                    $$(order.bodyBlockId).enable();
                    $$(order.bodyBlockId).hideProgress();})
        .catch(error => informAboutErrorWithWorkData(error))


}


function getTemplate(data){
    let template = " <span class='deleteBtn fas fa-trash' style = ' font-size : 20px; cursor: pointer; float: right'></span> "

    if(data.addNew){
        return "<span class='addBtn far fa-plus-square'  style = ' font-size : 146px; cursor: pointer'></span>"
    }

    switch(order.dataBody.state){
        case mainData.stateProject:
            template += data.nameProject + "<br/>" + data.projectTeam.nameProjectTeam + "<br/>"
            break
        case mainData.stateProjectTeam:
            template += "<span class='editBtm fas fa-edit' style = ' font-size : 20px; cursor: pointer; float: right'></span>" +  data.nameProjectTeam
            break
        case mainData.stateEmployee:
            template += data.firstName +"<br/>" +  data.middleName + "<br/>" + data.lastName + "<br/>"
            break
    }

    return template
}

function clickAddNewComponentInMainBlock(){
    let order = new Order(false, mainData.titleAndBackHeader, mainData.formBody);

    order.dataHeader = {
        headerTitle : $$(mainData.headerTitleId).getValue(),
        innerHeaderTitle : mainData.wordAdd + mainData.headerTitleAndBackMap.get(getHeaderIdForThisPage())
    }

    order.dataBody = {
        state : defineStateThroughTitleHeaderOrId(),
        dataBase : defineStateThroughTitleHeaderOrId()
    }

    showPage(order)
    return false
}

 function clickDeleteItem(_, id){
        let order = new Order(true, mainData.justTitleHeader, mainData.formBody)
        order.dataHeader = {
             headerTitle : mainData.headerTitleMap.get(getHeaderIdForThisPage()),
             innerHeaderTitle : mainData.wordDelete + mainData.headerTitleAndBackMap.get(getHeaderIdForThisPage())
        }
        order.dataBody = { 
            state : mainData.stateDelete,
            form  : mainData.typeFormDelete,
            data : $$(mainData.bodyBlockId).getItem(id),
            objActive : $$(mainData.bodyBlockId),
            dataBase : defineStateThroughTitleHeaderOrId()
        }
        showPage(order)
        return false
}

function clickEditItem(_, id){
    let order = new Order(false, mainData.titleAndBackHeader, mainData.editProjectTeamBody);

    order.dataHeader = {
        headerTitle : $$(mainData.headerTitleId).getValue(),
        innerHeaderTitle : $$(mainData.bodyBlockId).getItem(id).nameProjectTeam
    }

    order.dataBody = {
        data : $$(mainData.bodyBlockId).getItem(id),
    }

    showPage(order)
}


function clickOnItem(id){
    if(order.dataBody.state === mainData.stateEmployee){
        let order = new Order(false, mainData.titleAndBackHeader, mainData.formBody);

        order.dataHeader = {
            headerTitle : $$(mainData.headerTitleId).getValue(),
            innerHeaderTitle : mainData.wordAdd + mainData.headerTitleAndBackMap.get(getHeaderIdForThisPage())
        }

        order.dataBody = {
            state : defineStateThroughTitleHeaderOrId(),
            form : mainData.typeFormEdit,
            data : $$(mainData.bodyBlockId).getItem(id),
            dataBase : defineStateThroughTitleHeaderOrId(),
            idInDataBase : $$(mainData.bodyBlockId).getItem(id).idEmployee
        }

        showPage(order)
    } else if (order.dataBody.state === mainData.stateProject){
        let newOrder = new Order(false, mainData.titleAndBackHeader, mainData.viewBoardBody);

        newOrder.dataHeader = {
            headerTitle : $$(mainData.headerTitleId).getValue(),
            innerHeaderTitle : "Проект : " + $$(mainData.bodyBlockId).getItem(id).nameProject
        }

        newOrder.dataBody = {
            data : $$(order.bodyBlockId).getItem(id),
        }

        showPage(newOrder)
    }
}
