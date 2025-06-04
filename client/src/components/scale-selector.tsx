import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Square } from "lucide-react";
import { SCALE_DEFINITIONS, NOTE_NAMES } from "@/lib/scale-definitions";

interface ScaleSelectorProps {
  selectedScale: string;
  rootNote: string;
  octave: number;
  isPlaying: boolean;
  onScaleChange: (scale: string) => void;
  onRootNoteChange: (note: string) => void;
  onOctaveChange: (octave: number) => void;
  onPlayScale: () => void;
  onStopAudio: () => void;
}

export function ScaleSelector({
  selectedScale,
  rootNote,
  octave,
  isPlaying,
  onScaleChange,
  onRootNoteChange,
  onOctaveChange,
  onPlayScale,
  onStopAudio
}: ScaleSelectorProps) {
  const scaleOptions = Object.entries(SCALE_DEFINITIONS).map(([key, scale]) => ({
    value: key,
    label: scale.name
  }));

  const rootNoteOptions = NOTE_NAMES.map(note => {
    const displayName = note.includes('#') ? `${note} / ${note.replace('#', 'b')}` : note;
    return { value: note, label: displayName };
  });

  const octaveOptions = [
    { value: 3, label: '3rd Octave' },
    { value: 4, label: '4th Octave' },
    { value: 5, label: '5th Octave' }
  ];

  return (
    <div className="bauhaus-card blue p-6">
      <h2 className="text-xl font-black text-foreground mb-6 flex items-center">
        <div className="bauhaus-triangle mr-3"></div>
        SELECT SCALE & ROOT NOTE
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Scale Type Selector */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">SCALE TYPE</label>
          <Select value={selectedScale} onValueChange={onScaleChange}>
            <SelectTrigger className="w-full border-2 border-black">
              <SelectValue placeholder="Select a scale" />
            </SelectTrigger>
            <SelectContent>
              {scaleOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Root Note Selector */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">ROOT NOTE</label>
          <Select value={rootNote} onValueChange={onRootNoteChange}>
            <SelectTrigger className="w-full border-2 border-black">
              <SelectValue placeholder="Select root note" />
            </SelectTrigger>
            <SelectContent>
              {rootNoteOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Octave Selector */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">OCTAVE</label>
          <Select value={octave.toString()} onValueChange={(value) => onOctaveChange(parseInt(value))}>
            <SelectTrigger className="w-full border-2 border-black">
              <SelectValue placeholder="Select octave" />
            </SelectTrigger>
            <SelectContent>
              {octaveOptions.map(option => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Play Controls */}
        <div className="flex flex-col justify-end space-y-2">
          <button 
            onClick={onPlayScale}
            className="bauhaus-btn primary px-4 py-3 text-sm disabled:opacity-50"
            disabled={isPlaying}
          >
            <Play className="w-4 h-4 mr-2 inline" />
            {isPlaying ? 'PLAYING...' : 'PLAY SCALE'}
          </button>
          <button 
            onClick={onStopAudio}
            className="bauhaus-btn secondary px-4 py-3 text-sm"
          >
            <Square className="w-4 h-4 mr-2 inline" />
            STOP
          </button>
        </div>
      </div>
    </div>
  );
}
