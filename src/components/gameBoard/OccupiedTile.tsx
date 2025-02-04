import { useCallback, useMemo } from 'react';
import { useCheckers, useLayout } from '../../hooks';
import { Coord, Piece } from '../../schema';
import { theme } from '../../theme';
import { isBlack, isKing } from '../../utils';
import { ReactComponent as PiecesIcon } from '../../assets/icons/pieces.svg';

export type OccupiedTileProps = {
  piece: Piece;
  coord: Coord;
  isDragging: Coord | null;
  isActive: boolean;
  onDragStart: (piece: Piece, coord: Coord) => void;
  onMouseOver: () => void;
};

// a tile with a piece on it, can start the drags from these tiles.
// hover over them to see potential moves.
export const OccupiedTile: React.FC<OccupiedTileProps> = ({
  piece,
  coord,
  isDragging,
  isActive,
  onDragStart,
  onMouseOver
}) => {
  const { state } = useCheckers();
  const { winner } = state;
  const { isConstrainedWidth: isThin, isMobile, isLandscape } = useLayout();
  const shouldFade = isDragging && isDragging.x === coord.x && isDragging.y === coord.y;
  const content = isKing(piece) ? <PiecesIcon /> : <></>;

  const style: React.CSSProperties = useMemo(() => {
    return {
      width: isMobile && isLandscape ? theme.size.tileSizeMobile : isThin ? theme.size.tileSizeMedium : theme.size.tileSize,
      height: isMobile && isLandscape ? theme.size.tileSizeMobile : isThin ? theme.size.tileSizeMedium : theme.size.tileSize,
      backgroundColor: isBlack(piece) ? theme.colors.black : theme.colors.red,
      borderRadius: '50%',
      opacity: shouldFade ? 0.5 : 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      color: isBlack(piece) ? theme.colors.ivory : theme.colors.black,
    };
  }, [isThin, piece, shouldFade, isMobile, isLandscape]);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (isDragging || winner) {
      return;
    }
    e.dataTransfer.setData('isActive', isActive.toString());
    e.dataTransfer.setData('x', coord.x.toString());
    e.dataTransfer.setData('y', coord.y.toString());
    onDragStart(piece, coord);
  }, [isDragging, winner, isActive, piece, coord, onDragStart]);

  const handleTouchStart = useCallback(() => {
    if (!isActive || winner) {
      return;
    }
    onDragStart(piece, coord);
  }, [isActive, winner, piece, coord, onDragStart]);

  return (
    <div
      style={style}
      draggable={isActive && !isDragging}
      onDragStart={handleDragStart}
      onTouchStart={handleTouchStart}
      onMouseMove={onMouseOver}
      onTouchMove={onMouseOver}
    >
      {content}
    </div>
  );
}