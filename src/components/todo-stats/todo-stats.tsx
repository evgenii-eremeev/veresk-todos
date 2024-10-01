import React from "react";

interface Props {
  statsCount: number;
}

export function TodoStats({ statsCount }: Props) {
  return <p className="text-cyan-800">Todos count: {statsCount}</p>;
}
