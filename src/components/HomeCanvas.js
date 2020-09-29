import React from 'react'
import SolitaireBasic from './SolitaireBasic';
import SolitaireAnimated from './SolitaireAnimated';
import './HomeCanvas.css'
export default class HomeCanvas extends React.Component {
    state = {
      game: "basic"
    }
    changeGame = (e, game) => {
      e.preventDefault();
      this.setState({game})
    }
    render () {
          let game = (this.state.game === "basic") ? <SolitaireBasic /> : <SolitaireAnimated /> ;

          return (
          <>
            <div id="button-div">
              <button 
              disabled={this.state.game === "basic"} 
              onClick={ (e) => this.changeGame(e, "basic") }>basic</button>
              <button  
              disabled={this.state.game === "animated"} 
              onClick={ (e) => this.changeGame(e, "animated") }>animated</button>
            </div>
             { game }
          </>
          )
    }
  
}
