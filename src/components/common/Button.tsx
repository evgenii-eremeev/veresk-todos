import clsx from "clsx";
import React, { ButtonHTMLAttributes } from "react";
import { PropsWithChildren } from "react";

export function Button(
  props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
) {
  return (
    <button
      {...props}
      className={clsx(
        "border-2 border-black rounded-md p-1 my-1",
        props.className
      )}
    />
  );
}
