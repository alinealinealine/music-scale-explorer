export interface ScaleDefinition {
  name: string;
  intervals: number[];
  description: string;
  formula: string;
  usage: string;
  noteCount: number;
}

export const SCALE_DEFINITIONS: Record<string, ScaleDefinition> = {
  'major': {
    name: 'Major Scale',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    description: 'The major scale is the most fundamental scale in Western music, providing the basis for harmony and melody.',
    formula: 'W-W-H-W-W-W-H',
    usage: 'Popular in classical music, folk songs, and most Western pop music. Creates a bright, happy sound.',
    noteCount: 7
  },
  'natural-minor': {
    name: 'Natural Minor',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    description: 'The natural minor scale creates a sad and melancholic sound.',
    formula: 'W-H-W-W-H-W-W',
    usage: 'Common in ballads, classical music, and emotional pieces. Creates a darker, more somber mood.',
    noteCount: 7
  },
  'harmonic-minor': {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    description: 'The harmonic minor scale has a distinctive augmented second interval.',
    formula: 'W-H-W-W-H-W+H-H',
    usage: 'Common in classical music, particularly baroque period. Has an exotic, Middle Eastern flavor.',
    noteCount: 7
  },
  'pentatonic-major': {
    name: 'Pentatonic Major',
    intervals: [0, 2, 4, 7, 9],
    description: 'Simple and versatile 5-note scale that avoids semitones.',
    formula: 'W-W-W+H-W-W+H',
    usage: 'Universal scale found in many cultures. Great for improvisation and folk music.',
    noteCount: 5
  },
  'pentatonic-minor': {
    name: 'Pentatonic Minor',
    intervals: [0, 3, 5, 7, 10],
    description: 'The minor version of the pentatonic scale.',
    formula: 'W+H-W-W-W+H-W',
    usage: 'Essential for blues, rock, and folk music. Very accessible for improvisation.',
    noteCount: 5
  },
  'blues': {
    name: 'Blues Scale',
    intervals: [0, 3, 5, 6, 7, 10],
    description: 'Essential for blues and rock music with the characteristic blue note.',
    formula: 'W+H-W-H-H-W+H-W',
    usage: 'Foundation of blues, jazz, and rock music. The blue note creates tension and character.',
    noteCount: 6
  },
  'dorian': {
    name: 'Dorian Mode',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    description: 'Modal scale with a minor feel but a raised 6th degree.',
    formula: 'W-H-W-W-W-H-W',
    usage: 'Popular in jazz, folk, and Celtic music. Has a sophisticated minor sound.',
    noteCount: 7
  },
  'mixolydian': {
    name: 'Mixolydian Mode',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    description: 'Major scale with a flattened 7th degree.',
    formula: 'W-W-H-W-W-H-W',
    usage: 'Common in rock, blues, and folk music. Has a dominant, bluesy character.',
    noteCount: 7
  },
  'chromatic': {
    name: 'Chromatic Scale',
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    description: 'All 12 semitones in sequence.',
    formula: 'H-H-H-H-H-H-H-H-H-H-H-H',
    usage: 'Used for transitions, embellishments, and modern classical music.',
    noteCount: 12
  }
};

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const NOTE_FREQUENCIES: Record<string, number> = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88
};

export interface ScaleNote {
  name: string;
  frequency: number;
  octave: number;
  degree: number;
  isInScale: boolean;
}

export function getScaleNotes(scaleKey: string, rootNote: string, octave: number): ScaleNote[] {
  const scale = SCALE_DEFINITIONS[scaleKey];
  if (!scale) return [];

  const notes: ScaleNote[] = [];
  const rootIndex = NOTE_NAMES.indexOf(rootNote);
  
  scale.intervals.forEach((interval, index) => {
    const noteIndex = (rootIndex + interval) % 12;
    const noteName = NOTE_NAMES[noteIndex];
    const currentOctave = octave + Math.floor((rootIndex + interval) / 12);
    const frequency = NOTE_FREQUENCIES[noteName] * Math.pow(2, currentOctave - 4);
    
    notes.push({
      name: noteName,
      frequency: frequency,
      octave: currentOctave,
      degree: index + 1,
      isInScale: true
    });
  });

  return notes;
}

export function getAllPianoNotes(startOctave: number = 3, endOctave: number = 5): ScaleNote[] {
  const notes: ScaleNote[] = [];
  
  for (let octave = startOctave; octave <= endOctave; octave++) {
    NOTE_NAMES.forEach((noteName, index) => {
      const frequency = NOTE_FREQUENCIES[noteName] * Math.pow(2, octave - 4);
      notes.push({
        name: noteName,
        frequency: frequency,
        octave: octave,
        degree: 0,
        isInScale: false
      });
    });
  }
  
  return notes;
}

export function getFormulaSteps(formula: string): Array<{ step: string; isWhole: boolean }> {
  return formula.split('-').map(step => ({
    step,
    isWhole: step.includes('W')
  }));
}
