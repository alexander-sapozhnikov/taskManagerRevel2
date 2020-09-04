package mappers

import (
	"app/app/models"
	"database/sql"
	"fmt"
	"log"
)

func ProjectTeamAllGet() (projectTeamAll []models.ProjectTeam, err error) {
	sqlString := "SELECT idprojectteam, nameprojectteam, e.idemployee, e.firstname, e.middlename, e.lastname FROM projectteam LEFT JOIN employee e on e.idemployee = projectteam.idteamlead ORDER BY idprojectteam"
	rows, err := DB.Query(sqlString)
	log.Println(rows)

	if err == nil {
		for rows.Next() {
			projectTeam, err := scanRows(rows)
			if err == nil {
				projectTeamAll = append(projectTeamAll, projectTeam)
			}
		}
	}

	return projectTeamAll, err
}

func ProjectTeamGet(idProjectTeam int64) (projectTeam models.ProjectTeam, err error) {
	sqlString := "SELECT idprojectteam, nameprojectteam, e.idemployee, e.firstname, e.middlename, e.lastname FROM  projectTeam left join employee e on e.idemployee = projectteam.idteamlead WHERE  idprojectTeam = $1"
	rows, err := DB.Query(sqlString, idProjectTeam)

	if err == nil && rows.Next() {
		projectTeam, err = scanRows(rows)
	}
	return projectTeam, err
}

func scanRows(rows *sql.Rows) (projectTeam models.ProjectTeam, err error){
	var idTeamLead sql.NullInt64
	var firstName sql.NullString
	var middleName sql.NullString
	var lastName sql.NullString
	err = rows.Scan(
		&projectTeam.IdProjectTeam, &projectTeam.NameProjectTeam,
		&idTeamLead, &firstName, &middleName, &lastName)

	if err == nil {
		projectTeam.TeamLead = models.Employee{
			IdEmployee: idTeamLead.Int64,
			FirstName: firstName.String,
			MiddleName: middleName.String,
			LastName: lastName.String,
		}
		return projectTeam, err
	}

	fmt.Println(err)
	return projectTeam, err
}

func ProjectTeamSave(projectTeam models.ProjectTeam) (err error) {
	if projectTeam.TeamLead.IdEmployee == 0 {
		sqlString := `INSERT INTO projectteam (nameprojectteam) VALUES ($1);`
		_, err = DB.Exec(sqlString, projectTeam.NameProjectTeam)

	} else {
		sqlString := `INSERT INTO projectteam (nameprojectteam, idteamlead) VALUES ($1, $2);`
		_, err = DB.Exec(sqlString, projectTeam.NameProjectTeam, projectTeam.TeamLead.IdEmployee)
	}
	return err
}

func ProjectTeamUpdate(projectTeam models.ProjectTeam) error {
	sqlString := `UPDATE projectTeam SET idteamlead = $1 WHERE idprojectTeam = $2;`
	_, err := DB.Exec(sqlString, projectTeam.TeamLead.IdEmployee, projectTeam.IdProjectTeam)
	return err
}

func ProjectTeamDelete(projectTeam models.ProjectTeam) error {
	sqlString := `DELETE FROM projectTeam WHERE idprojectTeam = $1`
	_, err := DB.Exec(sqlString, projectTeam.IdProjectTeam)
	return err
}
