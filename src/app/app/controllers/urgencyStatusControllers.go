package controllers

import (
	"app/app/providers"
	"github.com/revel/revel"
)

func (c App) UrgencyAllGet() revel.Result {
	return c.RenderJSON(providers.UrgencyAllGet())
}

func (c App) StatusAllGet() revel.Result {
	return c.RenderJSON(providers.StatusAllGet())
}
