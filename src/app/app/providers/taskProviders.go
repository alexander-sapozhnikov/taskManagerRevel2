package providers

import (
	"app/app/mappers"
	"app/app/models"
	"time"
)

func TaskGet(idTask int64) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.TaskGet(idTask)
	data["error"] = err
	data["data"] = employee
	return data
}

func TaskGetByListTask(idListTask int64) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.TaskGetByListTask(idListTask)
	data["error"] = err
	data["data"] = employee
	return data
}

func TaskGetByEmployee(idEmployee int64) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.TaskGetByEmployee(idEmployee)
	data["error"] = err
	data["data"] = employee
	return data
}

func TaskGetByEmployeeAndDate(idEmployee int64, date time.Time, err error) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.TaskGetByEmployeeAndDate(idEmployee, date)
	data["error"] = err
	data["data"] = employee
	return data
}


func TaskSave(task models.Task, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.TaskSave(task)
	} else {
		data["error"] = err.Error()
	}
	return data
}

func TaskUpdate(task models.Task, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.TaskUpdate(task)
	} else {
		data["error"] = err.Error()
	}
	return data
}

func TaskDelete(task models.Task, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.TaskDelete(task)
	} else {
		data["error"] = err.Error()
	}
	return data
}
