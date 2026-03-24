"use client";

import CreateServiceDialog from "@/components/ServiceComponents/createServiceDialog";
import EditServiceDialog from "@/components/ServiceComponents/editServiceDialog";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchServices,
  updateServiceThunk,
  deleteServiceThunk,
} from "@/redux/slices/serviceSlice";

import { useEffect } from "react";

export default function ServicesPage() {
  const dispatch = useAppDispatch();

  const { currentOrgId } = useAppSelector((s) => s.org);
  const { services } = useAppSelector((s) => s.service);

  useEffect(() => {
    if (currentOrgId) {
      dispatch(fetchServices(currentOrgId));
    }
  }, [currentOrgId]);

  if (!currentOrgId) return <p>Select organization</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Services</h1>
        <CreateServiceDialog />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between">
                <h2>{service.title}</h2>

                <Switch
                  checked={service.isActive}
                  className="cursor-pointer"
                  onCheckedChange={(val) =>
                    dispatch(
                      updateServiceThunk({
                        serviceId: service.id,
                        data: { isActive: val },
                      }),
                    )
                  }
                />
              </div>

              <p>{service.description}</p>
              <p>⏱ {service.durationInMinutes} mins</p>
              <p>₹ {service.price}</p>

              <div className="flex gap-2">
                <EditServiceDialog service={service} />

                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={async () => {
                    try {
                      await dispatch(deleteServiceThunk(service.id)).unwrap();
                      toast.success("Service Deleted Successfully");
                    } catch {
                      toast.error("Failed To Delete Service");
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
