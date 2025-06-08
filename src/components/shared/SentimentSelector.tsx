import { Button } from "@/components/ui/button"
import React from "react"

export const sentimentOptions = ["negative", "neutral", "positive"] as const
export type SentimentOption = typeof sentimentOptions[number]

interface SentimentSelectorProps {
  value: SentimentOption
  onChange: (value: SentimentOption) => void
  error?: string
  className?: string
  disabled?: boolean
}

export const SentimentSelector: React.FC<SentimentSelectorProps> = ({
  value,
  onChange,
  error,
  className = "",
  disabled = false
}) => (
  <div className={className}>
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {sentimentOptions.map((sentiment) => (
        <Button
          key={sentiment}
          variant={value === sentiment ? "default" : "ghost"}
          size="sm"
          className="flex-1 min-w-[60px]"
          onClick={() => onChange(sentiment)}
          type="button"
          disabled={disabled}
        >
          {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
        </Button>
      ))}
    </div>
    {error && <div className="text-destructive text-xs mt-1">{error}</div>}
  </div>
) 