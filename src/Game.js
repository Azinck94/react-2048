import React, { Component } from 'react';
import Score from './Score';
import Board from './Board';
import RestartBtn from './RestartBtn'

class Game extends Component {
  constructor() {
    super()
    this.state = {
      board: [
              2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2
            ],
      curScore: 0,
      highScore: 0,
      win: false,
      gameOver: false
    }

  }
  // method for handling arrow keys + all other keyboard actions
  handleKeyDown(event) {
    event.preventDefault();
    let key = event.keyCode
    let curBoard = this.state.board
    let nextBoard = updateBoard(curBoard, key)
    if (haveNextMove(curBoard)) {
      this.handleScore(nextBoard)
      this.setState({
        board: nextBoard
      })
      this.checkWin()
    } else {
      this.setState({
        gameOver: true
      })
    }
  }

  // handles the current score and high score of the game
  handleScore(nextBoard) {
    this.setState({
      curScore: updatedScore(this.state.board)
    })
    if (this.state.curScore >= this.state.highScore) {
      this.setState({
        highScore: this.state.curScore
      })
    }
  }

  // react way of adding event listner (keydown) to window
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  // react way of removing event listner (keydown) to window cuz react will render things that change
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  restartGame() {
    // console.log('this is newBoard ', newBoard())
    // return ''
    this.setState({
      board: newBoard(),
      curScore: 0
    })
  }

  checkWin() {
    for (let i = 0; i < this.state.board.length; i++) {
      if (this.state.board[i] === 2048) {
        this.setState({
          win: true,
          gameOver: true
        })
      }
    }
  }

  render() {
    return(
      <div className="game">
        <Score type="Current" score={this.state.curScore}/>
        <Score type="High" score={this.state.highScore}/>
        <div className="boardDiv">
          <Board board={this.state.board}/>
        </div>
        <RestartBtn handleRestart={() => this.restartGame()} />
      </div>
    )
  }
}

// turns board array into array with horizontal orientation or vertical orientation
const structuredArray = function (board, key) {
  let newBoard = []
  // horizontal settings
  let times = 15
  let inc = 4
  let next = 1
  // makes vertical settings for change
  if (key === 38 || key === 40) {
    times = 4
    inc = 1
    next = 4
  }
  for (let i = 0; i < times; i+= inc) {
    newBoard.push([board[i], board[i + next], board[i + (next * 2)], board[i + (next * 3)]])
  }
  return newBoard
}

// function to update board by matching pairs and converting it to the right format
const updateBoard = function (board, key) {
  let arrows = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  }
  let arrowKey = arrows[key]
  let modBoard = structuredArray(board, key)
  let boardWithoutZero = removeZero(modBoard)
  let matchedBoard = findMatch(boardWithoutZero, arrowKey)
  let boardWithZero = addZero(matchedBoard, arrowKey)

  if (arrowKey === 'up' || arrowKey === 'down') {
    boardWithZero = verFormatBoard(boardWithZero)
  }

  let flatBoard = boardWithZero.reduce((a, b) => a.concat(b), []);

  if (sameValues(flatBoard, board)) {
    return flatBoard
  }

  let boardWithNewNum = addNewNum(flatBoard)
  return boardWithNewNum
}

// function to add zero the right places after handling matching pairs until there are 4 items in a sub array
const addZero = function (board, key) {
  for (let i = 0; i < board.length; i++) {
    while (board[i].length < 4) {
      if (key === 'right' || key === 'down') {
        board[i].unshift(0)
      } else {
        board[i].push(0)
      }
    }
  }
  return board
}

// removes all the zero in the board
const removeZero = function (board) {
  let newBoard = []
  for (let i = 0; i < board.length; i ++) {
    var row = board[i].filter(function (item) {
      return item !== 0
    })
    newBoard.push(row)
  }
  return newBoard
}

