package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/hajimehoshi/ebiten"
	"github.com/hajimehoshi/ebiten/inpututil"
	"github.com/jtestard/go-pong/pong"
)

// Game is the structure of the game state
type Game struct {
	state    pong.GameState
	ball     *pong.Ball
	Player1  *pong.Paddle
	Player2  *pong.Paddle
	rally    int
	level    int
	maxScore int
}

const (
	initBallVelocity = 5.0
	initPaddleSpeed  = 10.0
	speedUpdateCount = 6
	speedIncrement   = 0.5
)

const (
	windowWidth  = 800
	windowHeight = 600
)

var connection *websocket.Conn
var gameState *Game

// NewGame creates an initializes a new game
func NewGame() *Game {
	g := &Game{}
	g.init()
	return g
}

func (g *Game) init() {
	g.state = pong.StartState
	g.maxScore = 11

	g.Player1 = &pong.Paddle{
		Position: pong.Position{
			X: pong.InitPaddleShift,
			Y: float32(windowHeight / 2)},
		Score:  0,
		Speed:  initPaddleSpeed,
		Width:  pong.InitPaddleWidth,
		Height: pong.InitPaddleHeight,
		Color:  pong.ObjColor,
		Up:     ebiten.KeyUp,
		Down:   ebiten.KeyDown,
	}
	g.Player2 = &pong.Paddle{
		Position: pong.Position{
			X: windowWidth - pong.InitPaddleShift - pong.InitPaddleWidth,
			Y: float32(windowHeight / 2)},
		Score:  0,
		Speed:  initPaddleSpeed,
		Width:  pong.InitPaddleWidth,
		Height: pong.InitPaddleHeight,
		Color:  pong.ObjColor,
		Up:     ebiten.KeyW,
		Down:   ebiten.KeyS,
	}
	g.ball = &pong.Ball{
		Position: pong.Position{
			X: float32(windowWidth / 2),
			Y: float32(windowHeight / 2)},
		Radius:    pong.InitBallRadius,
		Color:     pong.ObjColor,
		XVelocity: initBallVelocity,
		YVelocity: initBallVelocity,
	}
	g.level = 0
	g.ball.Img, _ = ebiten.NewImage(int(g.ball.Radius*2), int(g.ball.Radius*2), ebiten.FilterDefault)
	g.Player1.Img, _ = ebiten.NewImage(g.Player1.Width, g.Player1.Height, ebiten.FilterDefault)
	g.Player2.Img, _ = ebiten.NewImage(g.Player2.Width, g.Player2.Height, ebiten.FilterDefault)

	pong.InitFonts()
}

func (g *Game) reset(screen *ebiten.Image, state pong.GameState) {
	w, _ := screen.Size()
	g.state = state
	g.rally = 0
	g.level = 0
	if state == pong.StartState {
		g.Player1.Score = 0
		g.Player2.Score = 0
	}
	g.Player1.Position = pong.Position{
		X: pong.InitPaddleShift, Y: pong.GetCenter(screen).Y}
	g.Player2.Position = pong.Position{
		X: float32(w - pong.InitPaddleShift - pong.InitPaddleWidth), Y: pong.GetCenter(screen).Y}
	g.ball.Position = pong.GetCenter(screen)
	g.ball.XVelocity = initBallVelocity
	g.ball.YVelocity = initBallVelocity
}

