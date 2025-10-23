"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

function Accordion({
  ...rest
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...rest} />;
}

function AccordionItem({
  className,
  ...rest
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "bg-background rounded-xl border-b last:border-b-0",
        "shadow-[0px_6px_21px_0px_var(--tw-shadow-color)] shadow-black/25",
        className,
      )}
      {...rest}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...rest
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 group flex flex-1 items-center justify-between gap-4 rounded-md p-4 text-left outline-none transition-all hover:cursor-pointer focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...rest}
      >
        {children}
        <span className="relative flex items-center justify-center size-7 shrink-0">
          <Plus size={32} className="text-black pointer-events-none absolute inset-0 scale-100 opacity-100 transition-all duration-200 group-data-[state=open]:scale-0 group-data-[state=open]:opacity-0" />
          <Minus size={32} className="text-black pointer-events-none absolute inset-0 scale-0 opacity-0 transition-all duration-200 group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...rest
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden font-normal"
      {...rest}
    >
      <div className={cn("p-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
