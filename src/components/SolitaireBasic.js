import React from 'react'
import Script from '../animations/solitaire-basic/shell.script';
import './HomeCanvas.css'
export default class SolitaireBasic extends React.Component {
    componentDidMount () {
        Script.init();
    }
    componentWillUnmount () {
        console.log('unmount')
        Script.destroy();
    }
    render () {
          return (
          <div id="home-canvas"></div>
          )
    }
  
}
