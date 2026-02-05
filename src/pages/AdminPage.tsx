import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventsManager } from '@/components/admin/EventsManager';
import { VenueMapsManager } from '@/components/admin/VenueMapsManager';
import { Calendar, Map, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminPage = () => {
  const [seeding, setSeeding] = useState(false);

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
