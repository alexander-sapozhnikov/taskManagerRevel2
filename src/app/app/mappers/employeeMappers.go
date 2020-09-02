package mappers

import (
	"app/app/models"
)

func EmployeeAllGet() (employees []models.Employee, err error) {
	sqlString := "SELECT * FROM employee ORDER BY idemployee"
	rows, err := DB.Query(sqlString)

	if err == nil {
		for rows.Next() {
			var employee models.Employee
			err = rows.Scan(&employee.IdEmployee, &employee.FirstName, &employee.MiddleName, &employee.LastName)
			if err == nil {
				employees = append(employees, employee)
			}
		}
	}

	return employees, err
}

func EmployeeGet(idEmployee int64) (currentEmployee models.Employee, err error) {
	sqlString := "SELECT * FROM  employee WHERE  idemployee = $1"
	rows, err := DB.Query(sqlString, idEmployee)

	if err == nil && rows.Next() {
		var employee models.Employee
		err = rows.Scan(&employee.IdEmployee, &employee.FirstName, &employee.MiddleName, &employee.LastName)
		if err == nil {
			return employee, err
		}
	}

	return currentEmployee, err
}

func EmployeeGetByProjectTeam(idProjectTeam int64) ([]models.Employee, error) {
	sqlString := "SELECT e.idemployee, firstname, middlename, lastname FROM employee left join employeeandprojectteam e on employee.idemployee = e.idemployee WHERE idprojectteam = $1"
	rows, err := DB.Query(sqlString, idProjectTeam)
	var employeeAll []models.Employee

	if err == nil {
		for rows.Next() {
			var employee models.Employee
			err = rows.Scan(&employee.IdEmployee, &employee.FirstName, &employee.MiddleName, &employee.LastName)
			if err == nil {
				employeeAll = append(employeeAll, employee)
			}
		}
	}
	return employeeAll, err
}

func EmployeeSave(employee models.Employee) error {
	sqlString := `INSERT INTO employee (firstname, middlename, lastname) VALUES ($1, $2, $3);`
	_, err := DB.Exec(sqlString, employee.FirstName, employee.MiddleName, employee.LastName)
	return err
}

func EmployeeUpdate(employee models.Employee) error {
	sqlString := `UPDATE employee SET firstname = $1, middlename = $2, lastname = $3 WHERE idemployee = $4;`
	_, err := DB.Exec(sqlString, employee.FirstName, employee.MiddleName, employee.LastName, employee.IdEmployee)
	return err
}

func EmployeeDelete(employee models.Employee) error {
	sqlString := `DELETE FROM employee WHERE idemployee = $1`
	_, err := DB.Exec(sqlString, employee.IdEmployee)
	return err
}
