package main

import (
	"fmt"
	"net/http"
	"os"
	"github.com/gin-gonic/gin"
	"github.com/newrelic/go-agent"
	"github.com/newrelic/go-agent/_integrations/nrgin/v1"
)

func main() {
	router := gin.Default()

	if newrelic_key := os.Getenv("NEW_RELIC_LICENSE_KEY"); "" != newrelic_key {
		app_name := os.Getenv("NEW_RELIC_APP_NAME")
		cfg := newrelic.NewConfig(app_name, newrelic_key)
		cfg.Logger = newrelic.NewDebugLogger(os.Stdout)
		app, err := newrelic.NewApplication(cfg)
		if nil != err {
			fmt.Println(err)
			os.Exit(1)
		}
		router.Use(nrgin.Middleware(app))
	}

	router.OPTIONS("/", func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "POST")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		c.Header("Access-Control-Max-Age", "3600")
		c.Status(http.StatusNoContent)
	})
	router.POST("/", Endpoint)

	router.Run()
}
