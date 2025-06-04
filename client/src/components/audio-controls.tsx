import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Gauge } from "lucide-react";
import { PlayMode } from "@/lib/audio-engine";

interface AudioControlsProps {
  volume: number;
  tempo: number;
  noteDuration: string;
  playMode: PlayMode;
  onVolumeChange: (volume: number) => void;
  onTempoChange: (tempo: number) => void;
  onNoteDurationChange: (duration: string) => void;
  onPlayModeChange: (mode: PlayMode) => void;
}

export function AudioControls({
  volume,
  tempo,
  noteDuration,
  playMode,
  onVolumeChange,
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
    <div className="bauhaus-card p-6">
      <h3 className="text-lg font-black text-foreground mb-4 flex items-center">
        <div className="w-4 h-4 bg-accent border-2 border-black mr-3"></div>
        AUDIO CONTROLS
      </h3>
      
      <div className="space-y-6">
        {/* Volume Control */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide flex items-center">
            <Volume2 className="w-4 h-4 mr-2" />
            VOLUME
          </label>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold text-foreground">0</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(parseInt(e.target.value))}
              className="flex-1 bauhaus-slider"
            />
            <span className="text-sm font-bold text-foreground">100</span>
          </div>
          <span className="text-sm font-bold text-secondary">{volume}%</span>
        </div>

        {/* Tempo Control */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide flex items-center">
            <Gauge className="w-4 h-4 mr-2" />
            TEMPO (BPM)
          </label>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold text-foreground">60</span>
            <input
              type="range"
              min="60"
              max="200"
              value={tempo}
              onChange={(e) => onTempoChange(parseInt(e.target.value))}
              className="flex-1 bauhaus-slider"
            />
            <span className="text-sm font-bold text-foreground">200</span>
          </div>
          <span className="text-sm font-bold text-secondary">{tempo} BPM</span>
        </div>

        {/* Note Duration */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">NOTE DURATION</label>
          <Select value={noteDuration} onValueChange={onNoteDurationChange}>
            <SelectTrigger className="w-full border-2 border-black">
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
          <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">PLAY MODE</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onPlayModeChange('ascending')}
              className={`bauhaus-btn px-3 py-2 text-xs ${
                playMode === 'ascending' ? 'primary' : 'accent'
              }`}
            >
              ASCENDING
            </button>
            <button
              onClick={() => onPlayModeChange('descending')}
              className={`bauhaus-btn px-3 py-2 text-xs ${
                playMode === 'descending' ? 'primary' : 'accent'
              }`}
            >
              DESCENDING
            </button>
          </div>
          <button
            onClick={() => onPlayModeChange('both')}
            className={`bauhaus-btn w-full mt-2 px-3 py-2 text-xs ${
              playMode === 'both' ? 'primary' : 'accent'
            }`}
          >
            UP & DOWN
          </button>
        </div>
      </div>
    </div>
  );
}
