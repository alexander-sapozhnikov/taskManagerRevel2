import {mainData, Order} from "./../data/mainData.js";
import {showPage} from "./../showPage.js";
import {defineStateThroughTitleHeaderOrId, getHeaderIdForThisPage, clickBackToMain} from "./../supporting/helpFunction.js";

const HeightHederDynamic = 50
let order

export function blockHeader(o){
    order = o
    
    setHeadTitleAndMenuImg();

    switch(order.typeHeader){
        case mainData.searchHeader: 
            drawSearch();
            break;
        case mainData.titleAndBackHeader: 
            drawTitleAndBack();
            break;
        case mainData.justTitleHeader: 
            drawJustTitle();
            break;
    }
}

function setHeadTitleAndMenuImg(){
    let oldValueElement = $$(mainData.headerTitleId).getValue();
    
    if(order.dataHeader.headerTitle 
        && oldValueElement != order.dataHeader.headerTitle){
        $$(mainData.headerTitleId).setValue(order.dataHeader.headerTitle)

        let oldHeaderId = mainData.employeeHeaderId

        mainData.headerTitleMap.forEach((value, key) => {
            if(value == oldValueElement) {
                oldHeaderId = key
                return 
            }
        });

        let newHeaderId = getHeaderIdForThisPage();

        if(newHeaderId != oldHeaderId){
            $$(oldHeaderId).define("image", mainData.pathToImg 
                    + mainData.ImgMenuMap.get(oldHeaderId) 
                    + mainData.png);
            $$(oldHeaderId).refresh();

            $$(newHeaderId).define("image", mainData.pathToImg 
                    + mainData.ImgMenuMap.get(newHeaderId)
                    + mainData.active 
                    + mainData.png);
            $$(newHeaderId).refresh();
        }
    }
}

function drawSearch(){
    webix.ui({
        id : order.headerBlockId,
        css:"webix_light searchHeader",
        height : HeightHederDynamic,
        view:"search", 
        placeholder:"Искать..", 
        value: "",
        label:"Поиск",

    }, $$(order.headerBlockId))

    $$(order.headerBlockId).attachEvent("onTimedKeyPress",function(){
        let value = this.getValue().toLowerCase();
        $$(mainData.bodyBlockId).filter(function(obj){
            if(!obj.addNew) {
                return Object.values(obj).join("").toLowerCase().indexOf(value) > -1;
            } else return value === "";
        })
    });
}


function drawTitleAndBack(){
    webix.ui({
        id : order.headerBlockId,
        height : HeightHederDynamic,
        cols :[
            { 
                view:"button", 
                id : "backToMain",
                type: "image", 
                image:  mainData.pathToImg + "back" + mainData.png, 
                width : 80,
                click : clickBackToMain
            },

            {
                id : "titleForm",
                align:"center",
                view:"label", 
                label : "",
            },
            {
                width : 100,
            },
        ]
    }, $$(order.headerBlockId))

    $$("titleForm").setValue(order.dataHeader.innerHeaderTitle)
}

function drawJustTitle(){
    webix.ui({
        id : order.headerBlockId,
        cols :[
            {
                id : "justTitleForm",
                align:"center",
                view:"label", 
                value : "",
            }
        ]
    }, $$(order.headerBlockId))

    $$("justTitleForm").setValue(order.dataHeader.innerHeaderTitle)

}

let clickChangeSearchInMain = {
    onChange(newValue){
        let order = new Order(false, mainData.searchHeader, mainData.mainBody)

        order.dataHeader = {
            headerTitle : $$(mainData.headerTitleId).getValue()
        }

        order.dataBody = {
            state : defineStateThroughTitleHeaderOrId(),
            data : newValue,
            dataBase : defineStateThroughTitleHeaderOrId(),
        }

        showPage(order)
    }
}


