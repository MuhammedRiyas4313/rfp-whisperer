import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Trophy, CheckCircle2, AlertCircle, DollarSign, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProposals, mockVendors, mockRFPs } from "@/store/mockData";
import { cn } from "@/lib/utils";

export default function CompareProposals() {
  const [searchParams] = useSearchParams();
  const rfpIdFromUrl = searchParams.get("rfp");
  
  const [selectedRfpId, setSelectedRfpId] = useState(rfpIdFromUrl || mockRFPs[0]?._id || "");
  
  const selectedRfp = mockRFPs.find((r) => r._id === selectedRfpId);
  const rfpProposals = mockProposals.filter((p) => p.rfpId === selectedRfpId);

  const bestProposal = rfpProposals.reduce((best, current) => 
    !best || current.aiScore > best.aiScore ? current : best
  , rfpProposals[0]);

  const lowestPrice = Math.min(...rfpProposals.map((p) => p.structuredData.totalPrice));

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

      <PageHeader
        title="Compare Proposals"
        description="AI-powered comparison and recommendation"
        actions={
          <Select value={selectedRfpId} onValueChange={setSelectedRfpId}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select RFP" />
            </SelectTrigger>
            <SelectContent>
              {mockRFPs.filter(r => mockProposals.some(p => p.rfpId === r._id)).map((rfp) => (
                <SelectItem key={rfp._id} value={rfp._id}>
                  {rfp.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {rfpProposals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No proposals to compare for this RFP.</p>
        </div>
      ) : (
        <>
          {/* AI Recommendation Banner */}
          {bestProposal && (
            <div className="mb-8 rounded-xl border-2 border-accent bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-ai shadow-glow">
                  <Trophy className="h-6 w-6 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">AI Recommendation</h3>
                    <Badge variant="accent">Best Match</Badge>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Based on price, quality, delivery terms, and warranty coverage, we recommend{" "}
                    <span className="font-semibold text-foreground">
                      {mockVendors.find((v) => v._id === bestProposal.vendorId)?.name}
                    </span>{" "}
                    with an AI score of {bestProposal.aiScore}/100.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Best warranty terms</span>
                    </div>
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Within budget</span>
                    </div>
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Meets all requirements</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comparison Grid */}
          <div className="overflow-x-auto">
            <div className="inline-flex gap-4 min-w-full pb-4">
              {rfpProposals.map((proposal) => {
                const vendor = mockVendors.find((v) => v._id === proposal.vendorId);
                const isBest = proposal._id === bestProposal?._id;
                const isLowestPrice = proposal.structuredData.totalPrice === lowestPrice;
                const budgetDiff = selectedRfp 
                  ? ((proposal.structuredData.totalPrice - selectedRfp.budget) / selectedRfp.budget) * 100
                  : 0;

                return (
                  <div
                    key={proposal._id}
                    className={cn(
                      "flex-shrink-0 w-[340px] rounded-xl border bg-card shadow-sm transition-all duration-200",
                      isBest && "border-accent ring-2 ring-accent/20"
                    )}
                  >
                    {/* Header */}
                    <div className={cn(
                      "p-5 border-b",
                      isBest && "bg-accent/5"
                    )}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{vendor?.name}</h3>
                            {isBest && (
                              <Badge variant="accent" className="text-xs">
                                <Trophy className="mr-1 h-3 w-3" />
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{vendor?.email}</p>
                        </div>
                      </div>

                      {/* AI Score */}
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">AI Score</span>
                            <span className={cn(
                              "text-sm font-semibold",
                              proposal.aiScore >= 90 ? "text-success" :
                              proposal.aiScore >= 70 ? "text-accent" : "text-warning"
                            )}>
                              {proposal.aiScore}/100
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-secondary overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                proposal.aiScore >= 90 ? "bg-success" :
                                proposal.aiScore >= 70 ? "bg-accent" : "bg-warning"
                              )}
                              style={{ width: `${proposal.aiScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="p-5 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Total Price</span>
                        </div>
                        {isLowestPrice && (
                          <Badge variant="success" className="text-xs">Lowest</Badge>
                        )}
                      </div>
                      <p className="text-2xl font-bold mt-1">
                        ${proposal.structuredData.totalPrice.toLocaleString()}
                      </p>
                      <p className={cn(
                        "text-sm mt-1",
                        budgetDiff <= 0 ? "text-success" : "text-warning"
                      )}>
                        {budgetDiff <= 0 ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            {Math.abs(budgetDiff).toFixed(0)}% under budget
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {budgetDiff.toFixed(0)}% over budget
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Delivery</p>
                          <p className="text-sm font-medium">{proposal.structuredData.deliveryTime}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Warranty</p>
                          <p className="text-sm font-medium">{proposal.structuredData.warranty}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Payment Terms</p>
                          <p className="text-sm font-medium">{proposal.structuredData.paymentTerms}</p>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-5 border-t bg-secondary/30">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Items</p>
                      <div className="space-y-2">
                        {proposal.structuredData.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{item.name}</span>
                            <span className="font-medium">${item.unitPrice.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Summary */}
                    {proposal.aiSummary && (
                      <div className="p-5 border-t">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-accent" />
                          <span className="text-xs font-medium text-accent">AI Summary</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{proposal.aiSummary}</p>
                      </div>
                    )}

                    {/* Action */}
                    <div className="p-5 border-t">
                      <Button
                        className="w-full"
                        variant={isBest ? "accent" : "outline"}
                      >
                        {isBest ? "Select This Vendor" : "Select Vendor"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
