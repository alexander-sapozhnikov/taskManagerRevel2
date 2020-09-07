package controllers

import (
	"app/app/models"
	"app/app/providers"

	"github.com/revel/revel"
)

func (c App) ProjectTeamAllGet() revel.Result {
	return c.RenderJSON(providers.ProjectTeamAllGet())
}

func (c App) ProjectTeamGet(idProjectTeam int64) revel.Result {
	return c.RenderJSON(providers.ProjectTeamGet(idProjectTeam))
}

func (c App) ProjectTeamSave() revel.Result {
	var projectTeam models.ProjectTeam
	err := c.Params.BindJSON(&projectTeam)
	return c.RenderJSON(providers.ProjectTeamSave(projectTeam, err))
}

func (c App) ProjectTeamUpdate() revel.Result {
	var projectTeam models.ProjectTeam
	err := c.Params.BindJSON(&projectTeam)
	return c.RenderJSON(providers.ProjectTeamUpdate(projectTeam, err))
}

func (c App) ProjectTeamDelete() revel.Result {
	var projectTeam models.ProjectTeam
	err := c.Params.BindJSON(&projectTeam)
	return c.RenderJSON(providers.ProjectTeamDelete(projectTeam, err))
}
