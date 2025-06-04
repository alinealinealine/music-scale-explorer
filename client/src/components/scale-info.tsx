import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    // Return some related scales based on the current selection
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
    
    return related.slice(0, 2); // Limit to 2 related scales
  };

  const relatedScales = getRelatedScales();

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scale Information</h3>
        
        <div className="space-y-4">
          {/* Current Scale Display */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              {rootNote} {currentScale.name}
            </h4>
            <p className="text-sm text-gray-600">{currentScale.description}</p>
          </div>

          {/* Scale Formula */}
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Interval Formula</h5>
            <div className="flex flex-wrap gap-1">
              {formulaSteps.map((step, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={step.isWhole ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200'}
                >
                  {step.step}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">W = Whole Step, H = Half Step</p>
          </div>

          {/* Scale Notes */}
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Notes in Scale</h5>
            <div className="grid grid-cols-4 gap-2">
              {scaleNotes.map((note, index) => (
                <div
                  key={`${note.name}-${index}`}
                  className="text-center p-2 bg-red-500 text-white rounded-lg"
                >
                  <div className="font-medium">{note.name}</div>
                  <div className="text-xs">{note.degree}</div>
                </div>
              ))}
              
              {/* Fill remaining slots for visual consistency */}
              {Array.from({ length: Math.max(0, 8 - scaleNotes.length) }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="text-center p-2 bg-gray-100 text-gray-400 rounded-lg"
                >
                  <div className="font-medium">-</div>
                  <div className="text-xs">{scaleNotes.length + index + 1}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Usage */}
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Common Usage</h5>
            <p className="text-sm text-gray-600">{currentScale.usage}</p>
          </div>

          {/* Related Scales */}
          {relatedScales.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Related Scales</h5>
              <div className="flex flex-wrap gap-2">
                {relatedScales.map((scale) => (
                  <Button
                    key={scale.key}
                    onClick={() => onSelectScale(scale.key)}
                    variant="outline"
                    size="sm"
                    className="text-sm hover:bg-gray-100"
                  >
                    {scale.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
