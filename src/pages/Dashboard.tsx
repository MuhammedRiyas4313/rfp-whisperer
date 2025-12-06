import { Link } from "react-router-dom";
import { FileText, Users, Inbox, TrendingUp, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/StatCard";
import { PageHeader } from "@/components/common/PageHeader";
import { mockRFPs, mockVendors, mockProposals } from "@/store/mockData";
import { format } from "date-fns";

export default function Dashboard() {
  const recentRFPs = mockRFPs.slice(0, 3);
  const pendingProposals = mockProposals.filter(p => p.status !== "evaluated").length;

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "draft": return "draft";
      case "sent": return "sent";
      case "receiving_responses": return "receiving";
      case "completed": return "completed";
      default: return "default";
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of your RFP management activities"
        actions={
          <Button asChild variant="accent">
            <Link to="/rfps/create">Create New RFP</Link>
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active RFPs"
          value={mockRFPs.filter(r => r.status !== "completed").length}
          subtitle="Currently in progress"
          icon={FileText}
          variant="default"
        />
        <StatCard
          title="Total Vendors"
          value={mockVendors.length}
          subtitle="In your network"
          icon={Users}
          variant="accent"
        />
        <StatCard
          title="Proposals Received"
          value={mockProposals.length}
          subtitle={`${pendingProposals} pending review`}
          icon={Inbox}
          variant="success"
        />
        <StatCard
          title="Avg. Savings"
          value="12%"
          subtitle="Compared to budget"
          icon={TrendingUp}
          trend={{ value: 3.2, positive: true }}
          variant="warning"
        />
      </div>

      {/* Recent RFPs */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent RFPs</h2>
          <Button variant="ghost" asChild>
            <Link to="/rfps" className="text-sm">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentRFPs.map((rfp) => (
            <Link
              key={rfp._id}
              to={`/rfps/${rfp._id}`}
              className="group rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-accent/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-accent transition-colors">
                    {rfp.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {rfp.description}
                  </p>
                </div>
                <Badge variant={statusBadgeVariant(rfp.status)}>
                  {rfp.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(new Date(rfp.deliveryDeadline), "MMM d, yyyy")}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {rfp.selectedVendors.length} vendors
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <p className="text-sm font-medium">
                  Budget: <span className="text-accent">${rfp.budget.toLocaleString()}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="default" size="sm">
              <Link to="/rfps/create">New RFP</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/vendors">Manage Vendors</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/proposals">Review Proposals</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-accent/5 to-accent/10 p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Based on your recent RFPs, TechPro Solutions consistently offers the best 
            value with an average savings of 15% and excellent warranty terms.
          </p>
        </div>
      </div>
    </div>
  );
}
