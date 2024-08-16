import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export default function Pile(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });

  const style = {
    backgroundColor: "#f2f2f3",
    borderRadius: "5px",
    paddingLeft: "19px",
    paddingTop: "23px",
    width: "120px",
    height: "170px",
    margin: "7px",
  }
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children.map((card, index) => (
        <div
          key={index}
          style={{
            position: "relative",
            top: `${index * -121}px`, // Makes it so they appear in a pile
          }}
        >
          {card}
        </div>
      ))}
    </div>
  );
}