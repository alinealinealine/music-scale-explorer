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
    <div className="bauhaus-card p-6">
      <h2 className="text-xl font-black text-foreground mb-6 flex items-center">
        <div className="bauhaus-square w-6 h-6 bg-accent mr-3"></div>
        SCALE LIBRARY
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scales.map((scale) => (
          <div
            key={scale.key}
            onClick={() => onSelectScale(scale.key)}
            className="border-2 border-black p-4 bg-white hover:bg-gray-50 transition-all cursor-pointer transform hover:translate-x-1 hover:translate-y-1"
            style={{ boxShadow: '4px 4px 0 #000' }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-foreground uppercase tracking-wide text-sm">{scale.name}</h3>
              <button
                onClick={(e) => handlePlayPreview(scale.key, e)}
                className="bauhaus-btn accent p-2 text-xs"
              >
                <Play className="w-3 h-3" />
              </button>
            </div>
            <p className="text-sm text-gray-700 font-medium mb-2">{scale.description}</p>
            <div className="flex justify-between text-xs font-bold text-gray-600">
              <span>{scale.noteCount} NOTES</span>
              <span className="truncate ml-2">{scale.formula}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
