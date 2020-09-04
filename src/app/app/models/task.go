package models
import "time"

type Task struct {
	IdTask              int64    `json:"idTask"`
	Formulation         string   `json:"formulation"`
	Description         string   `json:"description"`
	Position            int      `json:"position"`
	TheoreticalTimeWork float64  `json:"theoreticalTimeWork"`
	RealTimeWork        float64  `json:"realTimeWork"`
	DateExecution       time.Time `json:"dateExecution"`
	ListTask            ListTask `json:"listTask"`
	Urgency             Urgency  `json:"urgency"`
	Status              Status   `json:"status"`
	Employee            Employee `json:"employee"`
}
