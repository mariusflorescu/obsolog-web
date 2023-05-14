"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import { Icons } from "./ui/icons";

type Props = Omit<ButtonProps, "onClick"> & {
  value: string;
};

export function CopyButton({ value, ...props }: Props) {
  const [copied, setCopied] = useState(false);

  const handleOnClick = useCallback(() => {
    setCopied(true);
    navigator.clipboard.writeText(value);
  }, [value, setCopied]);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  return (
    <Button onClick={handleOnClick} {...props}>
      {copied ? <Icons.clipboardCheck /> : <Icons.clipboardCopy />}
    </Button>
  );
}
