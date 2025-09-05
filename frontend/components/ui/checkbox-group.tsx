"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { CheckedState } from "@radix-ui/react-checkbox";
import * as React from "react";

interface CheckboxGroupContextValue {
  value: string[];
  onValueChange: (value: string[]) => void;
}

const CheckboxGroupContext = React.createContext<
  CheckboxGroupContextValue | undefined
>(undefined);

export function CheckboxGroup({
  value,
  onValueChange,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value: string[];
  onValueChange: (value: string[]) => void;
}) {
  return (
    <CheckboxGroupContext.Provider value={{ value, onValueChange }}>
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
}

export function CheckboxGroupItem({
  value,
  ...props
}: React.ComponentPropsWithoutRef<typeof Checkbox> & {
  value: string;
}) {
  const context = React.useContext(CheckboxGroupContext);

  if (!context) {
    throw new Error("CheckboxGroupItem must be used within a CheckboxGroup");
  }

  const { value: selectedValues, onValueChange } = context;

  const isSelected = selectedValues.includes(value);

  const handleCheckedChange = (checked: CheckedState) => {
    if (checked) {
      onValueChange([...selectedValues, value]);
    } else {
      onValueChange(selectedValues.filter((v) => v !== value));
    }
  };

  return (
    <Checkbox
      checked={isSelected}
      onCheckedChange={handleCheckedChange}
      {...props}
    />
  );
}
