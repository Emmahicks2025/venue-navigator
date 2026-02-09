import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventsManager } from '@/components/admin/EventsManager';
import { VenueMapsManager } from '@/components/admin/VenueMapsManager';
import { BulkUploadMaps } from '@/components/admin/BulkUploadMaps';
import { FifaEventsManager } from '@/components/admin/FifaEventsManager';
import { LiveChatManager } from '@/components/admin/LiveChatManager';
import { TicketRemarksManager } from '@/components/admin/TicketRemarksManager';
import { OrdersManager } from '@/components/admin/OrdersManager';
import { Calendar, Map, Loader2, ShieldAlert, Trophy, MessageCircle, Ticket, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AdminPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-6">
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="fifa" className="gap-2">
              <Trophy className="w-4 h-4" />
              FIFA World Cup
            </TabsTrigger>
            <TabsTrigger value="venues" className="gap-2">
              <Map className="w-4 h-4" />
              Venue Maps
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="tickets" className="gap-2">
              <Ticket className="w-4 h-4" />
              Tickets
            </TabsTrigger>
            <TabsTrigger value="live-chat" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Live Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <EventsManager />
          </TabsContent>

          <TabsContent value="fifa">
            <FifaEventsManager />
          </TabsContent>

          <TabsContent value="venues">
            <div className="space-y-6">
              <BulkUploadMaps />
              <VenueMapsManager />
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManager />
          </TabsContent>

          <TabsContent value="tickets">
            <TicketRemarksManager />
          </TabsContent>

          <TabsContent value="live-chat">
            <LiveChatManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;
