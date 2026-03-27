import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ServiceList({ services, selected, onSelect }: any) {
  return (
    <div className="space-y-3">
      {services.map((service: any) => {
        const isSelected = selected?.id === service.id;

        return (
          <Card
            key={service.id}
            onClick={() => onSelect(service)}
            className={`p-4 cursor-pointer rounded-2xl border transition-all duration-200
            ${
              isSelected
                ? "border-black bg-black text-white shadow-md scale-[1.02]"
                : "hover:border-black hover:shadow-sm"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-base">{service.title}</p>
                <p
                  className={`text-sm ${
                    isSelected ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
                  {service.durationInMinutes} mins
                </p>
              </div>

              <div className="text-right space-y-1">
                <p className="font-bold text-lg">₹{service.price}</p>
                <Badge
                  variant={isSelected ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {service.serviceType}
                </Badge>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
