import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Board, Column } from './entities'

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {

  validate(board: Board) {
    const symbols = [ 'x', 'o', null ]
    return board.length === 7 &&
      board.every(column =>
        column.length === 6 &&
        column.every(symbol => symbols.includes(symbol))
      )
  }
}

export const calculateWinner = (board, playerSymbol) => {
  const symbol = ['x', 'o']
  const slicer = (column, i) => {
    if (column.length === 7)
        if(
            column.slice(0,4).every(cell => (column[i] === cell) && symbol.includes(cell)) ||
            column.slice(1,5).every(cell => (column[i] === cell) && symbol.includes(cell)) ||
            column.slice(2,6).every(cell => (column[i] === cell) && symbol.includes(cell)) ||
            column.slice(3,7).every(cell => (column[i] === cell) && symbol.includes(cell))
    )   return true
    if (column.length === 6)
        if(
            column.slice(0,4).every(cell => (column[i] === cell) && symbol.includes(cell)) ||
            column.slice(1,5).every(cell => (column[i] === cell) && symbol.includes(cell)) ||
            column.slice(2,6).every(cell => (column[i] === cell) && symbol.includes(cell))
        )   return true
    if (column.length === 5)
        if(
            column.slice(0,4).every(cell => (column[i] === cell) && symbol.includes(cell)) ||
            column.slice(1,5).every(cell => (column[i] === cell) && symbol.includes(cell)) 
        )   return true
    if (column.length === 4)
        if(column.slice(0, 4).every(cell => (column[i] === cell) && symbol.includes(cell)))
            return true
}

  const ttbRowCheck = (column, incrementColumn, incrementRow) => {
    const checkItems = []
    column.map((i) => {
        if (board[i+incrementColumn] !== undefined) {
            if (board[incrementColumn+i][incrementRow+i] !== undefined)
            checkItems.push(board[i+incrementColumn][i+incrementRow])
        }
        if ((checkItems.length >= 4) && slicer(checkItems, i))
          return isDiagonal = true
    })
  }

  const bttRowCheck = (column, incrementColumn, incrementRow) => {
    const checkItems = []
    column.map((i) => {
        if (board[incrementColumn-i] !== undefined) {
            if (board[incrementColumn-i][incrementRow+i] !== undefined)
            checkItems.push(board[incrementColumn-i][incrementRow+i])
        }
        if ((checkItems.length >= 4) && slicer(checkItems, i)) 
            return isDiagonal = true
    })
  }

  let isDiagonal

  const diagonalFunction = () => board.map(column => {
    ttbRowCheck(column, 0, 0)
    ttbRowCheck(column, 0, 1)
    ttbRowCheck(column, 0, 2)
    ttbRowCheck(column, 0, 3)
    ttbRowCheck(column, 1, 0)
    ttbRowCheck(column, 2, 0)
    bttRowCheck(column, 6, 0)
    bttRowCheck(column, 6, 1)
    bttRowCheck(column, 6, 2)
    bttRowCheck(column, 5, 0)
    bttRowCheck(column, 4, 0)
    bttRowCheck(column, 3, 0)
  })

  let isVertical

  const verticalFunction = () => board.map(column => {
    column.map((index) => {
        if (
            slicer(column, index)
        ) return isVertical = true
    })
  })

  let isHorizontal

  const checkHorizontal = (column, incrementColumn, incrementRow) => {
      const checkItems = []
      column.map((i) => {
          checkItems.push(board[incrementColumn+i][incrementRow])
          if ((checkItems.length >= 4) && slicer(checkItems, i)){
              return isHorizontal = true
          }
      })
  }

  const horizontalFunction = () => board.map((column, index) => {
    checkHorizontal(column, 0, index)
  })

  horizontalFunction()
  diagonalFunction()
  verticalFunction()
  if ((isVertical || isHorizontal || isDiagonal) === true)
    return playerSymbol

}


export const finished = (board: Board): boolean =>
  board
    .reduce((a,b) => a.concat(b) as Column)
    .every(symbol => symbol !== null)
