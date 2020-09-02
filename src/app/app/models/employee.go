package models

type Employee struct {
	IdEmployee     int64 `json:"idEmployee"`
	FirstName   string `json:"firstName"`
	MiddleName string `json:"middleName"`
	LastName string `json:"lastName"`
}
