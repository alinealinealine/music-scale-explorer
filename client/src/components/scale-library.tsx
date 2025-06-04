import { Play } from "lucide-react";
import { SCALE_DEFINITIONS } from "@/lib/scale-definitions";
import { audioEngine } from "@/lib/audio-engine";
import { getScaleNotes } from "@/lib/scale-definitions";

interface ScaleLibraryProps {
  onSelectScale: (scale: string) => void;
  rootNote: string;
  octave: number;
}

export function ScaleLibrary({ onSelectScale, rootNote, octave }: ScaleLibraryProps) {
  const handlePlayPreview = async (scaleKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const scaleNotes = getScaleNotes(scaleKey, rootNote, octave);
    const frequencies = scaleNotes.map(note => note.frequency);
    
    await audioEngine.playScale(frequencies, 140, 0.2, 'ascending');
  };

  const scales = Object.entries(SCALE_DEFINITIONS).map(([key, scale]) => ({
    key,
    ...scale
  }));

  return (
    <div className="minimal-card p-12">
      <h2 className="text-2xl font-bold text-black mb-12 tracking-tight">
        SCALE LIBRARY
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {scales.map((scale) => (
          <div
            key={scale.key}
            onClick={() => onSelectScale(scale.key)}
            className="border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-all cursor-pointer hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-foreground text-sm">{scale.name}</h3>
              <button
                onClick={(e) => handlePlayPreview(scale.key, e)}
                className="minimal-btn accent p-2 text-xs hover:bg-accent/20"
              >
                <Play className="w-3 h-3" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{scale.description}</p>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{scale.noteCount} notes</span>
              <span className="truncate ml-2">{scale.formula}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
