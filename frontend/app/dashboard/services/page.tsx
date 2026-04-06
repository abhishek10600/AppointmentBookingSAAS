"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchServices,
  updateServiceThunk,
  deleteServiceThunk,
} from "@/redux/slices/serviceSlice";
import CreateServiceDialog from "@/components/ServiceComponents/createServiceDialog";
import EditServiceDialog from "@/components/ServiceComponents/editServiceDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Clock,
  IndianRupee,
  MapPin,
  Video,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ServicesPage() {
  const dispatch = useAppDispatch();
  const { currentOrgId } = useAppSelector((s) => s.org);
  const { services } = useAppSelector((s) => s.service);

  useEffect(() => {
    if (currentOrgId) dispatch(fetchServices(currentOrgId));
  }, [currentOrgId, dispatch]);

  if (!currentOrgId) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] border-2 border-dashed rounded-[3rem] bg-muted/20">
        <div className="p-4 bg-background rounded-full shadow-sm mb-4">
          <Sparkles className="w-10 h-10 text-primary opacity-20" />
        </div>
        <p className="text-xl font-medium text-muted-foreground">
          Select an organization to manage services
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900">
            Services
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Configure and preview your booking offerings.
          </p>
        </div>
        <CreateServiceDialog />
      </header>

      {services.length === 0 ? (
        <div className="text-center py-20 bg-muted/10 rounded-[3rem] border-2 border-dashed">
          <h3 className="text-lg font-semibold">No services found</h3>
          <p className="text-muted-foreground">
            Ready to start? Create your first service above.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`group relative transition-all duration-500 rounded-[2.5rem] border-2 p-2 ${
                !service.isActive
                  ? "opacity-50 grayscale border-transparent bg-muted/30"
                  : "hover:border-primary/30 shadow-sm hover:shadow-2xl hover:-translate-y-1 bg-card"
              }`}
            >
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Badge
                      variant={
                        service.serviceType === "ONLINE"
                          ? "secondary"
                          : "outline"
                      }
                      className="rounded-full px-3 py-1 text-[10px] font-bold tracking-tighter"
                    >
                      {service.serviceType === "ONLINE" ? (
                        <Video className="w-3 h-3 mr-1" />
                      ) : (
                        <MapPin className="w-3 h-3 mr-1" />
                      )}
                      {service.serviceType}
                    </Badge>
                    <h2 className="font-bold text-2xl tracking-tight leading-none group-hover:text-primary transition-colors">
                      {service.title}
                    </h2>
                  </div>
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

                <p className="text-muted-foreground text-sm line-clamp-2 min-h-[40px]">
                  {service.description ||
                    "No description provided for this service."}
                </p>

                <div className="flex items-center gap-6 py-4 px-5 bg-muted/30 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                      Duration
                    </span>
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {service.durationInMinutes}m
                    </span>
                  </div>
                  <div className="flex flex-col border-l pl-6">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                      Price
                    </span>
                    <span className="font-bold text-foreground flex items-center gap-0.5">
                      <IndianRupee className="w-3.5 h-3.5 text-green-600" />
                      {service.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <EditServiceDialog service={service} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors cursor-pointer"
                    onClick={async () => {
                      if (confirm("Permanently delete this service?")) {
                        try {
                          await dispatch(
                            deleteServiceThunk(service.id),
                          ).unwrap();
                          toast.success("Service deleted");
                        } catch {
                          toast.error("Delete failed");
                        }
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
