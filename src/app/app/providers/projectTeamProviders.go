package providers

import (
	"app/app/mappers"
	"app/app/models"
)

func ProjectTeamAllGet() map[string]interface{} {
	data := make(map[string]interface{})
	projectAll, err := mappers.ProjectTeamAllGet()
	data["error"] = err
	data["data"] = projectAll
	return data
}

func ProjectTeamGet(idProjectTeam int64) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.ProjectTeamGet(idProjectTeam)
	data["error"] = err
	data["data"] = employee
	return data
}

func ProjectTeamSave(projectTeam models.ProjectTeam, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.ProjectTeamSave(projectTeam)
	} else {
		data["error"] = err
	}
	return data
}

func ProjectTeamUpdate(projectTeam models.ProjectTeam, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.ProjectTeamUpdate(projectTeam)
	} else {
		data["error"] = err
	}
	return data
}

func ProjectTeamDelete(projectTeam models.ProjectTeam, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.ProjectTeamDelete(projectTeam)
	} else {
		data["error"] = err
	}
	return data
}
