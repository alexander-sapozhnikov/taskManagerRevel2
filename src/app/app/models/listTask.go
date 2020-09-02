package models

type ListTask struct {
	IdListTask     int64 `json:"idListTask"`
	NameListTask   string `json:"nameListTask"`
	Project Project `json:"project"`
}
