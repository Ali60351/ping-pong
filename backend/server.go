package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

func main() {
	app := fiber.New()
	var connection *websocket.Conn

	app.Use("/ws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/connect", func(c *fiber.Ctx) error {
		connection.WriteJSON(&fiber.Map{
			"status": "ready",
		})

		return c.SendString("Done!")
	})

	app.Get("/game", websocket.New(func(c *websocket.Conn) {
		// c.Locals is added to the *websocket.Conn
		log.Println(c.Locals("allowed"))  // true
		log.Println(c.Params("id"))       // 123
		log.Println(c.Query("v"))         // 1.0
		log.Println(c.Cookies("session")) // ""

		connection = c

		// websocket.Conn bindings https://pkg.go.dev/github.com/fasthttp/websocket?tab=doc#pkg-index
		var (
			mt  int
			msg []byte
			err error
		)
		for {
			if mt, msg, err = c.ReadMessage(); err != nil {
				log.Println("read:", err)
				break
			}
			log.Printf("recv: %s", msg)

			if err = c.WriteMessage(mt, msg); err != nil {
				log.Println("write:", err)
				break
			}
		}

	}))

	log.Fatal(app.Listen(":8000"))
	// Access the websocket server: ws://localhost:3000/ws/123?v=1.0
	// https://www.websocket.org/echo.html
}
