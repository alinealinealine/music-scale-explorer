import { useState, useEffect } from "react";
import { Music, HelpCircle, Settings } from "lucide-react";
import { ScaleSelector } from "@/components/scale-selector";
import { PianoKeyboard } from "@/components/piano-keyboard";
import { AudioControls } from "@/components/audio-controls";
import { ScaleInfo } from "@/components/scale-info";
import { ScaleLibrary } from "@/components/scale-library";
import { audioEngine, PlayMode } from "@/lib/audio-engine";
import { getScaleNotes, ScaleNote } from "@/lib/scale-definitions";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedScale, setSelectedScale] = useState('major');
  const [rootNote, setRootNote] = useState('C');
  const [octave, setOctave] = useState(4);
  const [tempo, setTempo] = useState(120);
  const [noteDuration, setNoteDuration] = useState('quarter');
  const [playMode, setPlayMode] = useState<PlayMode>('ascending');
  const [isPlaying, setIsPlaying] = useState(false);
  const [scaleNotes, setScaleNotes] = useState<ScaleNote[]>([]);

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
      {/* Bauhaus Header */}
      <header className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Geometric logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary border-2 border-black"></div>
                <div className="w-6 h-6 bg-secondary border-2 border-black"></div>
                <div className="w-4 h-4 bg-accent border-2 border-black"></div>
              </div>
              <h1 className="text-3xl font-black text-foreground tracking-wider">SCALE EXPLORER</h1>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <button className="bauhaus-btn accent px-4 py-2 text-sm">
                HELP
              </button>
              <button className="bauhaus-btn primary px-4 py-2 text-sm">
                SETTINGS
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
            octave={octave}
            isPlaying={isPlaying}
            onScaleChange={setSelectedScale}
            onRootNoteChange={setRootNote}
            onOctaveChange={setOctave}
            onPlayScale={handlePlayScale}
            onStopAudio={handleStopAudio}
          />
        </div>

        {/* Piano Keyboard */}
        <div className="mb-8">
          <PianoKeyboard scaleNotes={scaleNotes} />
        </div>

        {/* Audio Controls and Scale Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <AudioControls
            tempo={tempo}
            noteDuration={noteDuration}
            playMode={playMode}
            onTempoChange={setTempo}
            onNoteDurationChange={setNoteDuration}
            onPlayModeChange={setPlayMode}
          />
          
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
