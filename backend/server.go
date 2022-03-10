package main

import (
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()
	playerCount := 0

	app.Get("/", func(c *fiber.Ctx) error {
		responseBody := &fiber.Map{
			"playerCount": playerCount,
		}

		return c.JSON(responseBody)
	})

	app.Get("/connect", func(c *fiber.Ctx) error {
		playerCount += 1

		responseBody := &fiber.Map{
			"playerCount": playerCount,
		}

		return c.JSON(responseBody)
	})

	app.Listen(":3000")
}
