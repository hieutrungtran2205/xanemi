import { MOOD_LIST } from "@/lib/moods/definitions";
import { MoodChip } from "./mood-chip";

export function MoodPicker() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {MOOD_LIST.map((mood) => (
        <MoodChip key={mood.id} mood={mood} />
      ))}
    </div>
  );
}
