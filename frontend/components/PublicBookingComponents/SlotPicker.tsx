import { Button } from "@/components/ui/button";

export default function SlotPicker({
  slots,
  selected,
  onSelect,
  loading,
}: any) {
  if (!slots.length && !loading) {
    return (
      <div className="py-12 px-6 text-center rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-100">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Fully Booked for this date
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-3 gap-3 transition-all duration-500 ${loading ? "opacity-30" : "opacity-100"}`}
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
                ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200 -translate-y-1"
                : "bg-white border-slate-50 hover:border-slate-900 text-slate-600 shadow-sm"
            }`}
          >
            {slot}
          </Button>
        );
      })}
    </div>
  );
}
