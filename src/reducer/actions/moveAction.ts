import { BoardState, Coord, Outcome, MoveResult, Piece, TileData } from "../../schema";
import { checkForWinner, isBlack, isJumpPossible, reducePhase, updateBoard, wasLastMove } from "../../utils";
import { next } from "../../utils";
import { ActionType } from "./action";

export interface MovePieceAction {
  type: ActionType.MOVE_PIECE;
  from: Coord;
  to: Coord;
  piece: Piece;
  potentials: Outcome[];
  result: MoveResult;
  timestamp: string;
}

export const handleMovePieceAction = (state: BoardState, action: MovePieceAction) => {
  const { from, to, result } = action;
  const { board, turn, transformations } = state;
  const { message, myMove } = validateMovePieceAction(state, action);

  // failed validation
  if (!myMove) {
    console.log(message);
    return { ...state, message } as BoardState;
  }

  // update the board state
  const newBoard = updateBoard(board, from, to, myMove);

  // check win conditions
  const winner = checkForWinner(newBoard);
  if (winner) {

    return {
      ...state,
      board: newBoard,
      winner,
      turn,
      moveHistory: [...transformations, action],
      lock: { piece: Piece.Empty, coord: { x: -1, y: -1 } },
      message: `${isBlack(winner) ? "Black" : "Red"} Wins!`
    } as BoardState;
  }

  // check if theres an additional move available before before swapping the turn over (with this piece)
  let isFinished = wasLastMove(newBoard, result, to)

  // if you do an incomplete move, a lock gets set, since your turn could continue, 
  // you must continue moving that tile.
  const myTile: TileData = { piece: myMove.piece, coord: { x: to.x, y: to.y } };
  const nextTurn = next({ phase: reducePhase(turn.phase), count: turn.count });
  const newState: BoardState = {
    ...state,
    board: newBoard,
    turn: isFinished ? nextTurn : turn,
    transformations: [...transformations, action],
    lock: isFinished ? null : myTile,
    message: null,
  };

  // TODO: remove logging
  console.log(newState);
  return newState;
};

export function validateMovePieceAction(state: BoardState, action: MovePieceAction): { message?: string, myMove?: Outcome } {
  const { from, result, potentials, to, piece } = action;
  const { board } = state;
  // checks for any outstanding locks.
  if (state.lock && (state.lock.coord.x !== from.x || state.lock.coord.y !== from.y)) {
    return { message: 'Keep going you have another jump with the peice you already moved.' };
  }

  try {
    // if you moved a piece (aka a shift), we must check if there was 
    // a jump possible cause it could be an invalid move.
    const isJumpAvailable = isJumpPossible(board, piece);
    if (result === MoveResult.Shift && isJumpAvailable) {
      return { message: 'A jump is possible find it.' };
    }
  } catch (e) {
    console.error("Error attempting to check if a jump is possible.", e);
  }

  // validate step (move should be one of the valid ones for this piece potentials);
  const myMove = potentials.find((p) => p.coord.x === to.x && p.coord.y === to.y);
  if (!myMove) {
    return { message: 'Invalid move.' };
  }
  return { myMove }
}