// sums the value of the numbers on the board
const updatedScore = function (newBoard) {
  return newBoard.reduce((sum, value) => sum + value)
  // current approach is to sum the values of the integers on the board
  // in the real game it is a different approach
  // add the new block(s) created to the current score
  // for example is a 4 is created by matching 2 2's, then 4 is added to the current score

}

// function to find matching pairs and sum it into one
// HAZARD: UGLY, LONG, UN DRY CODE UNDER CONSTRUCTION
const findMatch = function (board, key) {
  if (key === 'right' || key === 'down') {
    return matchRightDown(board)
  } else {
    return matchLeftUp(board)
  }
}

const matchRightDown = function (board) {
  for (let i = 0; i < board.length; i++) {
    if (board[i][3] === board[i][2] && board[i][2]) {
      board[i][3] = board[i][3] * 2
      if (board[i][1] === board[i][0] && board[i][0]) {
        board[i][1] = board[i][1] * 2
        board[i].splice(2,1)
        board[i].splice(0,1)
      } else {
        board[i].splice(2,1)
      }
    } else if (board[i][2] === board[i][1] && board[i][1]) {
      board[i][2] = board[i][2] * 2
      board[i].splice(1,1)
    } else if (board[i][1] === board[i][0] && board[i][0]) {
      board[i][1] = board[i][1] * 2
      board[i].splice(0,1)
    }
  }
  return board
}

const matchLeftUp = function (board) {
  for (let i = 0; i < board.length; i++) {
    if (board[i][0] === board[i][1] && board[i][1]) {
      board[i][0] = board[i][0] * 2
      if (board[i][2] === board[i][3] && board[i][3]) {
        board[i][2] = board[i][2] * 2
        board[i].splice(3,1)
        board[i].splice(1,1)
      } else {
        board[i].splice(1,1)
      }
    } else if (board[i][1] === board[i][2] && board[i][2]) {
      board[i][1] = board[i][1] * 2
      board[i].splice(2,1)
    } else if (board[i][2] === board[i][3] && board[i][3]) {
      board[i][2] = board[i][2] * 2
      board[i].splice(3,1)
    }
  }
  return board
}

const verFormatBoard = function (board) {
  let verBoard = [[],[],[],[]]
  for (let i = 0; i < board.length; i++) {
    for (let k = 0; k < board[i].length; k++ ) {
      let item = board[i][k]
      verBoard[k].push(item)
    }
  }
  return verBoard
}

// returns a new board with 2 items (2 or 4) at random places
const newBoard = function () {
  let board = new Array(16).fill(0)
  let ranIndex1 = Math.floor(Math.random() * 16)
  let ranIndex2 = Math.floor(Math.random() * 16)
  // if the two indx are the same assign randIndex2 a new random number until they don't have the same one
  while (ranIndex1 === ranIndex2) {
    ranIndex2 = Math.floor(Math.random() * 16)
  }
  board[ranIndex1] = twoOrFour()
  board[ranIndex2] = twoOrFour()
  return board
}

// returns 2 or 4 with more weight in 2
const twoOrFour = function () {
  let num
  Math.random() >= 0.05 ? num = 2 : num = 4
  return num
}

const addNewNum = function (board) {
  let space = []
  for (let i = 0; i < board.length; i++) {
    if (board[i] === 0) {
      space.push(i)
    }
  }
  let ranIndex = Math.floor(Math.random() * space.length)
  board[space[ranIndex]] = twoOrFour()
  return board
}

const haveNextMove = function (board) {
  let arrows = [37,38,39,40]
  let curBoard = board
  for (let i = 0; i < arrows.length; i++) {
    let nextBoard = updateBoard(board, arrows[i])
    if (!sameValues(curBoard, nextBoard)) {
      return true
    }
  }
  return false
}

// check to see if 2 arrays have the same values for all of the items in the array
const sameValues = function (curBoard, nextBoard) {
  for (let i = 0; i < curBoard.length; i++) {
    if (curBoard[i] !== nextBoard[i]) {
      return false
    }
  }
  return true
}

export default Game;
