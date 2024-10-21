import React, { useState } from "react";
import { Button } from "./Button";

interface Props {
  mainLabel: string;
  secondaryLabel: string;
  inputLabel: string;
  onSubmit: (topic: string) => void;
  rootClassName?: string;
  mainButtonClassName?: string;
  inputClassName?: string;
  secondaryButtonClassName?: string;
}

export function ModalLike({
  mainLabel,
  secondaryLabel,
  inputLabel,
  onSubmit,
  rootClassName,
  mainButtonClassName,
  inputClassName,
  secondaryButtonClassName,
}: Props) {
  const [showInput, setShowInput] = useState(false);
  const [draft, setDraft] = useState("");
  return (
    <>
      {!showInput && (
        <Button className={mainButtonClassName} onClick={() => setShowInput(true)}>{mainLabel}</Button>
      )}
      {showInput && (
        <form
          className="mx-2"
          role="form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(draft);
            setShowInput(false);
            setDraft("");
          }}
        >
          <label className="hidden" htmlFor={`${mainLabel}-input`}>
            {inputLabel}
          </label>
          <input
            autoFocus
            id={`${mainLabel}-input`}
            onChange={(event) => {
              setDraft(event.target.value);
            }}
          />
          <Button type="submit" disabled={!draft}>
            {secondaryLabel}
          </Button>
        </form>
      )}
    </>
  );
}
