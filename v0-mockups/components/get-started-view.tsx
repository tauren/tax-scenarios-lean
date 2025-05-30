"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FilePlus2, Plane, Building } from "lucide-react"

interface GetStartedViewProps {
  onSelectTemplate: (templateId: "blank" | "example-portugal" | "example-dubai") => void
}

export default function GetStartedView({ onSelectTemplate }: GetStartedViewProps) {
  const templateCards = [
    {
      id: "blank" as const,
      title: "Start with a Blank Plan",
      description: "Build your financial and lifestyle plan from scratch.",
      icon: FilePlus2,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      id: "example-portugal" as const,
      title: "Explore a Portugal NHR Plan",
      description: "See a sample plan for leveraging capital gains benefits under Portugal's NHR scheme.",
      icon: Plane,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      id: "example-dubai" as const,
      title: "Explore a Dubai, UAE Plan",
      description: "Analyze a scenario for a zero-tax residency in Dubai for capital gains planning.",
      icon: Building,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-6xl">
        {/* Heading & Welcome Message */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How would you like to begin?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose a pre-built example to explore the features, or start with a blank slate to create your own custom
            plan.
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templateCards.map((template) => {
            const IconComponent = template.icon
            return (
              <Card
                key={template.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/20 group"
                onClick={() => onSelectTemplate(template.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div
                      className={`p-3 rounded-lg ${template.iconBg} group-hover:scale-110 transition-transform duration-200`}
                    >
                      <IconComponent className={`h-6 w-6 ${template.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {template.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-base leading-relaxed">{template.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Help Text */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Don't worry - you can always modify your plan or switch between examples later.
          </p>
        </div>
      </div>
    </div>
  )
}
