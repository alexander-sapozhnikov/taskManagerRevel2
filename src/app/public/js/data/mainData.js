let mainData =  {
    headerTitleId : "headerTitle",
    headerBlockId : "headerBlock",
    bodyBlockId : "bodyBlock",

    popupBlock : "Popup",

    //type Header
    searchHeader : "search",
    titleAndBackHeader : "titleAndBack",
    justTitleHeader : "justTitleHeader",

    //type body
    mainBody : "main",
    editProjectTeamBody : "editProjectTeam",
    viewBoardBody : "viewBoard",
    formBody : "form",

    //img menu
    projectHeaderId : "projectImgMenu",
    projectTeamHeaderId : "projectTeamImgMenu",
    employeeHeaderId : "employeeImgMenu",

    //active img in menu
    active : "Active",

    //path to...
    pathToImg : "public/img/",

    //file types
    png : ".png",

    //state
    stateProject : "project",
    stateProjectTeam : "projectTeam",
    stateChangeTeamLeadInProjectTeam : "changeTeamLeadInProjectTeam",
    satefieldAddEmployeeInProjectTeam : "fieldAddEmployeeInProjectTeam",
    stateFieldAddProjectInProjectTeam : "fieldAddProjectInProjectTeam",
    stateChangeProjectTeamInProject : "changeProjectTeamInProject",
    stateEmployee : "employee",
    stateDelete : "delete",
    stateTask : "task",
    stateListTask : "listTask",

    //headerTitleAndBack
    wordAdd : "Добавить ",
    wordEdit : "Редактировать ",
    wordDelete : "Удалить ",

    //typeForm
    typeFormEdit : 1,
    typeFormDelete : 2,
}

//text for header
mainData.headerTitleMap = new Map();
mainData.headerTitleMap.set(mainData.projectHeaderId, "Проект")
mainData.headerTitleMap.set(mainData.projectTeamHeaderId, "Проектная группа")
mainData.headerTitleMap.set(mainData.employeeHeaderId, "Сотрудник")

//link for img in menu
mainData.ImgMenuMap = new Map();
mainData.ImgMenuMap.set(mainData.projectHeaderId, "project")
mainData.ImgMenuMap.set(mainData.projectTeamHeaderId, "projectTeam")
mainData.ImgMenuMap.set(mainData.employeeHeaderId, "employee")

//headerTitleAndBack
mainData.headerTitleAndBackMap = new Map();
mainData.headerTitleAndBackMap.set(mainData.projectHeaderId, "проект")
mainData.headerTitleAndBackMap.set(mainData.projectTeamHeaderId, "проектную группу")
mainData.headerTitleAndBackMap.set(mainData.employeeHeaderId, "сотрудника")

export {mainData};

export class Order{
    constructor(float, typeHeader, typeBody) {
        this.float = float;
        this.typeHeader = typeHeader;
        this.dataHeader = {};
        this.typeBody = typeBody;
        this.dataBody = {};

    }
}

// order.dataHeader.headerTitle текстовое значение для имени в заголовке таблицы 
// order.dataHeader.innerHeaderTitle текстовое значение header внутри блоков

// order.dataBody.state в каком состояние тело (stateProject, stateProjectTeam, stateEmployee) (пока только для формы)
// order.dataBody.form тип формы редактирование, удаление (по уомлчанию создание)
// order.dataBody.data информация по нужномум обьекту или из поиска
// для обновления
// order.dataBody.objActive обьект откуда пришли данные
// order.dataBody.dataBase скакой бд работаем (ПЕРЕДАЕМ ИМЯ БД!!!!)
// order.dataBody.idInDataBase прокидываем id обьекта для обьновления (нужен только в не явном случае)
// Опа! Костыль для обнволения страницы
// order.dataBody.oldOrder
// order.dataBody.idInDataBase - id изменяемого элемента
// order.dataBody.helpFunction - вспомагательная функция она может либо обновлять часть страницы либо делать какие-то дествия
