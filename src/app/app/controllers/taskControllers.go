package controllers

import (
	"app/app/models"
	"app/app/providers"
	"time"

	"github.com/revel/revel"
)

func (c App) TaskGet(idTask int64) revel.Result {
	return c.RenderJSON(providers.TaskGet(idTask))
}

func (c App) TaskGetByListTask(idListTask int64) revel.Result {
	return c.RenderJSON(providers.TaskGetByListTask(idListTask))
}

func (c App) TaskGetByEmployee(idEmployee int64) revel.Result {
	return c.RenderJSON(providers.TaskGetByEmployee(idEmployee))
}

func (c App) TaskGetByEmployeeAndDate(idEmployee int64) revel.Result {
	format := "Mon Jan 02 2006 15:04:05 GMT+0400"
	parseTime, err := time.Parse(format, c.Params.Get("date")[0:len(format)])
	return c.RenderJSON(providers.TaskGetByEmployeeAndDate(idEmployee, parseTime, err))
}

func (c App) TaskSave() revel.Result {
	var task models.Task
	err := c.Params.BindJSON(&task)
	return c.RenderJSON(providers.TaskSave(task, err))
}

func (c App) TaskUpdate() revel.Result {
	var task models.Task
	err := c.Params.BindJSON(&task)
	return c.RenderJSON(providers.TaskUpdate(task, err))
}

func (c App) TaskDelete() revel.Result {
	var task models.Task
	err := c.Params.BindJSON(&task)
	return c.RenderJSON(providers.TaskDelete(task, err))
}
