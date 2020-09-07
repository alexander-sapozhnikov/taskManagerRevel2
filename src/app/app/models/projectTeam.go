package models

type ProjectTeam struct {
	IdProjectTeam   int64      `json:"idProjectTeam"`
	NameProjectTeam string     `json:"nameProjectTeam"`
	TeamLead        Employee   `json:"teamLead"`
	Employees       []Employee `json:"employees"`
}
