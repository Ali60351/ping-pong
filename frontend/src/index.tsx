import ReactDOM from 'react-dom'

import Game from './Game';
import './index.css';

ReactDOM.render(
  <div
    style={{
      position: "relative",
      width: "800px",
      height: "600px",
      backgroundColor: "#222",
      display: "flex",
      justifyContent: "center",
      border: "15px solid #333"
    }}
  >
    <Game />
  </div>,
  document.getElementById('root'),
)