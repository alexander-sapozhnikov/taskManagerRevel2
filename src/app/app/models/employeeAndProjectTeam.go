package models

type EmployeeAndProjectTeam struct {
	IdEmployeeAndProjectTeam int64 `json:"idEmployeeAndProjectTeam"`
	IdProjectTeam            int64 `json:"idProjectTeam"`
	IdEmployee               int64 `json:"idEmployee"`
}
