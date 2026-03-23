"use client";

import CreateOrgDialog from "@/components/OrganizationComponents/CreateOrgDialog";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchOrganizations,
  setCurrentOrg,
} from "@/redux/slices/organizationSlice";
import React, { useEffect } from "react";

const OrganizationPage = () => {
  const dispatch = useAppDispatch();
  const { organizations, currentOrgId } = useAppSelector((s) => s.org);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <CreateOrgDialog />
      </div>

      {/* List */}
      <div className="grid md:grid-cols-3 gap-4">
        {organizations.map((org) => (
          <Card
            key={org.id}
            className={`cursor-pointer border ${
              currentOrgId === org.id ? "border-primary" : "hover:border-muted"
            }`}
            onClick={() => dispatch(setCurrentOrg(org.id))}
          >
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold">{org.name}</h2>
              <p className="text-sm text-muted-foreground">{org.slug}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrganizationPage;
