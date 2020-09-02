package models

type Project struct {
	IdProject     int64 `json:"idProject"`
	NameProject   string `json:"nameProject"`
	ProjectTeam ProjectTeam `json:"projectTeam"`
}
