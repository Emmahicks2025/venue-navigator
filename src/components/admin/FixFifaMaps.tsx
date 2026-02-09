import { useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { venueNames } from '@/data/venues';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, Trophy, MapPin } from 'lucide-react';
import { toast } from 'sonner';

// Mapping of FIFA 2026 venue names (as they may appear in Firestore)
// to the exact SVG map filename (without .svg extension)
const FIFA_VENUE_TO_SVG: Record<string, string> = {
  'MetLife Stadium': 'MetLife Stadium',
  'SoFi Stadium': 'SoFi Stadium',
  'AT&T Stadium': 'ATT Stadium',
  'ATT Stadium': 'ATT Stadium',
  'NRG Stadium': 'NRG Stadium',
  'Hard Rock Stadium': 'Hard Rock Stadium',
  'Mercedes-Benz Stadium': 'Mercedes-Benz Stadium',
  'Lincoln Financial Field': 'Lincoln Financial Field',
  'Lumen Field': 'Lumen Field',
  'Gillette Stadium': 'Gillette Stadium',
  'Arrowhead Stadium': 'Arrowhead Stadium',
  'GEHA Field at Arrowhead Stadium': 'Arrowhead Stadium',
  "Levi's Stadium": "Levi's Stadium",
  'BC Place Stadium': 'BC Place Stadium',
  'BC Place': 'BC Place Stadium',
  'BMO Field': 'BMO Field',
  'Estadio Azteca': 'Estadio Azteca',
  'Akron Stadium': 'Akron Stadium',
  'Estadio Akron': 'Akron Stadium',
  'Globe Life Field': 'Globe Life Field',
  'Bobby Dodd Stadium': 'Bobby Dodd Stadium',
  'Soldier Field': 'Soldier Field',
  'Fenway Park': 'Fenway Park',
  'loanDepot Park': 'loanDepot Park',
  'Empower Field at Mile High': 'Empower Field at Mile High',
};

// Additional fuzzy matching: strip suffixes like " - Mexico", " - Canada" etc.
function findSvgMapName(venueName: string): string | null {
  // Direct match
  if (FIFA_VENUE_TO_SVG[venueName]) {
    return FIFA_VENUE_TO_SVG[venueName];
  }

  // Try stripping location suffixes (e.g., "Akron Stadium - Mexico" → "Akron Stadium")
  const stripped = venueName.replace(/\s*[-–—]\s*(Mexico|Canada|USA|United States|UK).*$/i, '').trim();
  if (FIFA_VENUE_TO_SVG[stripped]) {
    return FIFA_VENUE_TO_SVG[stripped];
  }

  // Try matching against available SVG filenames directly
  const normalizedInput = venueName.replace(/&/g, '').replace(/\s*[-–—]\s*.*$/, '').trim();
  const match = venueNames.find((name) => {
    const normalizedMap = name.replace(/&/g, '');
    return normalizedMap.toLowerCase() === normalizedInput.toLowerCase();
  });

  return match || null;
}

interface FixResult {
  eventId: string;
  eventName: string;
  venueName: string;
  oldSvgMap: string | null;
  newSvgMap: string;
}

export function FixFifaMaps() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FixResult[]>([]);
  const [done, setDone] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);

  const scanAndFix = async (dryRun: boolean) => {
    setLoading(true);
    setResults([]);
    setDone(false);

    try {
      const snapshot = await getDocs(collection(db, 'events'));
      const allEvents = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

      // Filter to FIFA World Cup events
      const fifaEvents = allEvents.filter((e) =>
        e.name?.toLowerCase().includes('world cup')
      );

      const fixes: FixResult[] = [];

      for (const event of fifaEvents) {
        const currentMap = event.svg_map_name || null;
        const matchedMap = findSvgMapName(event.venue_name || '');

        if (matchedMap && !currentMap) {
          fixes.push({
            eventId: event.id,
            eventName: event.name,
            venueName: event.venue_name,
            oldSvgMap: currentMap,
            newSvgMap: matchedMap,
          });

          if (!dryRun) {
            await updateDoc(doc(db, 'events', event.id), {
              svg_map_name: matchedMap,
              updated_at: new Date().toISOString(),
            });
          }
        }
      }

      setResults(fixes);
      setDone(true);

      if (dryRun) {
        toast.info(`Found ${fixes.length} FIFA events to update (out of ${fifaEvents.length} total)`);
      } else {
        toast.success(`Updated ${fixes.length} FIFA events with correct SVG maps`);
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          Fix FIFA World Cup SVG Maps
        </CardTitle>
        <CardDescription>
          Automatically match FIFA World Cup 2026 events to the correct venue SVG maps based on venue name.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setPreviewMode(true);
              scanAndFix(true);
            }}
            disabled={loading}
            variant="outline"
          >
            {loading && previewMode ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Preview Changes
          </Button>
          <Button
            onClick={() => {
              setPreviewMode(false);
              scanAndFix(false);
            }}
            disabled={loading}
          >
            {loading && !previewMode ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Apply Fixes
          </Button>
        </div>

        {done && results.length === 0 && (
          <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground text-center">
            ✅ All FIFA World Cup events already have correct SVG maps assigned.
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            <p className="text-sm font-medium text-foreground">
              {previewMode ? 'Preview' : 'Applied'}: {results.length} updates
            </p>
            {results.map((r) => (
              <div
                key={r.eventId}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg text-sm"
              >
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{r.eventName}</p>
                  <p className="text-muted-foreground text-xs">
                    Venue: {r.venueName}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-destructive line-through">
                      {r.oldSvgMap || 'None'}
                    </span>
                    <span>→</span>
                    <span className="text-green-500 font-medium">{r.newSvgMap}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
