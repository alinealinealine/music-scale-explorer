import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
    <div className="minimal-card p-4 sm:p-12">
      <h2 className="text-xl sm:text-2xl font-bold text-black mb-6 sm:mb-12 tracking-tight">
        SCALE CONFIGURATION
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
        {/* Scale Type Selector */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <label className="block text-sm font-medium text-muted-foreground">Scale Type</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] sm:max-w-[400px] p-4">
                <div className="space-y-2">
                  <p className="font-medium">What is a Scale?</p>
                  <p>A scale is a collection of musical notes that follow a specific pattern. Think of it like a recipe for creating melodies.</p>
                  <p className="font-medium">Different Types of Scales:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Major scales: Sound happy and bright</li>
                    <li>Minor scales: Sound sad and mysterious</li>
                    <li>Each scale has its own unique character</li>
                    <li>Used in different styles of music</li>
                  </ul>
                </div>
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
              <TooltipTrigger asChild>
                <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] sm:max-w-[400px] p-4">
                <div className="space-y-2">
                  <p className="font-medium">What is a Root Note?</p>
                  <p>The root note is the foundation of your scale - it's the first note and gives the scale its name.</p>
                  <p className="font-medium">Examples:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>In a C Major scale, C is the root note</li>
                    <li>It's like the home base of your musical journey</li>
                    <li>All other notes in the scale are built around it</li>
                    <li>Helps determine the overall pitch of the scale</li>
                  </ul>
                </div>
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
        <div className="flex flex-row md:flex-col justify-end space-x-2 md:space-x-0 md:space-y-2">
          <button 
            onClick={onPlayScale}
            className="minimal-btn primary px-4 py-2 text-sm disabled:opacity-50 flex-1 md:flex-none"
            disabled={isPlaying}
          >
            <Play className="w-4 h-4 mr-2 inline" />
            {isPlaying ? 'Playing...' : 'Play Scale'}
          </button>
          <button 
            onClick={onStopAudio}
            className="minimal-btn text-sm flex-1 md:flex-none"
          >
            <Square className="w-4 h-4 mr-2 inline" />
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
