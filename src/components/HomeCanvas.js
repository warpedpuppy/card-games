import React from 'react'
import Script from '../animations/homecanvas.script';
import './HomeCanvas.css'
export default class HomeCanvas extends React.Component {
    componentDidMount () {
        Script.init();
    }
    shuffle = (e) => {
      e.preventDefault();
      Script.shuffle();

    }
    solitaireDeal = (e) => {
      e.preventDefault();
      Script.solitaireDeal();
    }
    render () {
          return (
          <>
          <div id="home-canvas"></div>
          <div id="button-div">
            <button onClick={ this.solitaireDeal }>deal for solitare</button>
            <button onClick={ this.shuffle }>shuffle</button>
            <button disabled>layout</button>
          </div>
          </>
          )
    }
  
}
