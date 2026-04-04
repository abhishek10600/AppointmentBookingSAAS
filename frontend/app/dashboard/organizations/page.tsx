"use client";

import CreateOrgDialog from "@/components/OrganizationComponents/CreateOrgDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchOrganizations,
  setCurrentOrg,
} from "@/redux/slices/organizationSlice";
import { CheckCircle2, Globe, Building2, Plus } from "lucide-react"; // Icons add visual cues
import React, { useEffect } from "react";

const OrganizationPage = () => {
  const dispatch = useAppDispatch();
  const { organizations, currentOrgId, isLoading } = useAppSelector(
    (s) => s.org,
  );

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      {/* Header: More breathability */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground mt-1">
            Select or create an organization to manage your appointments.
          </p>
        </div>
        <CreateOrgDialog />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-3xl bg-muted/50 animate-pulse border-2 border-dashed border-muted"
            />
          ))}
        </div>
      ) : organizations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-3xl bg-muted/10">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">No organizations found</h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-[250px] text-center">
            You haven&apos;t joined any organizations yet. Create one to get
            started.
          </p>
          <div className="mt-6">
            <CreateOrgDialog
              trigger={
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" /> Create First Org
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {organizations.map((org) => {
            const isActive = currentOrgId === org.id;
            return (
              <Card
                key={org.id}
                onClick={() => dispatch(setCurrentOrg(org.id))}
                className={`group relative overflow-hidden cursor-pointer transition-all duration-300 rounded-3xl border-2 p-6 
                  hover:border-primary/50 hover:shadow-xl hover:-translate-y-1
                  ${isActive ? "border-primary bg-primary/[0.02] shadow-md" : "border-muted bg-card"}
                `}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-2xl transition-colors ${isActive ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-primary/10"}`}
                    >
                      <Building2 className="w-6 h-6" />
                    </div>
                    {isActive && (
                      <div className="flex items-center gap-1 text-primary animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="w-5 h-5 fill-primary text-white" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold truncate leading-tight">
                      {org.name}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                      <Globe className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium tabular-nums">
                        {org.slug}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrganizationPage;
