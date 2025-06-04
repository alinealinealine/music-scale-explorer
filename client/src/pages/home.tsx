import { useState, useEffect } from "react";
import { Music, HelpCircle, Settings } from "lucide-react";
import { ScaleSelector } from "@/components/scale-selector";
import { PianoKeyboard } from "@/components/piano-keyboard";

import { ScaleInfo } from "@/components/scale-info";
import { ScaleLibrary } from "@/components/scale-library";
import { audioEngine, PlayMode } from "@/lib/audio-engine";
import { getScaleNotes, ScaleNote } from "@/lib/scale-definitions";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedScale, setSelectedScale] = useState('major');
  const [rootNote, setRootNote] = useState('C');
  const [playMode, setPlayMode] = useState<PlayMode>('ascending');
  const [isPlaying, setIsPlaying] = useState(false);
  const [scaleNotes, setScaleNotes] = useState<ScaleNote[]>([]);
  
  // Fixed defaults for beginners - no need to adjust these
  const octave = 4;
  const tempo = 120;
  const noteDuration = 'quarter';

  // Update scale notes when scale, root note, or octave changes
  useEffect(() => {
    const notes = getScaleNotes(selectedScale, rootNote, octave);
    setScaleNotes(notes);
  }, [selectedScale, rootNote, octave]);

  // Check if audio is playing
  useEffect(() => {
    const checkPlayingStatus = () => {
      setIsPlaying(audioEngine.isCurrentlyPlaying());
    };

    const interval = setInterval(checkPlayingStatus, 100);
    return () => clearInterval(interval);
  }, []);

  const handlePlayScale = async () => {
    if (isPlaying) {
      audioEngine.stopScale();
      return;
    }

    const frequencies = scaleNotes.map(note => note.frequency);
    const defaultVolume = 0.3; // Fixed volume since we removed the volume control
    
    setIsPlaying(true);
    try {
      await audioEngine.playScale(frequencies, tempo, defaultVolume, playMode);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleStopAudio = () => {
    audioEngine.stopScale();
    setIsPlaying(false);
  };

  const handleSelectScaleFromLibrary = (scale: string) => {
    setSelectedScale(scale);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Minimalist Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Musical note icon */}
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              </div>
              <h1 className="text-2xl font-semibold text-foreground">Scale Explorer</h1>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <button className="minimal-btn text-sm text-muted-foreground hover:text-foreground">
                Help
              </button>
              <button className="minimal-btn text-sm text-muted-foreground hover:text-foreground">
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scale Selector */}
        <div className="mb-8">
          <ScaleSelector
            selectedScale={selectedScale}
            rootNote={rootNote}
            isPlaying={isPlaying}
            onScaleChange={setSelectedScale}
            onRootNoteChange={setRootNote}
            onPlayScale={handlePlayScale}
            onStopAudio={handleStopAudio}
          />
        </div>

        {/* Piano Keyboard */}
        <div className="mb-8">
          <PianoKeyboard scaleNotes={scaleNotes} />
        </div>

        {/* Scale Info */}
        <div className="mb-8">
          <ScaleInfo
            selectedScale={selectedScale}
            rootNote={rootNote}
            scaleNotes={scaleNotes}
            onSelectScale={setSelectedScale}
          />
        </div>

        {/* Scale Library */}
        <ScaleLibrary
          onSelectScale={handleSelectScaleFromLibrary}
          rootNote={rootNote}
          octave={octave}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">Scale Explorer - Learn Music Theory Interactively</p>
            <p className="text-sm">Built with Web Audio API for real-time audio synthesis</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
