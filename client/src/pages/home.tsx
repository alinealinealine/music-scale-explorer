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
      {/* Ultra-minimal Header */}
      <header className="bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Geometric yellow accent */}
              <div className="w-12 h-4 bg-primary border-2 border-black"></div>
              <h1 className="text-3xl font-bold text-black tracking-tight">SCALE EXPLORER</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-16">
        {/* Scale Selector */}
        <div className="mb-24">
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
        <div className="mb-24">
          <PianoKeyboard scaleNotes={scaleNotes} />
        </div>

        {/* Scale Info */}
        <div className="mb-24">
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
