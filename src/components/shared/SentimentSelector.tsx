import { Button } from "@/components/ui/button"
import React from "react"

export const sentimentOptions = ["Negative", "Neutral", "Positive"] as const
export type SentimentOption = typeof sentimentOptions[number]

const defaultLabels: Record<SentimentOption, string> = {
  Negative: "Negative",
  Neutral: "Neutral",
  Positive: "Positive"
}

interface SentimentSelectorProps {
  value: SentimentOption
  onChange: (value: SentimentOption) => void
  error?: string
  className?: string
  disabled?: boolean
  labels?: Partial<Record<SentimentOption, string>>
}

export const SentimentSelector: React.FC<SentimentSelectorProps> = ({
  value,
  onChange,
  error,
  className = "",
  disabled = false,
  labels = {}
}) => {
  const displayLabels = { ...defaultLabels, ...labels }
  const orderedOptions: SentimentOption[] = ["Positive", "Negative", "Neutral"]

  return (
    <div className={className}>
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        {orderedOptions.map((sentiment) => (
          <Button
            key={sentiment}
            variant={value === sentiment ? "default" : "ghost"}
            size="sm"
            className="flex-1 min-w-[60px]"
            onClick={() => onChange(sentiment)}
            type="button"
            disabled={disabled}
          >
            {displayLabels[sentiment]}
          </Button>
        ))}
      </div>
      {error && <div className="text-destructive text-xs mt-1">{error}</div>}
    </div>
  )
} 