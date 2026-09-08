"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyButton({ value, label = "Copy address", className }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast({
        title: "Address copied",
        description: `${label} — ready to paste into your wallet.`,
      });
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast({
        title: "Copy failed",
        description: "Clipboard unavailable — select the address manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={copy}
      className={`h-8 gap-1.5 font-mono text-xs ${className ?? ""}`}
      aria-label={label}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
