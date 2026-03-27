import { Button } from "@/components/ui/button";

export default function SlotPicker({ slots, selected, onSelect }: any) {
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

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot: string) => {
          const isSelected = selected === slot;

          return (
            <Button
              key={slot}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onSelect(slot)}
              className={`w-full transition-all
              ${isSelected ? "scale-105 shadow" : "hover:scale-105"}`}
            >
              {slot}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
