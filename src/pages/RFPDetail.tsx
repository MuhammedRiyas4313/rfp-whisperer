import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Send, Users, DollarSign, Clock, Package, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { mockRFPs, mockVendors, mockProposals } from "@/store/mockData";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function RFPDetail() {
  const { id } = useParams();
  const rfp = mockRFPs.find((r) => r._id === id);
  const [selectedVendors, setSelectedVendors] = useState<string[]>(
    (rfp?.selectedVendors as string[]) || []
  );

  if (!rfp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold">RFP Not Found</h2>
        <Button asChild className="mt-4">
          <Link to="/rfps">Back to RFPs</Link>
        </Button>
      </div>
    );
  }

  const rfpProposals = mockProposals.filter((p) => p.rfpId === rfp._id);

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "draft": return "draft";
      case "sent": return "sent";
      case "receiving_responses": return "receiving";
      case "completed": return "completed";
      default: return "default";
    }
  };

  const handleVendorToggle = (vendorId: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSendRFP = () => {
    if (selectedVendors.length === 0) {
      toast({
        title: "No Vendors Selected",
        description: "Please select at least one vendor to send the RFP.",
        variant: "destructive",
      });
      return;
    }

    const vendorNames = selectedVendors
      .map((id) => mockVendors.find((v) => v._id === id)?.name)
      .filter(Boolean)
      .join(", ");

    toast({
      title: "RFP Sent Successfully",
      description: `RFP has been sent to: ${vendorNames}`,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/rfps">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to RFPs
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{rfp.title}</h1>
            <Badge variant={statusBadgeVariant(rfp.status)} className="text-sm">
              {rfp.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="mt-2 text-muted-foreground max-w-2xl">{rfp.description}</p>
        </div>
        {rfp.status === "draft" && (
          <Button variant="accent" onClick={handleSendRFP}>
            <Send className="mr-2 h-4 w-4" />
            Send to Vendors
          </Button>
        )}
        {rfp.status !== "draft" && rfpProposals.length > 0 && (
          <Button asChild variant="accent">
            <Link to={`/compare?rfp=${rfp._id}`}>
              Compare Proposals
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">RFP Details</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-semibold">${rfp.budget.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Deadline</p>
                  <p className="font-semibold">{format(new Date(rfp.deliveryDeadline), "MMMM d, yyyy")}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Terms</p>
                  <p className="font-semibold">{rfp.paymentTerms || "Not specified"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Package className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Warranty</p>
                  <p className="font-semibold">{rfp.warrantyRequirement || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Requested Items</h2>
            <div className="space-y-3">
              {rfp.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg border bg-background"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.specifications && (
                      <p className="text-sm text-muted-foreground">{item.specifications}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    Qty: {item.quantity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Proposals Received */}
          {rfpProposals.length > 0 && (
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Proposals Received</h2>
                <Badge variant="accent">{rfpProposals.length} proposals</Badge>
              </div>
              <div className="space-y-3">
                {rfpProposals.map((proposal) => {
                  const vendor = mockVendors.find((v) => v._id === proposal.vendorId);
                  return (
                    <div
                      key={proposal._id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-background"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                          <Mail className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">{vendor?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${proposal.structuredData.totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">AI Score</p>
                          <p className={cn(
                            "font-semibold",
                            proposal.aiScore >= 90 ? "text-success" :
                            proposal.aiScore >= 70 ? "text-accent" : "text-warning"
                          )}>
                            {proposal.aiScore}/100
                          </p>
                        </div>
                        <Badge variant={proposal.status === "evaluated" ? "success" : "warning"}>
                          {proposal.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Vendor Selection */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-6 shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">Select Vendors</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Choose which vendors should receive this RFP.
            </p>

            <div className="space-y-3">
              {mockVendors.map((vendor) => (
                <label
                  key={vendor._id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    selectedVendors.includes(vendor._id)
                      ? "border-accent bg-accent/5"
                      : "hover:border-muted-foreground/30"
                  )}
                >
                  <Checkbox
                    checked={selectedVendors.includes(vendor._id)}
                    onCheckedChange={() => handleVendorToggle(vendor._id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{vendor.name}</p>
                    <p className="text-xs text-muted-foreground">{vendor.email}</p>
                  </div>
                </label>
              ))}
            </div>

            {rfp.status === "draft" && (
              <Button
                onClick={handleSendRFP}
                className="w-full mt-4"
                variant="accent"
                disabled={selectedVendors.length === 0}
              >
                <Send className="mr-2 h-4 w-4" />
                Send to {selectedVendors.length} Vendor{selectedVendors.length !== 1 ? "s" : ""}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
