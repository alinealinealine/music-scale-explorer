import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    e.stopPropagation(); // Prevent scale selection when clicking play
    
    const scaleNotes = getScaleNotes(scaleKey, rootNote, octave);
    const frequencies = scaleNotes.map(note => note.frequency);
    
    await audioEngine.playScale(frequencies, 140, 0.2, 'ascending');
  };

  const scales = Object.entries(SCALE_DEFINITIONS).map(([key, scale]) => ({
    key,
    ...scale
  }));

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Scale Library</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scales.map((scale) => (
            <div
              key={scale.key}
              onClick={() => onSelectScale(scale.key)}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{scale.name}</h3>
                <Button
                  onClick={(e) => handlePlayPreview(scale.key, e)}
                  size="sm"
                  variant="ghost"
                  className="text-primary hover:text-blue-700 p-1 h-8 w-8"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{scale.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{scale.noteCount} notes</span>
                <span className="truncate ml-2">{scale.formula}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
