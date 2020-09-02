package mappers

import (
	"app/app/models"
	"database/sql"
	"fmt"
)

func TaskGet(idTask int64) (task models.Task, err error) {
	sqlString := "SELECT idtask, formulation, description, position, theoreticalTimeWork, realtimework, l.idlisttask, namelisttask, u.idurgency, nameurgency, s.idstatus, namestatus, e.idemployee, firstname, middlename, lastname FROM task LEFT JOIN listtask l on l.idlisttask = task.idlisttask LEFT JOIN urgency u on u.idurgency = task.idurgency LEFT JOIN status s on s.idstatus = task.idstatus LEFT JOIN employee e on e.idemployee = task.idemployee  WHERE  idtask = $1 ORDER BY idtask"
	rows, err := DB.Query(sqlString, idTask)

	if err == nil && rows.Next() {
		return ScanRows(rows)
	}

	return task, err
}

func TaskGetByListTask(idListTask int64) (tasks []models.Task, err error) {
	sqlString := "SELECT idtask, formulation, description, position, theoreticalTimeWork, realtimework, l.idlisttask, namelisttask, u.idurgency, nameurgency, s.idstatus, namestatus, e.idemployee, firstname, middlename, lastname FROM task LEFT JOIN listtask l on l.idlisttask = task.idlisttask LEFT JOIN urgency u on u.idurgency = task.idurgency LEFT JOIN status s on s.idstatus = task.idstatus LEFT JOIN employee e on e.idemployee = task.idemployee  WHERE  l.idlisttask = $1 ORDER BY idtask"
	rows, err := DB.Query(sqlString, idListTask)
	if err == nil && rows.Next() {
		task, err := ScanRows(rows)
		if err == nil {
			tasks = append(tasks, task)
		}
	}
	return tasks, err
}

func TaskGetByEmployee(idEmployee int64) (tasks []models.Task, err error) {
	sqlString := "SELECT idtask, formulation, description, position, theoreticalTimeWork, realtimework, l.idlisttask, namelisttask, u.idurgency, nameurgency, s.idstatus, namestatus, e.idemployee, firstname, middlename, lastname FROM task LEFT JOIN listtask l on l.idlisttask = task.idlisttask LEFT JOIN urgency u on u.idurgency = task.idurgency LEFT JOIN status s on s.idstatus = task.idstatus LEFT JOIN employee e on e.idemployee = task.idemployee  WHERE  e.idemployee = $1 ORDER BY idtask"
	rows, err := DB.Query(sqlString, idEmployee)

	if err == nil && rows.Next() {
		task, err := ScanRows(rows)
		if err == nil {
			tasks = append(tasks, task)
		}
	}

	return tasks, err
}

func ScanRows(rows *sql.Rows) (task models.Task, err error) {
	var listTask models.ListTask
	var urgency models.Urgency
	var status models.Status
	var idEmployee sql.NullInt64
	var firstName sql.NullString
	var middleName sql.NullString
	var lastName sql.NullString

	err = rows.Scan(
		&task.IdTask, &task.Formulation, &task.Description, &task.Position, &task.TheoreticalTimeWork, &task.RealTimeWork,
		&listTask.IdListTask, &listTask.NameListTask,
		&urgency.IdUrgency, &urgency.NameUrgency,
		&status.IdStatus, &status.NameStatus,
		&idEmployee, &firstName, &middleName, &lastName)

	if err == nil {
		task.ListTask = listTask
		task.Urgency = urgency
		task.Status = status
		task.Employee = models.Employee{
			IdEmployee: idEmployee.Int64,
			FirstName:  firstName.String,
			MiddleName: middleName.String,
			LastName:   lastName.String,
		}
	}
	return task, err
}

func TaskSave(task models.Task) (err error) {
	if task.Employee.IdEmployee == 0 {
		sqlString := `INSERT INTO task (formulation, description, theoreticaltimework, idlisttask, idurgency, idStatus) VALUES ($1, $2, $3, $4, $5, $6);`
		_, err = DB.Exec(sqlString, task.Formulation, task.Description, task.TheoreticalTimeWork,
			task.ListTask.IdListTask, task.Urgency.IdUrgency, task.Status.IdStatus)
	} else {
		sqlString := `INSERT INTO task (formulation, description, theoreticaltimework, idlisttask, idurgency, idStatus, idemployee) VALUES ($1, $2, $3, $4, $5, $6, $7);`
		_, err = DB.Exec(sqlString, task.Formulation, task.Description, task.TheoreticalTimeWork,
			task.ListTask.IdListTask, task.Urgency.IdUrgency, task.Status.IdStatus, task.Employee.IdEmployee)
	}
	return err
}

func TaskUpdate(task models.Task) (err error) {
	fmt.Println(task.Employee)
	if task.Employee.IdEmployee == 0 {
		sqlString := `UPDATE task SET formulation = $1, description = $2, theoreticaltimework = $3, realtimework = $4, 
                	 idurgency  = $5, idStatus = $6, idemployee  = NULL WHERE idtask = $7;`
		_, err = DB.Exec(sqlString, task.Formulation, task.Description, task.TheoreticalTimeWork, task.RealTimeWork,
			task.Urgency.IdUrgency, task.Status.IdStatus, task.IdTask)
		fmt.Println("****************************1")
	} else {
		fmt.Println("****************************")
		fmt.Println(task)
		sqlString := `UPDATE task SET formulation = $1, description = $2, theoreticaltimework = $3, realtimework = $4, 
                	 idurgency  = $5, idStatus = $6, idemployee  = $7 WHERE idtask = $8;`
		_, err = DB.Exec(sqlString, task.Formulation, task.Description, task.TheoreticalTimeWork, task.RealTimeWork,
			task.Urgency.IdUrgency, task.Status.IdStatus, task.Employee.IdEmployee, task.IdTask)
	}
	fmt.Println(err)
	return err
}

func TaskDelete(task models.Task) error {
	sqlString := `DELETE FROM task WHERE idtask = $1`
	_, err := DB.Exec(sqlString, task.IdTask)
	return err
}
