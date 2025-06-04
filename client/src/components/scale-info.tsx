import { SCALE_DEFINITIONS, ScaleNote, getFormulaSteps } from "@/lib/scale-definitions";

interface ScaleInfoProps {
  selectedScale: string;
  rootNote: string;
  scaleNotes: ScaleNote[];
  onSelectScale: (scale: string) => void;
}

export function ScaleInfo({ selectedScale, rootNote, scaleNotes, onSelectScale }: ScaleInfoProps) {
  const currentScale = SCALE_DEFINITIONS[selectedScale];
  
  if (!currentScale) return null;

  const formulaSteps = getFormulaSteps(currentScale.formula);
  
  const getRelatedScales = () => {
    const related = [];
    
    if (selectedScale === 'major') {
      related.push({ key: 'natural-minor', name: `${rootNote} Natural Minor (relative)` });
      related.push({ key: 'pentatonic-major', name: `${rootNote} Pentatonic Major` });
    } else if (selectedScale === 'natural-minor') {
      related.push({ key: 'major', name: `${rootNote} Major` });
      related.push({ key: 'harmonic-minor', name: `${rootNote} Harmonic Minor` });
    } else if (selectedScale === 'pentatonic-major') {
      related.push({ key: 'major', name: `${rootNote} Major` });
      related.push({ key: 'pentatonic-minor', name: `${rootNote} Pentatonic Minor` });
    }
    
    return related.slice(0, 2);
  };

  const relatedScales = getRelatedScales();

  return (
    <div className="bauhaus-card red p-6">
      <h3 className="text-lg font-black text-foreground mb-4 flex items-center">
        <div className="bauhaus-circle w-4 h-4 bg-secondary mr-3"></div>
        SCALE INFORMATION
      </h3>
      
      <div className="space-y-4">
        {/* Current Scale Display */}
        <div>
          <h4 className="font-black text-foreground mb-2 uppercase tracking-wide">
            {rootNote} {currentScale.name}
          </h4>
          <p className="text-sm text-gray-600 font-medium">{currentScale.description}</p>
        </div>

        {/* Scale Formula */}
        <div>
          <h5 className="font-bold text-foreground mb-2 uppercase tracking-wide">INTERVAL FORMULA</h5>
          <div className="flex flex-wrap gap-1">
            {formulaSteps.map((step, index) => (
              <div
                key={index}
                className={`px-2 py-1 border-2 border-black font-bold text-xs ${
                  step.isWhole 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {step.step}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 font-bold mt-1">W = WHOLE STEP, H = HALF STEP</p>
        </div>

        {/* Scale Notes */}
        <div>
          <h5 className="font-bold text-foreground mb-2 uppercase tracking-wide">NOTES IN SCALE</h5>
          <div className="grid grid-cols-4 gap-2">
            {scaleNotes.map((note, index) => (
              <div
                key={`${note.name}-${index}`}
                className="text-center p-2 bg-secondary text-white border-2 border-black font-bold"
              >
                <div className="font-black">{note.name}</div>
                <div className="text-xs">{note.degree}</div>
              </div>
            ))}
            
            {Array.from({ length: Math.max(0, 8 - scaleNotes.length) }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="text-center p-2 bg-gray-200 text-gray-600 border-2 border-black font-bold"
              >
                <div className="font-black">-</div>
                <div className="text-xs">{scaleNotes.length + index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Usage */}
        <div>
          <h5 className="font-bold text-foreground mb-2 uppercase tracking-wide">COMMON USAGE</h5>
          <p className="text-sm text-gray-600 font-medium">{currentScale.usage}</p>
        </div>

        {/* Related Scales */}
        {relatedScales.length > 0 && (
          <div>
            <h5 className="font-bold text-foreground mb-2 uppercase tracking-wide">RELATED SCALES</h5>
            <div className="flex flex-wrap gap-2">
              {relatedScales.map((scale) => (
                <button
                  key={scale.key}
                  onClick={() => onSelectScale(scale.key)}
                  className="bauhaus-btn accent px-3 py-2 text-xs"
                >
                  {scale.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