// Update updates the game state
func (g *Game) Update(screen *ebiten.Image) error {
	switch g.state {
	case pong.StartState:
		if inpututil.IsKeyJustPressed(ebiten.KeySpace) {
			g.state = pong.PlayState
		}

	case pong.PlayState:
		w, _ := screen.Size()

		g.Player1.Update(screen)
		g.Player2.Update(screen)

		xV := g.ball.XVelocity
		g.ball.Update(g.Player1, g.Player2, screen)
		// rally count
		if xV*g.ball.XVelocity < 0 {
			// score up when ball touches human player's paddle
			if g.ball.X < float32(w/2) {
				g.Player1.Score++
			}

			g.rally++

			// spice things up
			if (g.rally)%speedUpdateCount == 0 {
				g.level++
				g.ball.XVelocity += speedIncrement
				g.ball.YVelocity += speedIncrement
				g.Player1.Speed += speedIncrement
				g.Player2.Speed += speedIncrement
			}
		}

		if g.ball.X < 0 {
			g.Player2.Score++
			g.reset(screen, pong.StartState)
		} else if g.ball.X > float32(w) {
			g.Player1.Score++
			g.reset(screen, pong.StartState)
		}

		if g.Player1.Score == g.maxScore || g.Player2.Score == g.maxScore {
			g.state = pong.GameOverState
		}

	case pong.GameOverState:
		if inpututil.IsKeyJustPressed(ebiten.KeySpace) {
			g.reset(screen, pong.StartState)
		}
	}

	g.Draw(screen)

	return nil
}

// Draw updates the game screen elements drawn
func (g *Game) Draw(screen *ebiten.Image) error {
	// screen.Fill(pong.BgColor)

	// pong.DrawCaption(g.state, pong.ObjColor, screen)
	// pong.DrawBigText(g.state, pong.ObjColor, screen)
	// g.player1.Draw(screen, pong.ArcadeFont)
	// g.player2.Draw(screen, pong.ArcadeFont)
	// g.ball.Draw(screen)

	if connection != nil {
		connection.WriteJSON(&fiber.Map{
			"playerOne": 300 - int(g.Player1.Y),
			"playerTwo": 300 - int(g.Player2.Y),
			"ball":      [2]int{int(g.ball.X) - 390, 300 - int(g.ball.Y)},
		})
	}

	// ebitenutil.DebugPrint(screen, fmt.Sprintf("TPS: %0.2f", ebiten.CurrentTPS()))

	return nil
}

// Layout sets the screen layout
func (g *Game) Layout(outsideWidth, outsideHeight int) (int, int) {
	return windowWidth, windowHeight
}

func launchGame() {
	gameState = NewGame()

	ebiten.SetMaxTPS(30)
	ebiten.SetRunnableOnUnfocused(true)

	if err := ebiten.RunGame(gameState); err != nil {
		panic(err)
	}
}

func runServer() {
	app := fiber.New()

	app.Use("/ws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	// app.Get("/connect", func(c *fiber.Ctx) error {
	// 	connection.WriteJSON(&fiber.Map{
	// 		"status": "ready",
	// 	})

	// 	return c.SendString("Done!")
	// })

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

			log.Print(mt)
			log.Printf("recv: %s", msg)

			switch string(msg) {
			case "SPACE":
				gameState.state = pong.PlayState
			case "P1_UP_SET":
				gameState.Player1.Pressed.Up = true
				gameState.Player1.Pressed.Down = false
			case "P1_UP_UNSET":
				gameState.Player1.Pressed.Up = false
			case "P1_DOWN_SET":
				gameState.Player1.Pressed.Up = false
				gameState.Player1.Pressed.Down = true
			case "P1_DOWN_UNSET":
				gameState.Player1.Pressed.Down = false
			case "P2_UP_SET":
				gameState.Player2.Pressed.Up = true
				gameState.Player2.Pressed.Down = false
			case "P2_UP_UNSET":
				gameState.Player2.Pressed.Up = false
			case "P2_DOWN_SET":
				gameState.Player2.Pressed.Up = false
				gameState.Player2.Pressed.Down = true
			case "P2_DOWN_UNSET":
				gameState.Player2.Pressed.Down = false
			default:
				log.Printf("Unhandled message: %s", msg)
			}

			// if err = c.WriteMessage(mt, msg); err != nil {
			// 	log.Println("write:", err)
			// 	break
			// }
		}

	}))

	log.Fatal(app.Listen(":8000"))
}

func main() {
	go runServer()
	launchGame()
}
