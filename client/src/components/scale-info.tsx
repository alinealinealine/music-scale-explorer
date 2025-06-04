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
    <div className="minimal-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Scale Information
      </h3>
      
      <div className="space-y-4">
        {/* Current Scale Display */}
        <div>
          <h4 className="font-semibold text-foreground mb-2">
            {rootNote} {currentScale.name}
          </h4>
          <p className="text-sm text-muted-foreground">{currentScale.description}</p>
        </div>

        {/* Scale Formula */}
        <div>
          <h5 className="font-medium text-foreground mb-2">Interval Formula</h5>
          <div className="flex flex-wrap gap-1">
            {formulaSteps.map((step, index) => (
              <div
                key={index}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  step.isWhole 
                    ? 'bg-scale-highlight/10 text-accent border border-accent/20' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.step}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">W = Whole Step, H = Half Step</p>
        </div>

        {/* Scale Notes */}
        <div>
          <h5 className="font-medium text-foreground mb-2">Notes in Scale</h5>
          <div className="grid grid-cols-4 gap-2">
            {scaleNotes.map((note, index) => (
              <div
                key={`${note.name}-${index}`}
                className="text-center p-2 bg-secondary text-secondary-foreground rounded font-medium"
              >
                <div className="font-semibold">{note.name}</div>
                <div className="text-xs opacity-80">{note.degree}</div>
              </div>
            ))}
            
            {Array.from({ length: Math.max(0, 8 - scaleNotes.length) }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="text-center p-2 bg-muted text-muted-foreground rounded"
              >
                <div className="font-medium">-</div>
                <div className="text-xs">{scaleNotes.length + index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Usage */}
        <div>
          <h5 className="font-medium text-foreground mb-2">Common Usage</h5>
          <p className="text-sm text-muted-foreground">{currentScale.usage}</p>
        </div>

        {/* Related Scales */}
        {relatedScales.length > 0 && (
          <div>
            <h5 className="font-medium text-foreground mb-2">Related Scales</h5>
            <div className="flex flex-wrap gap-2">
              {relatedScales.map((scale) => (
                <button
                  key={scale.key}
                  onClick={() => onSelectScale(scale.key)}
                  className="minimal-btn accent px-3 py-2 text-xs"
                >
                  {scale.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
