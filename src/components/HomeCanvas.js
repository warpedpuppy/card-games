import React from 'react'
import Script from '../animations/homecanvas.script';
import './HomeCanvas.css'
export default class HomeCanvas extends React.Component {
    componentDidMount () {
        Script.init();
    }
    render () {
          return (<div id="home-canvas"></div>)
    }
  
}
