import React, { Component } from 'react';
import Score from './Score';
import Board from './Board';

class Game extends Component {
  constructor() {
    super()
    this.state = {
      board: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      curScore: 0,
      highScore: 1
    }
  }
  render() {
    return(
      <div>
        <Score type="Current" score={this.state.curScore}/>
        <Score type="High" score={this.state.highScore}/>
        <Board board={this.state.board}/>
      </div>
    )
  }
}

export default Game;
