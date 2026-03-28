import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SlotPicker({
  slots,
  selected,
  onSelect,
  loading,
}: any) {
  // ✅ Only show skeleton if FIRST load
  if (loading && !slots.length) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className="text-center py-6 border rounded-xl">
        <p className="text-sm text-muted-foreground">
          No available slots for this date
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">Select a Time</p>

      <div
        className={`grid grid-cols-3 sm:grid-cols-4 gap-2 transition-opacity duration-200 ${
          loading ? "opacity-70" : "opacity-100"
        }`}
      >
        {slots.map((slot: string) => {
          const isSelected = selected === slot;

          return (
            <Button
              key={slot}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onSelect(slot)}
              className={`w-full transition-all duration-200 cursor-pointer
              ${isSelected ? "scale-105 shadow-md" : "hover:scale-105"}`}
            >
              {slot}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
