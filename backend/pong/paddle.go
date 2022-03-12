package pong

import (
	"image/color"
	"strconv"

	"github.com/hajimehoshi/ebiten"
	"github.com/hajimehoshi/ebiten/inpututil"
	"github.com/hajimehoshi/ebiten/text"
	"golang.org/x/image/font"
)

// Paddle is a pong paddle
type Paddle struct {
	Position
	Score        int
	Speed        float32
	Width        int
	Height       int
	Color        color.Color
	Up           ebiten.Key
	Down         ebiten.Key
	Img          *ebiten.Image
	Pressed      keysPressed
	scorePrinted scorePrinted
}

const (
	InitPaddleWidth  = 20
	InitPaddleHeight = 100
	InitPaddleShift  = 50
)

type keysPressed struct {
	Up   bool
	Down bool
}

type scorePrinted struct {
	score   int
	printed bool
	x       int
	y       int
}

func (p *Paddle) Update(screen *ebiten.Image) {
	_, h := screen.Size()

	if inpututil.IsKeyJustPressed(p.Up) {
		p.Pressed.Down = false
		p.Pressed.Up = true
	} else if inpututil.IsKeyJustReleased(p.Up) || !ebiten.IsKeyPressed(p.Up) {
		p.Pressed.Up = false
	}
	if inpututil.IsKeyJustPressed(p.Down) {
		p.Pressed.Up = false
		p.Pressed.Down = true
	} else if inpututil.IsKeyJustReleased(p.Down) || !ebiten.IsKeyPressed(p.Down) {
		p.Pressed.Down = false
	}

	if p.Pressed.Up {
		p.Y -= p.Speed
	} else if p.Pressed.Down {
		p.Y += p.Speed
	}

	if p.Y-float32(p.Height/2) < 0 {
		p.Y = float32(1 + p.Height/2)
	} else if p.Y+float32(p.Height/2) > float32(h) {
		p.Y = float32(h - p.Height/2 - 1)
	}
}

func (p *Paddle) AiUpdate(b *Ball) {
	// unbeatable haha
	p.Y = b.Y
}

func (p *Paddle) Draw(screen *ebiten.Image, scoreFont font.Face) {
	// draw player's paddle
	pOpts := &ebiten.DrawImageOptions{}
	pOpts.GeoM.Translate(float64(p.X), float64(p.Y-float32(p.Height/2)))
	p.Img.Fill(p.Color)
	screen.DrawImage(p.Img, pOpts)

	// draw player's score if needed
	if p.scorePrinted.score != p.Score && p.scorePrinted.printed {
		p.scorePrinted.printed = false
	}
	if p.scorePrinted.score == 0 && !p.scorePrinted.printed {
		p.scorePrinted.x = int(p.X + (GetCenter(screen).X-p.X)/2)
		p.scorePrinted.y = int(2 * 30)
	}
	if (p.scorePrinted.score == 0 || p.scorePrinted.score != p.Score) && !p.scorePrinted.printed {
		p.scorePrinted.score = p.Score
		p.scorePrinted.printed = true
	}
	s := strconv.Itoa(p.scorePrinted.score)
	text.Draw(screen, s, scoreFont, p.scorePrinted.x, p.scorePrinted.y, p.Color)
}
