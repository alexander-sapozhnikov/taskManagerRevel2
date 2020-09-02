import {mainData, Order} from "./data/mainData.js";
import {showPage} from "./showPage.js";
import {defineStateThroughTitleHeaderOrId} from "./supporting/helpFunction.js";


webix.ready(function(){

     webix.ui({
        rows:[
            {
                view:"toolbar",
                css:"webix_dark",
                height : 70,
                cols:[
                    { 
                        view:"label", 
                        width : 200,
                        label:"Task manager"
                    },
                    {
                        id: mainData.headerTitleId,
                        align:"center",
                        view:"label", 
                        label : "",
                    },
                    {
                        width : 200,
                        cols : [ 
                            { 
                                view:"button", 
                                id : mainData.projectHeaderId,
                                type: "image", 
                                image: mainData.pathToImg + mainData.ImgMenuMap.get(mainData.projectHeaderId) + mainData.png, 
                                click : clickToMenu
                            },
                            { 
                                view:"button", 
                                id : mainData.projectTeamHeaderId,
                                type: "image", 
                                image:  mainData.pathToImg + mainData.ImgMenuMap.get(mainData.projectTeamHeaderId) + mainData.png, 
                                click : clickToMenu
                            },
                            { 
                                view:"button", 
                                id : mainData.employeeHeaderId,
                                type: "image", 
                                image:  mainData.pathToImg + mainData.ImgMenuMap.get(mainData.employeeHeaderId) +  mainData.active + mainData.png, 
                                click : clickToMenu
                            }
                        ]
                    }
                ]
            },

            {
                id : mainData.headerBlockId,
            },

            

            {
                id: mainData.bodyBlockId,
            }
        ]
    })

    let order = new Order(false, mainData.searchHeader, mainData.mainBody)
    order.dataHeader = { headerTitle : mainData.headerTitleMap.get(mainData.projectHeaderId)}
    order.dataBody = { 
        state : mainData.stateProject, 
        dataBase : mainData.stateProject
    }
    showPage(order)

    // let order = new Order(false, mainData.titleAndBackHeader, mainData.viewBoardBody);

    // order.dataHeader = {
    //     headerTitle : $$(mainData.headerTitleId).getValue(),
    //     innerHeaderTitle : "Проект : Google"
    // }

    // order.dataBody = {
    //     data : {idProject: 3, name: "three", projectTeam: "comand 333", id: 1598276266385}
    // }

    // showPage(order)
});



let clickToMenu = function(id){
    let order = new Order(false, mainData.searchHeader, mainData.mainBody)

    order.dataHeader = {
        headerTitle : mainData.headerTitleMap.get(id)
    }

    order.dataBody = {
        state : defineStateThroughTitleHeaderOrId(id),
        dataBase : defineStateThroughTitleHeaderOrId(id)
    }

    showPage(order)
}



let popup = {
    view:"popup",
    id:"Popup",
    position:"center",
    body:{
        minWidth: 300,
        minHeight: 200,
        rows:[
            { 
                id : (mainData.headerBlockId + mainData.popupBlock),   
            },
            {
                id:  (mainData.bodyBlockId + mainData.popupBlock),
            }
        ]
    }
}

webix.ui(popup).hide();
