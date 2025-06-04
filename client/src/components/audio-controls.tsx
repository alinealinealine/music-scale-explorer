import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gauge } from "lucide-react";
import { PlayMode } from "@/lib/audio-engine";

interface AudioControlsProps {
  tempo: number;
  noteDuration: string;
  playMode: PlayMode;
  onTempoChange: (tempo: number) => void;
  onNoteDurationChange: (duration: string) => void;
  onPlayModeChange: (mode: PlayMode) => void;
}

export function AudioControls({
  tempo,
  noteDuration,
  playMode,
  onTempoChange,
  onNoteDurationChange,
  onPlayModeChange
}: AudioControlsProps) {
  const noteDurationOptions = [
    { value: 'quarter', label: 'Quarter Note' },
    { value: 'half', label: 'Half Note' },
    { value: 'whole', label: 'Whole Note' },
    { value: 'eighth', label: 'Eighth Note' }
  ];

  return (
    <div className="minimal-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Audio Controls
      </h3>
      
      <div className="space-y-4">
        {/* Tempo Control */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center">
            <Gauge className="w-4 h-4 mr-2" />
            Tempo (BPM)
          </label>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">60</span>
            <input
              type="range"
              min="60"
              max="200"
              value={tempo}
              onChange={(e) => onTempoChange(parseInt(e.target.value))}
              className="flex-1 minimal-slider"
            />
            <span className="text-sm text-muted-foreground">200</span>
          </div>
          <span className="text-sm font-medium text-tempo-color">{tempo} BPM</span>
        </div>

        {/* Note Duration */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Note Duration</label>
          <Select value={noteDuration} onValueChange={onNoteDurationChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select note duration" />
            </SelectTrigger>
            <SelectContent>
              {noteDurationOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Play Mode */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Play Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onPlayModeChange('ascending')}
              className={`minimal-btn px-3 py-2 text-xs ${
                playMode === 'ascending' ? 'primary' : ''
              }`}
            >
              Ascending
            </button>
            <button
              onClick={() => onPlayModeChange('descending')}
              className={`minimal-btn px-3 py-2 text-xs ${
                playMode === 'descending' ? 'primary' : ''
              }`}
            >
              Descending
            </button>
          </div>
          <button
            onClick={() => onPlayModeChange('both')}
            className={`minimal-btn w-full mt-2 px-3 py-2 text-xs ${
              playMode === 'both' ? 'primary' : ''
            }`}
          >
            Up & Down
          </button>
        </div>
      </div>
    </div>
  );
}
