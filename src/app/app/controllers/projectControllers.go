package controllers

import (
	"app/app/models"
	"app/app/providers"
	"github.com/revel/revel"
)

func (c App) ProjectAllGet() revel.Result {
	return c.RenderJSON(providers.ProjectAllGet())
}

func (c App) ProjectGet(idProject int64) revel.Result {
	return c.RenderJSON(providers.ProjectGet(idProject))
}

func (c App) ProjectGetByProjectTeam(idProjectTeam int64) revel.Result {
	return c.RenderJSON(providers.ProjectGetByProjectTeam(idProjectTeam))
}

func (c App) ProjectSave() revel.Result {
	var project models.Project
	err := c.Params.BindJSON(&project)
	return c.RenderJSON(providers.ProjectSave(project, err))
}

func (c App) ProjectUpdate() revel.Result {
	var project models.Project
	err := c.Params.BindJSON(&project)
	return c.RenderJSON(providers.ProjectUpdate(project, err))
}

func (c App) ProjectDelete() revel.Result {
	var employee models.Project
	err := c.Params.BindJSON(&employee)
	return c.RenderJSON(providers.ProjectDelete(employee, err))
}
