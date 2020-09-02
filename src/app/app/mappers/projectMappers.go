package mappers

import (
	"app/app/models"
	"database/sql"
)

func ProjectAllGet() (projectAll []models.Project, err error) {
	sqlString := "SELECT idproject, nameproject, p.idprojectteam, p.nameprojectteam from project LEFT JOIN projectteam p on project.idprojectteam = p.idprojectteam ORDER BY idproject"
	rows, err := DB.Query(sqlString)

	if err == nil {
		for rows.Next() {
			var project models.Project
			var idProjectTeam sql.NullInt64
			var nameProjectTeam sql.NullString
			err := rows.Scan(&project.IdProject, &project.NameProject, &idProjectTeam, &nameProjectTeam)
			if err == nil {
				project.ProjectTeam.IdProjectTeam = idProjectTeam.Int64
				project.ProjectTeam.NameProjectTeam = nameProjectTeam.String
				projectAll = append(projectAll, project)
			}
		}
	}

	return projectAll, err
}

func ProjectGet(idProject int64) (project models.Project, err error) {
	sqlString := "SELECT idproject, nameproject, " +
		"p.idprojectteam, p.nameprojectteam, " +
		"p.idteamlead, firstname, middlename, lastname " +
		"from project " +
		"LEFT JOIN projectteam p on project.idprojectteam = p.idprojectteam " +
		"left join employee e on p.idteamlead = e.idemployee " +
		"WHERE idproject = $1"
	rows, err := DB.Query(sqlString, idProject)
	if err == nil && rows.Next() {
		var idProjectTeam sql.NullInt64
		var nameProjectTeam sql.NullString

		var idTeamLead sql.NullInt64
		var firstName sql.NullString
		var middleName sql.NullString
		var lastName sql.NullString
		err = rows.Scan(&project.IdProject, &project.NameProject,
			&idProjectTeam, &nameProjectTeam,
			&idTeamLead, &firstName, &middleName, &lastName)

		if err == nil {
			project.ProjectTeam = models.ProjectTeam{
				IdProjectTeam:   idProjectTeam.Int64,
				NameProjectTeam: nameProjectTeam.String,
			}

			project.ProjectTeam.TeamLead = models.Employee{
				IdEmployee: idTeamLead.Int64,
				FirstName:  firstName.String,
				MiddleName: middleName.String,
				LastName:   lastName.String,
			}
			return project, err
		}
	}
	return project, err
}

func ProjectGetByProjectTeam(idProjectTeam int64) ([]models.Project, error) {
	sqlString := "SELECT idproject, nameproject from project LEFT JOIN projectteam p on project.idprojectteam = p.idprojectteam WHERE p.idprojectteam = $1"
	rows, err := DB.Query(sqlString, idProjectTeam)

	var projectAll []models.Project

	if err == nil {
		for rows.Next() {
			var project models.Project
			err := rows.Scan(&project.IdProject, &project.NameProject)
			if err == nil {
				projectAll = append(projectAll, project)
			}

		}
	}

	return projectAll, err
}

func ProjectSave(project models.Project) (err error) {
	if project.ProjectTeam.IdProjectTeam == 0 {
		sqlString := `INSERT INTO project (nameproject) VALUES ($1);`
		_, err = DB.Exec(sqlString, project.NameProject)

	} else {
		sqlString := `INSERT INTO project (nameproject, idprojectteam) VALUES ($1, $2);`
		_, err = DB.Exec(sqlString, project.NameProject, project.ProjectTeam.IdProjectTeam)
	}
	return err
}

func ProjectUpdate(project models.Project) (err error) {
	if project.NameProject == "" {
		if project.ProjectTeam.IdProjectTeam != 0 {
			sqlString := `UPDATE project SET idprojectteam = $1 WHERE idproject = $2;`
			_, err = DB.Exec(sqlString, project.ProjectTeam.IdProjectTeam, project.IdProject)
		} else {
			sqlString := `UPDATE project SET idprojectteam = NULL WHERE idproject = $1;`
			_, err = DB.Exec(sqlString, project.IdProject)
		}
	} else {
		sqlString := `UPDATE project SET nameproject = $1 WHERE idproject = $2;`
		_, err = DB.Exec(sqlString, project.NameProject, project.IdProject)
	}
	return err
}

func ProjectDelete(project models.Project) error {
	sqlString := `DELETE FROM project WHERE idproject = $1`
	_, err := DB.Exec(sqlString, project.IdProject)
	return err
}
