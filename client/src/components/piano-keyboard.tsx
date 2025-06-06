import { audioEngine } from "@/lib/audio-engine";
import { ScaleNote, getAllPianoNotes, NOTE_NAMES } from "@/lib/scale-definitions";
import { useState } from "react";

interface PianoKeyboardProps {
  scaleNotes: ScaleNote[];
}

export function PianoKeyboard({ scaleNotes }: PianoKeyboardProps) {
  const [playingNote, setPlayingNote] = useState<string | null>(null);
  
  // Get all piano notes from octave 3 to 5
  const allNotes = getAllPianoNotes(3, 5);
  
  // Create a map of scale notes for quick lookup
  const scaleNoteMap = new Map();
  scaleNotes.forEach(note => {
    const key = `${note.name}${note.octave}`;
    scaleNoteMap.set(key, note);
  });

  const handleNoteClick = async (note: string, octave: number, frequency: number) => {
    const noteKey = `${note}${octave}`;
    setPlayingNote(noteKey);
    
    try {
      await audioEngine.playNote(frequency, 0.5, 0.3);
    } finally {
      setPlayingNote(null);
    }
  };

  const isNoteInScale = (noteName: string, octave: number) => {
    return scaleNoteMap.has(`${noteName}${octave}`);
  };

  const isBlackKey = (noteName: string) => {
    return noteName.includes('#');
  };

  const getWhiteKeys = () => {
    return allNotes.filter(note => !isBlackKey(note.name));
  };

  const getBlackKeys = () => {
    return allNotes.filter(note => isBlackKey(note.name));
  };

  const getBlackKeyPosition = (noteName: string, octave: number) => {
    const whiteKeys = getWhiteKeys();
    let position = 0;
    
    for (let i = 0; i < whiteKeys.length; i++) {
      const whiteKey = whiteKeys[i];
      if (whiteKey.octave === octave || (whiteKey.octave === octave - 1 && whiteKey.name === 'B')) {
        if (
          (whiteKey.name === 'C' && noteName === 'C#') ||
          (whiteKey.name === 'D' && noteName === 'D#') ||
          (whiteKey.name === 'F' && noteName === 'F#') ||
          (whiteKey.name === 'G' && noteName === 'G#') ||
          (whiteKey.name === 'A' && noteName === 'A#')
        ) {
          return i * 60 + 40; // 60px per white key, offset by 40px
        }
      }
    }
    return position;
  };

  const whiteKeys = getWhiteKeys();
  const blackKeys = getBlackKeys();

  // Get scale degree information
  const getScaleDegrees = () => {
    const degrees = [];
    scaleNotes.forEach((note, index) => {
      degrees.push({
        degree: index + 1,
        name: getDegreeName(index + 1),
        isActive: true
      });
    });
    
    // Add inactive degrees for complete scale context
    for (let i = degrees.length + 1; i <= 7; i++) {
      degrees.push({
        degree: i,
        name: getDegreeName(i),
        isActive: false
      });
    }
    
    return degrees.slice(0, 7); // Limit to 7 degrees
  };

  const getDegreeName = (degree: number) => {
    const names = [
      'Root', 'Major 2nd', 'Major 3rd', 'Perfect 4th', 
      'Perfect 5th', 'Major 6th', 'Major 7th'
    ];
    return names[degree - 1] || `${degree}th`;
  };

  return (
    <div className="minimal-card p-4 sm:p-12">
      <h2 className="text-xl sm:text-2xl font-bold text-black mb-6 sm:mb-12 tracking-tight">
        PIANO KEYBOARD
      </h2>
      
      {/* Piano Keyboard Container */}
      <div className="relative overflow-x-auto pb-4">
        <div className="piano-keyboard flex relative mx-auto" style={{ 
          width: `${whiteKeys.length * 40}px`,
          minWidth: '100%'
        }}>
          {/* White Keys */}
          {whiteKeys.map((note, index) => {
            const noteKey = `${note.name}${note.octave}`;
            const isInScale = isNoteInScale(note.name, note.octave);
            const isPlaying = playingNote === noteKey;
            
            return (
              <button
                key={noteKey}
                onClick={() => handleNoteClick(note.name, note.octave, note.frequency)}
                className={`white-key ${isInScale ? 'active' : ''} ${isPlaying ? 'opacity-50' : ''}`}
                style={{ 
                  width: '40px', 
                  height: '160px',
                  minWidth: '40px'
                }}
              >
                <span className={`absolute bottom-2 text-[10px] sm:text-xs font-medium ${isInScale ? 'text-white' : 'text-gray-600'}`}>
                  {note.name}
                </span>
              </button>
            );
          })}

          {/* Black Keys */}
          {blackKeys.map((note) => {
            const noteKey = `${note.name}${note.octave}`;
            const isInScale = isNoteInScale(note.name, note.octave);
            const isPlaying = playingNote === noteKey;
            const leftPosition = getBlackKeyPosition(note.name, note.octave);
            
            return (
              <button
                key={noteKey}
                onClick={() => handleNoteClick(note.name, note.octave, note.frequency)}
                className={`black-key ${isInScale ? 'active' : ''} ${isPlaying ? 'opacity-50' : ''}`}
                style={{ 
                  width: '24px', 
                  height: '100px',
                  minWidth: '24px',
                  left: `${leftPosition * (40/60)}px` 
                }}
              >
                <span className="absolute bottom-2 text-[10px] sm:text-xs font-medium text-white">
                  {note.name.replace('#', '♯')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scale Degree Indicators */}
      <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-1 sm:gap-2">
        {getScaleDegrees().map((degree, index) => (
          <div
            key={degree.degree}
            className={`px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-medium ${
              degree.isActive 
                ? 'bg-active-note/10 text-secondary border border-secondary/20' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {degree.degree} - {degree.name}
          </div>
        ))}
      </div>
    </div>
  );
}
