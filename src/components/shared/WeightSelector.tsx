import { Button } from "@/components/ui/button"
import React from "react"

export const weightOptions = ["Low", "Medium", "High", "Critical"] as const
export type WeightOption = typeof weightOptions[number]

interface WeightSelectorProps {
  value: WeightOption
  onChange: (value: WeightOption) => void
  error?: string
  className?: string
}

export const WeightSelector: React.FC<WeightSelectorProps> = ({
  value,
  onChange,
  error,
  className = ""
}) => (
  <div className={className}>
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {weightOptions.map((weight) => (
        <Button
          key={weight}
          variant={value === weight ? "default" : "ghost"}
          size="sm"
          className="flex-1 min-w-[60px]"
          onClick={() => onChange(weight)}
          type="button"
        >
          {weight}
        </Button>
      ))}
    </div>
    {error && <div className="text-destructive text-xs mt-1">{error}</div>}
  </div>
) 