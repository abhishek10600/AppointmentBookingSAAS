import { Button } from "@/components/ui/button";

export default function SlotPicker({
  slots,
  selected,
  onSelect,
  loading,
}: any) {
  if (!slots.length && !loading) {
    return (
      <div className="py-12 px-6 text-center rounded-[2rem] bg-muted border-2 border-dashed border-border">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          Fully Booked for this date
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-3 gap-3 transition-all duration-500 ${
        loading ? "opacity-30" : "opacity-100"
      }`}
    >
      {slots.map((slot: string) => {
        const isSelected = selected === slot;
        return (
          <Button
            key={slot}
            variant="outline"
            onClick={() => onSelect(slot)}
            className={`h-14 rounded-2xl font-black text-sm border-2 transition-all duration-300 cursor-pointer ${
              isSelected
                ? "bg-foreground border-foreground text-background shadow-lg -translate-y-1"
                : "bg-card border-border hover:border-foreground text-foreground shadow-sm"
            }`}
          >
            {slot}
          </Button>
        );
      })}
    </div>
  );
}
