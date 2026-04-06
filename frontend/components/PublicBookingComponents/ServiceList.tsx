import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Check } from "lucide-react";

export default function ServiceList({ services, selected, onSelect }: any) {
  return (
    <div className="grid gap-4">
      {services.map((service: any) => {
        const isSelected = selected?.id === service.id;
        return (
          <div
            key={service.id}
            onClick={() => onSelect(service)}
            className={`group relative cursor-pointer rounded-[2rem] transition-all duration-500 ${
              isSelected
                ? "p-[2px] bg-gradient-to-br from-slate-900 to-slate-600 scale-[1.02] shadow-xl"
                : "p-0 hover:scale-[1.01]"
            }`}
          >
            <Card
              className={`p-6 rounded-[1.9rem] border-none flex justify-between items-center bg-white ${!isSelected && "border border-slate-100 shadow-sm"}`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-black text-lg text-slate-900 leading-tight uppercase tracking-tight">
                    {service.title}
                  </p>
                  {isSelected && (
                    <div className="bg-slate-900 text-white rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />{" "}
                    {service.durationInMinutes}m
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-black uppercase tracking-widest text-slate-400 border-slate-100"
                  >
                    {service.serviceType}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black italic text-slate-900 tracking-tighter">
                  ₹{service.price}
                </p>
                <p className="text-[10px] font-bold text-slate-300 uppercase">
                  Per Session
                </p>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
