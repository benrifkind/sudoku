import React from 'react';

// Buttons that control whether to reveal answer
interface RevealerProps {
    handleRevealSquareClick: () => void
    handleRevealBoardClick: () => void
    handleGenerateBoardClick: () => void
    handleCreateBoardClick: () => void
    handleClearBoardClick: () => void
}
export const Revealer = (props: RevealerProps) => (
    <div className="interactBoard">
            <button className="interactButton" onClick={props.handleRevealSquareClick}>Reveal Square</button>
            <button className="interactButton" onClick={props.handleRevealBoardClick}>Reveal Board</button>
            <button className="interactButton" onClick={props.handleGenerateBoardClick}>Generate Board</button>
        <button className="clearButton" onClick={props.handleClearBoardClick}>Clear Board</button>
            <button className="interactButton" onClick={props.handleCreateBoardClick}>Create Board</button>
            
    </div>
)


export default Revealer;
