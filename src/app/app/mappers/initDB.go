package mappers

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"github.com/revel/revel"
	"log"
	"os"
)

var DB *sql.DB

func InitDB() {
	logFile, _ := os.OpenFile("logFile", os.O_RDWR | os.O_CREATE | os.O_APPEND, 0666)
	log.SetOutput(logFile)

	connstring := fmt.Sprintf("user=%s password='%s' dbname=%s sslmode=disable", "postgres", "1", "postgres")

	var err error

	DB, err = sql.Open("postgres", connstring)
	log.Println(connstring)

	if err != nil {
		log.Println("DB Error", err)
	} else {
		log.Println("DB Connected")
	}
}

func init() {
	revel.OnAppStart(InitDB)
}