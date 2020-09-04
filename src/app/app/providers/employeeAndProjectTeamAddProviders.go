package providers

import (
	"app/app/mappers"
	"app/app/models"
)

func EmployeeAndProjectTeamAdd(employeeAndProjectTeam models.EmployeeAndProjectTeam, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.EmployeeAndProjectTeamAdd(employeeAndProjectTeam)
	} else {
		data["error"] = err.Error()
	}
	return data
}

func EmployeeAndProjectTeamRemove(employeeAndProjectTeam models.EmployeeAndProjectTeam, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = mappers.EmployeeAndProjectTeamRemove(employeeAndProjectTeam)
	} else {
		data["error"] = err.Error()
	}
	return data
}
