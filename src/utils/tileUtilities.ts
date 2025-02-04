import {
  Coord,
  TileData,
  Piece,
  up,
  down,
  startDirection,
  GamePhase
} from '../schema';
import { theme } from '../theme';

export function kingMe(piece: Piece) {
  switch (piece) {
    case Piece.Empty:
      return Piece.Empty;
    case Piece.Black:
    case Piece.BlackKing:
      return Piece.BlackKing;
    case Piece.Red:
    case Piece.RedKing:
      return Piece.RedKing;
  }
}

export function isKing(piece: Piece) {
  return piece === Piece.BlackKing || piece === Piece.RedKing;
}

export function isBlack(piece: Piece) {
  return piece === Piece.Black || piece === Piece.BlackKing;
}

export function isRed(piece: Piece) {
  return piece === Piece.Red || piece === Piece.RedKing;
}

export function isInRouteAlready(tiles: TileData[], coord: Coord) {
  return tiles.some((t) => equalCoords(t.coord, coord));
}

export function equalCoords(coord1: Coord, coord2: Coord): boolean {
  return coord1.x === coord2.x && coord1.y === coord2.y;
}

export function isInBounds(newRow: number, newCol: number, board: Piece[][]): boolean {
  return newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length;
}

export function isOccupiedByOpponent(myPiece: Piece, otherPiece: Piece) {
  switch (myPiece) {
    case Piece.Black:
    case Piece.BlackKing:
      return (otherPiece === Piece.Red || otherPiece === Piece.RedKing);
    case Piece.Red:
    case Piece.RedKing:
      return (otherPiece === Piece.Black || otherPiece === Piece.BlackKing);
    case Piece.Empty:
      return false;
  }
}

export function getDirectionFor(piece: Piece, lastBackDirection: Coord) {
  let directions: Coord[] = [];
  switch (piece) {
    case Piece.Empty:
      return [];
    case Piece.Black:
      directions = up;
      break;
    case Piece.BlackKing:
    case Piece.RedKing:
      directions = [...up, ...down];
      break;
    case Piece.Red:
      directions = down;
      break;
  }

  // if we are a king we filter the direction we came from when doing multiple jumps
  // first itteration the filtering is skipped, by checking against the startDirection
  if (isKing(piece) && !equalCoords(lastBackDirection, startDirection)) {
    directions = directions.filter((item) => item.x !== lastBackDirection.x || item.y !== lastBackDirection.y);
  }
  return directions;
}

export function isTileActive(phase: GamePhase, piece: Piece) {
  if (piece === Piece.Empty) {
    return true;
  }
  switch (phase) {
    case GamePhase.Black:
    case GamePhase.TransitionToBlack:
      return isBlack(piece);
    case GamePhase.Red:
    case GamePhase.TransitionToRed:
      return isRed(piece);
  }
}

export function colorForPiece(piece: Piece) {
  switch (piece) {
    case Piece.Empty:
      return "";
    case Piece.Black:
    case Piece.BlackKing:
      return theme.colors.black;
    case Piece.Red:
    case Piece.RedKing:
      return theme.colors.red;
  }
}

export function nameForTile(piece: Piece) {
  switch (piece) {
    case Piece.Empty:
      return 'empty';
    case Piece.Black:
      return 'black';
    case Piece.BlackKing:
      return 'black-king';
    case Piece.Red:
      return 'red';
    case Piece.RedKing:
      return 'red-king';
  }
}