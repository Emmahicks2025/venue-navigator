import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventsManager } from '@/components/admin/EventsManager';
import { VenueMapsManager } from '@/components/admin/VenueMapsManager';
import { Calendar, Map, RefreshCw, Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AdminPage = () => {
  const [seeding, setSeeding] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSeedWorldCup = async () => {
    setSeeding(true);
    try {
      const { data, error } = await supabase.functions.invoke('seed-world-cup-events');
      if (error) throw error;
      toast.success(`Seeded ${data.seeded} World Cup matches successfully!`);
    } catch (error: any) {
      console.error('Error seeding:', error);
      toast.error(error.message || 'Failed to seed World Cup events');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin privileges to access this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Event Management</h1>
            <p className="text-muted-foreground mt-1">Add events, upload SVG maps, and manage ticket data</p>
          </div>
          <Button 
            onClick={handleSeedWorldCup} 
            disabled={seeding}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
            {seeding ? 'Seeding...' : 'Seed World Cup Data'}
          </Button>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="venues" className="gap-2">
              <Map className="w-4 h-4" />
              Venue Maps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <EventsManager />
          </TabsContent>

          <TabsContent value="venues">
            <VenueMapsManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;
