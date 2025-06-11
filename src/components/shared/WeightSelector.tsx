import { Button } from "@/components/ui/button"
import React from "react"
import { LowImportanceIcon, MediumImportanceIcon, HighImportanceIcon, CriticalImportanceIcon } from "@/components/icons/ImportanceLevelIcons"

export const weightOptions = ["Critical", "High", "Medium", "Low"] as const
export type WeightOption = typeof weightOptions[number]

const weightIcons: Record<WeightOption, React.ReactNode> = {
  Low: <LowImportanceIcon className="h-4 w-4 mr-1" />,
  Medium: <MediumImportanceIcon className="h-4 w-4 mr-1" />,
  High: <HighImportanceIcon className="h-4 w-4 mr-1" />,
  Critical: <CriticalImportanceIcon className="h-4 w-4 mr-1" />
}

interface WeightSelectorProps {
  value: WeightOption
  onChange: (value: WeightOption) => void
  error?: string
  className?: string
  disabled?: boolean
}

export const WeightSelector: React.FC<WeightSelectorProps> = ({
  value,
  onChange,
  error,
  className = "",
  disabled = false
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
          disabled={disabled}
        >
          <div className="flex items-center justify-center">
            {weightIcons[weight]}
            {weight}
          </div>
        </Button>
      ))}
    </div>
    {error && <div className="text-destructive text-xs mt-1">{error}</div>}
  </div>
) 