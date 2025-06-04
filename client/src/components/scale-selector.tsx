import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, Square, HelpCircle } from "lucide-react";
import { SCALE_DEFINITIONS, NOTE_NAMES } from "@/lib/scale-definitions";

interface ScaleSelectorProps {
  selectedScale: string;
  rootNote: string;
  isPlaying: boolean;
  onScaleChange: (scale: string) => void;
  onRootNoteChange: (note: string) => void;
  onPlayScale: () => void;
  onStopAudio: () => void;
}

export function ScaleSelector({
  selectedScale,
  rootNote,
  isPlaying,
  onScaleChange,
  onRootNoteChange,
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
    <TooltipProvider>
      <div className="minimal-card p-12">
        <h2 className="text-2xl font-bold text-black mb-12 tracking-tight">
          SCALE CONFIGURATION
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Scale Type Selector */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <label className="block text-sm font-medium text-muted-foreground">Scale Type</label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>A scale is a pattern of musical notes. Different scales create different moods - major sounds happy, minor sounds sad.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select value={selectedScale} onValueChange={onScaleChange}>
              <SelectTrigger className="w-full">
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
            <div className="flex items-center gap-1 mb-2">
              <label className="block text-sm font-medium text-muted-foreground">Root Note</label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The root note is the starting note of your scale. It's like the home base - the scale is named after this note.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select value={rootNote} onValueChange={onRootNoteChange}>
              <SelectTrigger className="w-full">
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

          {/* Play Controls */}
          <div className="flex flex-col justify-end space-y-2">
            <button 
              onClick={onPlayScale}
              className="minimal-btn primary px-4 py-2 text-sm disabled:opacity-50"
              disabled={isPlaying}
            >
              <Play className="w-4 h-4 mr-2 inline" />
              {isPlaying ? 'Playing...' : 'Play Scale'}
            </button>
            <button 
              onClick={onStopAudio}
              className="minimal-btn text-sm"
            >
              <Square className="w-4 h-4 mr-2 inline" />
              Stop
            </button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
