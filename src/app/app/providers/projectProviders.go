package providers

import (
	"app/app/mappers"
	"app/app/models"
)

func ProjectAllGet() map[string]interface{} {
	data := make(map[string]interface{})
	projectAll, err := mappers.ProjectAllGet()
	data["error"] = err
	data["data"] = projectAll
	return data
}

func ProjectGet(idProject int64) map[string]interface{} {
	data := make(map[string]interface{})
	project, err := mappers.ProjectGet(idProject)
	data["error"] = err
	data["data"] = project
	return data
}

func ProjectGetByProjectTeam(idProjectTeam int64) map[string]interface{} {
	data := make(map[string]interface{})
	project, err := mappers.ProjectGetByProjectTeam(idProjectTeam)
	data["error"] = err
	data["data"] = project
	return data
}

func ProjectSave(project models.Project, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.ProjectSave(project)
	} else {
		data["error"] = err
	}
	return data
}

func ProjectUpdate(project models.Project, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.ProjectUpdate(project)
	} else {
		data["error"] = err
	}
	return data
}

func ProjectDelete(project models.Project, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.ProjectDelete(project)
	} else {
		data["error"] = err
	}
	return data
}
