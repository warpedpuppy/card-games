import React from 'react'
import Script from '../animations/solitaire-animated/shell.script';
import './HomeCanvas.css'
export default class SolitaireAnimated extends React.Component {
    componentDidMount () {
        Script.init();
    }
    componentWillUnmount () {
        console.log('unmount animated')
        Script.destroy();
    }
    render () {
          return (
          <div id="home-canvas"></div>
          )
    }
  
}
