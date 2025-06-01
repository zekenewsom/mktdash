import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export const Tooltip = ({ children, content, side = "top", align = "center", ...props }: {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}) => (
  <TooltipPrimitive.Provider>
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        side={side}
        align={align}
        className="z-50 rounded bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md animate-in fade-in-0"
        {...props}
      >
        {content}
        <TooltipPrimitive.Arrow className="fill-popover" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
);
