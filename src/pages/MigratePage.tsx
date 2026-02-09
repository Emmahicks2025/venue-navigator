import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const SUPABASE_URL = 'https://zmgkwcsyujpoawdpdnce.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZ2t3Y3N5dWpwb2F3ZHBkbmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMDQ2MjksImV4cCI6MjA4NTg4MDYyOX0.RS_qYkaUd79sBi7azOEoOqHfDeS2xdAkWRjf_8vot5k';

interface MigrationStatus {
  events: 'idle' | 'loading' | 'done' | 'error';
  performer_images: 'idle' | 'loading' | 'done' | 'error';
  eventsCount: number;
  imagesCount: number;
  error?: string;
}

async function fetchFromSupabase(table: string): Promise<any[]> {
  const allRows: any[] = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?select=*&order=id&offset=${offset}&limit=${limit}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    if (!res.ok) throw new Error(`Failed to fetch ${table}: ${res.statusText}`);
    const data = await res.json();
    allRows.push(...data);
    if (data.length < limit) break;
    offset += limit;
  }
  return allRows;
}

const MigratePage = () => {
  const { isAdmin } = useAuth();
  const [status, setStatus] = useState<MigrationStatus>({
    events: 'idle',
    performer_images: 'idle',
    eventsCount: 0,
    imagesCount: 0,
  });
  const [migrating, setMigrating] = useState(false);

  const migrateEvents = async () => {
    setStatus((s) => ({ ...s, events: 'loading' }));
    try {
      const events = await fetchFromSupabase('events');

      // Check existing count in Firestore
      const existing = await getDocs(collection(db, 'events'));
      if (existing.size > 0) {
        const proceed = window.confirm(
          `Firestore already has ${existing.size} events. This will overwrite them. Continue?`
        );
        if (!proceed) {
          setStatus((s) => ({ ...s, events: 'idle' }));
          return;
        }
      }

      for (const event of events) {
        const id = event.id;
        delete event.created_at;
        delete event.updated_at;
        await setDoc(doc(db, 'events', id), {
          ...event,
          id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      setStatus((s) => ({ ...s, events: 'done', eventsCount: events.length }));
      toast.success(`Migrated ${events.length} events to Firestore`);
    } catch (err: any) {
      setStatus((s) => ({ ...s, events: 'error', error: err.message }));
      toast.error(`Events migration failed: ${err.message}`);
    }
  };

  const migratePerformerImages = async () => {
    setStatus((s) => ({ ...s, performer_images: 'loading' }));
    try {
      const images = await fetchFromSupabase('performer_images');

      for (const img of images) {
        const id = img.id;
        await setDoc(doc(db, 'performer_images', id), {
          performer_name: img.performer_name,
          image_url: img.image_url,
          image_width: img.image_width,
          image_height: img.image_height,
          source: img.source,
          created_at: img.created_at,
          updated_at: img.updated_at,
        });
      }

      setStatus((s) => ({ ...s, performer_images: 'done', imagesCount: images.length }));
      toast.success(`Migrated ${images.length} performer images to Firestore`);
    } catch (err: any) {
      setStatus((s) => ({ ...s, performer_images: 'error', error: err.message }));
      toast.error(`Performer images migration failed: ${err.message}`);
    }
  };

  const migrateAll = async () => {
    setMigrating(true);
    await migrateEvents();
    await migratePerformerImages();
    setMigrating(false);
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Admin Only</h1>
          <p className="text-muted-foreground mt-2">You must be an admin to access data migration.</p>
        </div>
      </Layout>
    );
  }

  const StatusIcon = ({ s }: { s: string }) => {
    if (s === 'loading') return <Loader2 className="w-5 h-5 animate-spin text-primary" />;
    if (s === 'done') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (s === 'error') return <AlertCircle className="w-5 h-5 text-destructive" />;
    return <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Data Migration</h1>
        <p className="text-muted-foreground mb-8">
          Migrate data from the old database to Firebase Firestore. This is a one-time operation.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl">
            <StatusIcon s={status.events} />
            <div className="flex-1">
              <p className="font-medium text-foreground">Events</p>
              <p className="text-sm text-muted-foreground">
                {status.events === 'done'
                  ? `${status.eventsCount} events migrated`
                  : status.events === 'loading'
                  ? 'Migrating events...'
                  : '261 events to migrate'}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={migrating || status.events === 'loading'}
              onClick={migrateEvents}
            >
              Migrate
            </Button>
          </div>

          <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl">
            <StatusIcon s={status.performer_images} />
            <div className="flex-1">
              <p className="font-medium text-foreground">Performer Images</p>
              <p className="text-sm text-muted-foreground">
                {status.performer_images === 'done'
                  ? `${status.imagesCount} images migrated`
                  : status.performer_images === 'loading'
                  ? 'Migrating images...'
                  : '136 performer images to migrate'}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={migrating || status.performer_images === 'loading'}
              onClick={migratePerformerImages}
            >
              Migrate
            </Button>
          </div>
        </div>

        {status.error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm mb-6">
            {status.error}
          </div>
        )}

        <Button
          onClick={migrateAll}
          disabled={migrating}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-lg"
        >
          {migrating ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Migrating...
            </span>
          ) : (
            'Migrate All Data'
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          After migration, verify your data in Firebase Console then remove this page.
        </p>
      </div>
    </Layout>
  );
};

export default MigratePage;
