# Pong Exercise

This exercise is given for Full Stack developers interested in a job at Piepacker. The goal will be to re-create the classic pong game from the 1970's. Here is an example of [an implementation of the game in golang, running as a native app](https://github.com/jtestard/go-pong). This native app implementation is a great starting point. In this exercise, we will expand this native app to run using a client server implementation with a ReactJS front end and a golang backend, and construct an online multiplayer application.

### Instructions on the game itself

- You should be able to play two players over the internet

- Player 1 controls a pad using arrow keys (up and down)*.

- Player 2 controls a pad using W (up) and S (down) keys*, on a QWERTY keyboard.

- The ball, gameplay and scoring should match that of the classic pong game. As a reference, you can look at the [golang pong implementation](https://github.com/jtestard/go-pong).

- The frame rate of the game can be from 40 to 60 FPS


*: for this exercise, for simplification, consider that all inputs coming from any web page will redirect to player 1 (arrow up/down) or player 2 (W/S). This way, you don't need to identify players according to web pages.

### Tech instructions

- The game front-end should load on a webpage. You can deploy one for free using firebase hosting, or use any other static site hosting you’d like.

- The game front end is the display, it shows to the player the positions of the ball and pads at any time, and captures inputs to control the pads.

- The game frontend should be written in React. [CRA](https://github.com/facebook/create-react-app) is recommended as a starting point.

- [Redux Toolkit](https://redux-toolkit.js.org/) is recommended for maintaining state, but not required.


- The backend should be written using a golang web server, which you can deploy using google app engine, or any other server of your choice.

- The backend should receive inputs from the players and maintain the authoritative state of the game.

- Beware of CORS (since your server domain name will not match your client domain name).


- We are particular about the programming languages used for this exercise (Javascript with optional Typescript on the front end, Golang on the backend) because you’ll join the company at the stage where we want new hires to hit the ground running, so please stick to those languages.

- I recommend creating [a free google cloud account](https://cloud.google.com/free) and then use it in combination with firebase hosting and google app engine. We do require that the app be hosted online (a localhost server is not enough), because we want to test your skills at deploying apps on the cloud as well.


### Notes and hints:

- The goal of this project is to build an online multiplayer game using the technologies commonly used at Piepacker.

- There is no particular instructions regarding the looks (esthetics) of the game, use your imagination to do your favorite version!

- To communicate 1) the inputs from the front end to the backend and 2) the state of the game from the backend to the front end, [websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) are recommended.

- You can use any javascript or golang library you want.

- For the mathematical functions to determine the next position of the pad and the ball, no need to reinvent the wheel, you can look at the code of the [golang native app implementation](https://github.com/jtestard/go-pong). The goal here is to test react and golang ability.

- To clarify, the state of the game (i.e. the position of the two pads, the ball and the score) can be stored on the backend, which can then play out one iteration of the game (one "frame"), in order to compute the next position of the ball, pads and score. While the backend could figure out the next position of the ball by itself, it cannot figure out the next position of the pads without knowing whether the arrow keys or W/S keys are pressed. This information can be communicated from the webclient to the server via websockets.


### Timeline

There is no strict deadline for the project. However we recommend two to three weeks.

### Submission

You can submit by 1) hosting the app online 2) host your project in a github or gitlab private repo (or send the code in a zip file). And finally share both URLs in an email to jules@piepacker.com.

### Questions?

Feel free to ask as many questions as you'd like at [jules@piepacker.com](mailto:jules@piepacker.com) !