import React from 'react';

export function TaskListItem({
    text,
    onRemove,
  }: {
    text: string;
    onRemove: () => void;
  }) {
    return (
      <li>
        <span>{text}</span>
        <button onClick={onRemove}>Remove</button>
      </li>
    );
  }
  