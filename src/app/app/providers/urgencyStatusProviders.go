package providers

import (
	"app/app/mappers"
)

func UrgencyAllGet() map[string]interface{} {
	data := make(map[string]interface{})
	urgencyAll, err := mappers.UrgencyAllGet()
	data["error"] = err
	data["data"] = urgencyAll
	return data
}

func StatusAllGet() map[string]interface{} {
	data := make(map[string]interface{})
	statusAll, err := mappers.StatusAllGet()
	data["error"] = err
	data["data"] = statusAll
	return data
}
