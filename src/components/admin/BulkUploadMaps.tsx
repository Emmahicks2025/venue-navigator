import { useState } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// All known venue SVG filenames (from public/venue-maps/)
const VENUE_SVG_FILES = [
  '713 Music Hall', 'Akron Stadium', 'Allstate Arena', 'Amalie Arena', 'Amerant Bank Arena',
  'American Airlines Center', 'Ameris Bank Amphitheatre', 'Angel of the Winds Arena',
  'Arizona Financial Theatre', 'Arrowhead Stadium', 'ATT Stadium', 'Atlanta Symphony Hall',
  'Atrium Health Amphitheater', 'Ball Arena', 'Barclays Center', 'Baxter Arena',
  'Bayou Music Center', 'BC Place Stadium', 'Beacon Theatre', 'Bellagio', 'Bellco Theatre',
  'BMO Field', 'Bobby Dodd Stadium', 'Bourbon Theatre', 'Broadmoor World Arena',
  'Buell Theatre', 'Cadillac Palace Theatre', 'Cellairis Amphitheatre', 'Chase Center',
  'CHI Health Center', 'CIBC Theatre', 'Climate Pledge Arena', 'Credit Union 1 Amphitheatre',
  'Crypto.com Arena', 'Cure Insurance Arena', 'Cynthia Woods Mitchell Pavilion',
  'Desert Diamond Arena', 'Dickies Arena', 'Dolby Live at Park MGM', 'Dos Equis Pavilion',
  'Dreyfoos Hall at Kravis Center', 'EchoPark Speedway', 'Empower Field at Mile High',
  'Estadio Azteca', 'Excalibur', 'Fenway Park', 'Fiddlers Green Amphitheatre',
  'Fillmore Auditorium Denver', 'Fontainebleau Las Vegas', 'Forest Hills Stadium',
  'Fox Theatre', 'Freedom Mortgage Pavilion', 'Gas South Arena', 'Gershwin Theatre',
  'Gillette Stadium', 'Globe Life Field', 'Hard Rock Live', 'Hard Rock Stadium',
  'Heartland Events Center at the Nebraska State Fair', 'Hollywood Bowl', 'Hollywood Palladium',
  'House of Blues Dallas', 'Imperial Theatre', 'Intuit Dome', 'iTHINK Financial Amphitheatre',
  'Jiffy Lube Live', 'Kaseya Center', 'Kia Forum', 'Las Vegas Motor Speedway',
  'Leader Bank Pavilion', "Levi's Stadium", 'Lincoln Financial Field', 'loanDepot Park',
  'Lumen Field', 'Lyric Theatre', 'Madison Square Garden', 'Mandalay Bay',
  'Mercedes-Benz Stadium', 'MetLife Stadium', 'MGM Grand Garden Arena',
  'MGM Music Hall at Fenway', 'Michelob Ultra Arena', 'Minskoff Theatre', 'Mirage',
  'Mortgage Matchup Center', 'MSG Sphere', 'Nebraska Memorial Stadium',
  'New Amsterdam Theatre', 'New York-New York', 'NRG Stadium', 'O2 Arena',
  'Pantages Theatre', 'Paramount Theatre Seattle', 'Park MGM', 'Pinewood Bowl Theater',
  'Pinnacle Bank Arena', 'PNC Bank Arts Center', 'Prudential Center',
  'Radio City Music Hall', 'Rio Las Vegas', 'Roadrunner', 'Rosemont Theatre',
  'Royal Albert Hall', 'Santander Arena', 'ShoWare Center', 'Smart Financial Centre',
  'SoFi Stadium', 'Soldier Field', '_general',
];

export function BulkUploadMaps() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ uploaded: number; skipped: number; failed: number } | null>(null);

  const handleBulkUpload = async () => {
    setUploading(true);
    setProgress(0);
    setResults(null);

    let uploaded = 0;
    let skipped = 0;
    let failed = 0;
    const total = VENUE_SVG_FILES.length;

    for (let i = 0; i < VENUE_SVG_FILES.length; i++) {
      const name = VENUE_SVG_FILES[i];
      setProgress(Math.round(((i + 1) / total) * 100));

      try {
        // Check if already exists in Firestore
        const existing = await getDocs(
          query(collection(db, 'venue_maps'), where('venue_name', '==', name))
        );
        if (!existing.empty) {
          skipped++;
          continue;
        }

        // Fetch SVG from static files
        const response = await fetch(`/venue-maps/${encodeURIComponent(name)}.svg`);
        if (!response.ok) {
          console.warn(`[BulkUpload] Failed to fetch ${name}: ${response.status}`);
          failed++;
          continue;
        }

        const svgContent = await response.text();
        if (!svgContent.includes('<svg')) {
          console.warn(`[BulkUpload] Invalid SVG content for ${name}`);
          failed++;
          continue;
        }

        // Upload to Firestore
        await addDoc(collection(db, 'venue_maps'), {
          venue_name: name,
          svg_content: svgContent,
          venue_city: null,
          venue_state: null,
          venue_country: 'USA',
          capacity: null,
          venue_type: 'stadium',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        uploaded++;
      } catch (err) {
        console.error(`[BulkUpload] Error for ${name}:`, err);
        failed++;
      }
    }

    setResults({ uploaded, skipped, failed });
    setUploading(false);
    toast.success(`Bulk upload complete: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Bulk Upload SVG Maps to Firestore
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This will upload all {VENUE_SVG_FILES.length} static SVG maps from the app bundle to Firestore.
          Maps that already exist in Firestore will be skipped.
        </p>

        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading... {progress}%
            </p>
          </div>
        )}

        {results && (
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1 text-green-500">
              <CheckCircle className="w-4 h-4" /> {results.uploaded} uploaded
            </span>
            <span className="text-muted-foreground">{results.skipped} skipped</span>
            {results.failed > 0 && (
              <span className="flex items-center gap-1 text-destructive">
                <AlertCircle className="w-4 h-4" /> {results.failed} failed
              </span>
            )}
          </div>
        )}

        <Button onClick={handleBulkUpload} disabled={uploading} className="gap-2">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Start Bulk Upload'}
        </Button>
      </CardContent>
    </Card>
  );
}
