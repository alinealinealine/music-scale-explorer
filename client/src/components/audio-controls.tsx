import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Controls</h3>
        
        <div className="space-y-4">
          {/* Volume Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Volume2 className="w-4 h-4 inline mr-2" />
              Volume
            </label>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">0</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => onVolumeChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-gray-500">100</span>
            </div>
            <span className="text-sm text-gray-600">{volume}%</span>
          </div>

          {/* Tempo Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Gauge className="w-4 h-4 inline mr-2" />
              Tempo (BPM)
            </label>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">60</span>
              <input
                type="range"
                min="60"
                max="200"
                value={tempo}
                onChange={(e) => onTempoChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-gray-500">200</span>
            </div>
            <span className="text-sm text-gray-600">{tempo} BPM</span>
          </div>

          {/* Note Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note Duration</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Play Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => onPlayModeChange('ascending')}
                variant={playMode === 'ascending' ? 'default' : 'outline'}
                className={playMode === 'ascending' ? 'bg-primary text-white' : ''}
              >
                Ascending
              </Button>
              <Button
                onClick={() => onPlayModeChange('descending')}
                variant={playMode === 'descending' ? 'default' : 'outline'}
                className={playMode === 'descending' ? 'bg-primary text-white' : ''}
              >
                Descending
              </Button>
            </div>
            <Button
              onClick={() => onPlayModeChange('both')}
              variant={playMode === 'both' ? 'default' : 'outline'}
              className={`w-full mt-2 ${playMode === 'both' ? 'bg-primary text-white' : ''}`}
            >
              Up & Down
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
