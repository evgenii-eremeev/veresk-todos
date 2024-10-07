import React from 'react';

export function TaskListItem({
    text,
    onRemove,
  }: {
    text: string;
    onRemove: () => void;
  }) {
    return (
      <li className="m-4">
        <span>{text}</span>
        <button className="mx-2 border-2 border-black rounded-md px-1 text-sm" onClick={onRemove}>Delete</button>
      </li>
    );
  }
  