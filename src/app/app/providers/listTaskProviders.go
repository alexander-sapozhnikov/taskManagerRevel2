package providers

import (
	"app/app/mappers"
	"app/app/models"
)

func ListTaskGetByProject(idProject int64) map[string]interface{} {
	data := make(map[string]interface{})
	listTask, err := mappers.ListTaskGetByProject(idProject)
	if err != nil {
		data["error"] = err.Error()
	}
	data["data"] = listTask
	return data
}

func ListTaskSave(listTask models.ListTask, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.ListTaskSave(listTask)
	} else {
		data["error"] = err.Error()
	}
	return data
}

func ListTaskUpdate(listTask models.ListTask, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.ListTaskUpdate(listTask)
	} else {
		data["error"] = err.Error()
	}
	return data
}

func ListTaskDelete(listTask models.ListTask, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.ListTaskDelete(listTask)
	} else {
		data["error"] = err.Error()
	}
	return data
}
