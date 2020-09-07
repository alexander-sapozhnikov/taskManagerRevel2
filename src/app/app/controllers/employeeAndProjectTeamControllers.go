package controllers

import (
	"app/app/models"
	"app/app/providers"
	"fmt"

	"github.com/revel/revel"
)

func (c App) EmployeeAndProjectTeamAdd() revel.Result {
	var employeeAndProjectTeam models.EmployeeAndProjectTeam
	err := c.Params.BindJSON(&employeeAndProjectTeam)
	fmt.Println("********************************")
	fmt.Println(err)
	fmt.Println(c.Params)
	return c.RenderJSON(providers.EmployeeAndProjectTeamAdd(employeeAndProjectTeam, err))
}

func (c App) EmployeeAndProjectTeamRemove() revel.Result {
	var employeeAndProjectTeam models.EmployeeAndProjectTeam
	err := c.Params.BindJSON(&employeeAndProjectTeam)
	return c.RenderJSON(providers.EmployeeAndProjectTeamRemove(employeeAndProjectTeam, err))
}
