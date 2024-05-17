import { useMemo } from "react";
import { useCheckers } from "../hooks"
import { getPieces } from "../utils";
import { nameForState } from "../utils/turnUtilities";

export const StateExplorer = () => {
  const { state } = useCheckers();
  const pieces = useMemo(() => getPieces(state.board), [state.board]);
  return (<div>
    <div>{nameForState(state.turn.type)}</div>
    <div>black tiles left: {pieces.black.length}</div>
    <div>red tiles left: {pieces.red.length}</div>
    <div>turn: {state.turn.count}</div>
  </div>);
}