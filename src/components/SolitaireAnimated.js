import React from 'react'
import Script from '../animations/solitaire-animated/shell.script';
import './HomeCanvas.css'
export default class SolitaireAnimated extends React.Component {
    componentDidMount () {
        this.script = new Script();
    }
    componentWillUnmount () {
        console.log('unmount animated')
        this.script.destroy();
    }
    render () {
          return (
          <div id="home-canvas"></div>
          )
    }
  
}
