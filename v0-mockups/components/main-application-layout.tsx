"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface MainApplicationLayoutProps {
  activePlanName: string | null
  children: React.ReactNode
  onSharePlan?: () => void
}

export default function MainApplicationLayout({ activePlanName, children, onSharePlan }: MainApplicationLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - Fixed Top */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">
          {/* Application Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Tax Scenarios Analyzer</h1>

            {/* Active Plan Name */}
            {activePlanName && (
              <>
                <div className="hidden md:block w-px h-6 bg-border" />
                <div className="text-sm md:text-base text-muted-foreground">
                  <span className="hidden sm:inline">Active Plan: </span>
                  <span className="font-medium text-foreground">{activePlanName}</span>
                </div>
              </>
            )}
          </div>

          {/* Share Plan Button */}
          <Button variant="outline" size="sm" onClick={onSharePlan} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share Plan</span>
            <span className="sm:hidden">Share</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-16 pb-16">
        <div className="h-full">{children}</div>
      </main>

      {/* Footer - Fixed Bottom */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">
          {/* Left side - Copyright and Version */}
          <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground">
            <span>© 2025 Vibe CEO</span>
            <div className="w-px h-4 bg-border" />
            <span>v0.1.0</span>
          </div>

          {/* Right side - Links */}
          <div className="flex items-center gap-4 text-xs md:text-sm">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Disclaimers
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
