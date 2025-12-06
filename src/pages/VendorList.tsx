import { useState } from "react";
import { Plus, Search, Mail, Phone, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockVendors } from "@/store/mockData";
import { Vendor } from "@/types";
import { toast } from "@/hooks/use-toast";

export default function VendorList() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    if (editingVendor) {
      setVendors((prev) =>
        prev.map((v) =>
          v._id === editingVendor._id
            ? { ...v, ...formData, updatedAt: new Date().toISOString() }
            : v
        )
      );
      toast({ title: "Vendor Updated", description: `${formData.name} has been updated.` });
    } else {
      const newVendor: Vendor = {
        _id: `v${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setVendors((prev) => [...prev, newVendor]);
      toast({ title: "Vendor Added", description: `${formData.name} has been added.` });
    }

    setIsDialogOpen(false);
    setEditingVendor(null);
    setFormData({ name: "", email: "", phone: "", notes: "" });
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone || "",
      notes: vendor.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (vendor: Vendor) => {
    setVendors((prev) => prev.filter((v) => v._id !== vendor._id));
    toast({ title: "Vendor Deleted", description: `${vendor.name} has been removed.` });
  };

  const openNewVendorDialog = () => {
    setEditingVendor(null);
    setFormData({ name: "", email: "", phone: "", notes: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Vendors"
        description="Manage your vendor network"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="accent" onClick={openNewVendorDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingVendor ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
                <DialogDescription>
                  {editingVendor
                    ? "Update the vendor's information below."
                    : "Add a new vendor to your network."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Acme Corporation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@acme.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555-0100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes about this vendor..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingVendor ? "Update" : "Add"} Vendor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Vendor Grid */}
      {filteredVendors.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No vendors found"
          description="Add vendors to your network to start sending RFPs."
          action={{ label: "Add Vendor", to: "#" }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor._id}
              className="group rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{vendor.name}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${vendor.email}`}
                        className="hover:text-accent transition-colors"
                      >
                        {vendor.email}
                      </a>
                    </div>
                    {vendor.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(vendor)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(vendor)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {vendor.notes && (
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2 border-t pt-3">
                  {vendor.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
