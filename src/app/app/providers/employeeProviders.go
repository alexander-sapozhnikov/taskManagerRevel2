package providers

import (
	"app/app/mappers"
	"app/app/models"
	"fmt"
)

func EmployeeAllGet() map[string]interface{} {
	data := make(map[string]interface{})
	employeeAll, err := mappers.EmployeeAllGet()
	data["error"] = err
	data["data"] = employeeAll
	return data
}

func EmployeeGet(idEmployee int64) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.EmployeeGet(idEmployee)
	data["error"] = err
	data["data"] = employee
	return data
}

func EmployeeGetByProjectTeam(idProjectTeam int64) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.EmployeeGetByProjectTeam(idProjectTeam)
	data["error"] = err
	data["data"] = employee
	return data
}

func EmployeeSave(employee models.Employee, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.EmployeeSave(employee)
	} else {
		data["error"] = err
	}
	return data
}

func EmployeeUpdate(employee models.Employee, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.EmployeeUpdate(employee)
	} else {
		data["error"] = err
	}
	fmt.Print("*********************", employee, data["error"])
	return data
}

func EmployeeDelete(employee models.Employee, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.EmployeeDelete(employee)
	} else {
		data["error"] = err
	}
	return data
}
