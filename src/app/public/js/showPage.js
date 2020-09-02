import {mainData} from "./data/mainData.js";
import {blockHeader} from "./blockPage/headerForPage.js"
import {mainBlock} from "./blockPage/mainBlock.js"
import {formBlock} from "./blockPage/formBlock.js"
import {viewBoardBlock} from "./blockPage/viewBoardBlock.js"
import {editProjectTeamBlock} from "./blockPage/editProjectTeamBlock.js"

export function showPage(order){
    order.headerBlockId = mainData.headerBlockId
    order.bodyBlockId = mainData.bodyBlockId

    if(order.float){
        order.headerBlockId += mainData.popupBlock
        order.bodyBlockId += mainData.popupBlock
        $$(mainData.popupBlock).show()
    }

    blockHeader(order)
    blockBody(order)
}

function blockBody(order){
    switch(order.typeBody){
        case mainData.mainBody:
            mainBlock(order)
            break;
        case mainData.editProjectTeamBody:
            editProjectTeamBlock(order)
            break;
        case mainData.viewBoardBody:
            viewBoardBlock(order)
            break;
        case mainData.formBody:
            formBlock(order)
            break;
    }
}
