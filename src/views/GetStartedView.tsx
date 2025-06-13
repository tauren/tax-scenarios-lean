import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Globe2, Home, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { appConfigService } from "@/services/appConfigService";
import { useUserAppState } from "@/store/userAppStateSlice";

export function GetStartedView() {
  const { activePlanInternalName, scenarios } = useUserAppState();
  const navigate = useNavigate();
  const { examplePlans } = appConfigService.getConfig();

  const handlePlanSelect = (planDataParam: string) => {
    if (planDataParam) {
      // Navigate to root with planData parameter
      navigate(`/?planData=${planDataParam}`);
    } else {
      // For blank plan, initialize empty state and go to overview
      navigate("/overview");
    }
  };

  return (
    <div className="bg-background flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-6xl">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How would you like to begin?
          </h1>
        </div>

        {/* Current Plan Section */}
        {activePlanInternalName && (
          <>
            <p className="text-lg text-muted-foreground text-center mb-6">
              Continue where you left off...
            </p>      
            <div className="mb-8">
              <Card
                className="py-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 border-primary/20 bg-primary/5 group"
                onClick={() => navigate("/overview")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Continue with Current Comparison</span>
                    <ArrowRight className="h-5 w-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform duration-200">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {activePlanInternalName}
                      </div>
                      <p className="text-muted-foreground">
                        {scenarios.length} {scenarios.length === 1 ? 'scenario' : 'scenarios'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Example Plans Section */}
        <div className="mb-8">
          <p className="text-lg text-muted-foreground text-center mb-6">
            Choose from pre-built example comparisons to explore the features...
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examplePlans.map((plan) => {
              // Map plan IDs to icons
              const iconMap: Record<string, typeof FileText> = {
                blank: FileText,
                carribean: Globe2,
                // Add more mappings as needed
              };
              const IconComponent = iconMap[plan.id] || Home;

              // Map plan IDs to colors
              const colorMap: Record<string, { icon: string; bg: string }> = {
                blank: { icon: "text-blue-600", bg: "bg-blue-50" },
                carribean: { icon: "text-green-600", bg: "bg-green-50" },
                // Add more mappings as needed
              };
              const colors = colorMap[plan.id] || { icon: "text-orange-600", bg: "bg-orange-50" };

              return (
                <Card
                  key={plan.id}
                  className="py-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/20 group"
                  onClick={() => handlePlanSelect(plan.planDataParam)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${colors.bg} group-hover:scale-110 transition-transform duration-200`}
                      >
                        <IconComponent className={`h-5 w-5 ${colors.icon}`} />
                      </div>
                      <div>
                        <CardTitle className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {plan.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Help Text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't worry - you can always modify your comparison or switch between examples later.
          </p>
        </div>
      </div>
    </div>
  );
} 