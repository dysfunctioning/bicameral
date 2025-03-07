
import { Toggle } from "@/components/ui/toggle";

interface ModeToggleProps {
  mode: "normal" | "whiteboard";
  onModeChange: (mode: "normal" | "whiteboard") => void;
  showChangeTracking: boolean;
  onChangeTrackingToggle: (show: boolean) => void;
}

export default function ModeToggle({
  mode,
  onModeChange,
  showChangeTracking,
  onChangeTrackingToggle,
}: ModeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Toggle
        pressed={mode === "normal"}
        onPressedChange={() => onModeChange("normal")}
        aria-label="Toggle normal mode"
        className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
      >
        Normal
      </Toggle>
      <Toggle
        pressed={mode === "whiteboard"}
        onPressedChange={() => onModeChange("whiteboard")}
        aria-label="Toggle whiteboard mode"
        className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
      >
        Whiteboard
      </Toggle>
      {mode === "normal" && (
        <Toggle
          pressed={showChangeTracking}
          onPressedChange={onChangeTrackingToggle}
          aria-label="Toggle change tracking"
          className="data-[state=on]:bg-green-500 data-[state=on]:text-white ml-2"
        >
          Track Changes
        </Toggle>
      )}
    </div>
  );
}
