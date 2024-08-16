import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

export default function Card(props) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: props.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    maxWidth: '100px', 
    height: '120px',
    cursor: props.draggable ? isDragging ? 'grabbing' : 'grab' : '',
  }

  // Makes the cards not draggable
  if(!props.draggable) {
    return (
      <img
          src={require(`../../card-images/${props.image}.png`)}
          alt={props.id}
          style={style}
      />
    );
  }

  return (
    <img
        ref={setNodeRef}
        src={require(`../../card-images/${props.image}.png`)}
        alt={props.id}
        style={style} {...listeners} {...attributes}
    />
  );
};