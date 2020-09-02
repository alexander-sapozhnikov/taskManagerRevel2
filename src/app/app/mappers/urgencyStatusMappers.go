package mappers

import (
	"app/app/models"
)

func UrgencyAllGet() (urgencies []models.Urgency, err error) {
	sqlString := "SELECT * FROM urgency"
	rows, err := DB.Query(sqlString)
	if err == nil {
		for rows.Next() {
			var urgency models.Urgency
			err = rows.Scan(&urgency.IdUrgency, &urgency.NameUrgency)
			if err == nil {
				urgencies = append(urgencies, urgency)
			}
		}
	}

	return urgencies, err
}

func StatusAllGet() (statuses []models.Status, err error) {
	sqlString := "SELECT * FROM status"
	rows, err := DB.Query(sqlString)
	if err == nil {
		for rows.Next() {
			var status models.Status
			err = rows.Scan(&status.IdStatus, &status.NameStatus)
			if err == nil {
				statuses = append(statuses, status)
			}
		}
	}
	return statuses, err
}
