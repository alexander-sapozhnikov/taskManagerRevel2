package controllers

import (
	"app/app/models"
	"app/app/providers"
	"github.com/revel/revel"
)

func (c App) ListTaskGetByProject(idProject int64) revel.Result {
	return c.RenderJSON(providers.ListTaskGetByProject(idProject))
}

func (c App) ListTaskSave() revel.Result {
	var listTask models.ListTask
	err := c.Params.BindJSON(&listTask)
	return c.RenderJSON(providers.ListTaskSave(listTask, err))
}
func (c App) ListTaskUpdate() revel.Result {
	var listTask models.ListTask
	err := c.Params.BindJSON(&listTask)
	return c.RenderJSON(providers.ListTaskUpdate(listTask, err))
}

func (c App) ListTaskDelete() revel.Result {
	var listTask models.ListTask
	err := c.Params.BindJSON(&listTask)
	return c.RenderJSON(providers.ListTaskDelete(listTask, err))
}

