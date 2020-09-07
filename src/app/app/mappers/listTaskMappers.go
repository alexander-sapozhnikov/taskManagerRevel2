package mappers

import (
	"app/app/models"
	"fmt"
)

func ListTaskGetByProject(idProjectTeam int64) ([]models.ListTask, error) {
	sqlString := "SELECT idlisttask, namelisttask FROM listtask left outer join project p on p.idproject = listtask.idproject WHERE p.idproject = $1"
	rows, err := DB.Query(sqlString, idProjectTeam)
	var listTaskAll []models.ListTask
	
	defer rows.Close()

	if err == nil {
		for rows.Next() {
			var listTask models.ListTask
			err = rows.Scan(&listTask.IdListTask, &listTask.NameListTask)
			if err == nil {
				listTaskAll = append(listTaskAll, listTask)
			}
		}
	}
	return listTaskAll, err
}

func ListTaskSave(listTask models.ListTask) error {
	sqlString := `INSERT INTO listTask (namelisttask, idproject) VALUES ($1, $2);`
	_, err := DB.Exec(sqlString, listTask.NameListTask, listTask.Project.IdProject)
	fmt.Println(err)
	return err
}

func ListTaskUpdate(listTask models.ListTask) error {
	sqlString := `UPDATE listTask SET namelisttask = $1 WHERE idlistTask = $2;`
	_, err := DB.Exec(sqlString, listTask.NameListTask, listTask.IdListTask)
	return err
}

func ListTaskDelete(listTask models.ListTask) error {
	sqlString := `DELETE FROM task WHERE idlistTask = $1`
	_, err := DB.Exec(sqlString, listTask.IdListTask)

	sqlString = `DELETE FROM listTask WHERE idlistTask = $1`
	_, err = DB.Exec(sqlString, listTask.IdListTask)

	return err
}
