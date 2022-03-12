import ReactDOM from 'react-dom'

import Game from './components/Game';
import './index.css';

import { Provider } from 'react-redux'
import store from './store'



ReactDOM.render(
  <Provider store={store}>
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
    </div>
  </Provider>,
  document.getElementById('root'),
)