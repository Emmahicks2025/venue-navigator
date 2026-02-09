import { useNavigate } from 'react-router-dom';
import { Ticket, Package, Send, Calendar, User, LogOut, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserOrders, useUserTickets, useUserTransfers, TicketRow } from '@/hooks/useOrders';
import { EventGroupCard } from '@/components/dashboard/EventGroupCard';
import { OrderCard } from '@/components/dashboard/OrderCard';
import { TransferHistoryCard } from '@/components/dashboard/TransferHistoryCard';

/** Group tickets by event_id */
function groupTicketsByEvent(tickets: TicketRow[]): Map<string, TicketRow[]> {
  const map = new Map<string, TicketRow[]>();
  for (const t of tickets) {
    const group = map.get(t.event_id) || [];
    group.push(t);
    map.set(t.event_id, group);
  }
  return map;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: orders = [], isLoading: ordersLoading } = useUserOrders();
  const { data: tickets = [], isLoading: ticketsLoading } = useUserTickets();
  const { data: transfers = [], isLoading: transfersLoading } = useUserTransfers();

  // Redirect if not logged in
  if (!authLoading && !user) {
    navigate('/auth');
    return null;
  }

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  const now = new Date();
  const upcomingTickets = tickets.filter(
    (t) => t.status === 'active' && new Date(t.event_date) >= now
  );
  const pastTickets = tickets.filter(
    (t) => t.status !== 'active' || new Date(t.event_date) < now
  );

  const upcomingGroups = groupTicketsByEvent(upcomingTickets);
  const pastGroups = groupTicketsByEvent(pastTickets);

  const isLoading = ordersLoading || ticketsLoading || transfersLoading;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                My Dashboard
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-6 bg-secondary/50 p-1 rounded-xl h-auto">
            <TabsTrigger value="upcoming" className="gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-card rounded-lg">
              <Ticket className="w-4 h-4 hidden sm:inline" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-card rounded-lg">
              <Calendar className="w-4 h-4 hidden sm:inline" />
              Past
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-card rounded-lg">
              <Package className="w-4 h-4 hidden sm:inline" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="transfers" className="gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-card rounded-lg">
              <Send className="w-4 h-4 hidden sm:inline" />
              Transfers
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Tickets */}
          <TabsContent value="upcoming">
            {isLoading ? (
              <LoadingState />
            ) : upcomingGroups.size > 0 ? (
              <div className="space-y-4">
                {Array.from(upcomingGroups.entries()).map(([eventId, groupTickets]) => (
                  <EventGroupCard key={eventId} eventId={eventId} tickets={groupTickets} orders={orders} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Ticket className="w-12 h-12 text-muted-foreground" />}
                title="No upcoming events"
                description="When you purchase tickets, your upcoming events will appear here."
                actionLabel="Browse Events"
                actionHref="/"
              />
            )}
          </TabsContent>

          {/* Past Tickets */}
          <TabsContent value="past">
            {isLoading ? (
              <LoadingState />
            ) : pastGroups.size > 0 ? (
              <div className="space-y-4">
                {Array.from(pastGroups.entries()).map(([eventId, groupTickets]) => (
                  <EventGroupCard key={eventId} eventId={eventId} tickets={groupTickets} orders={orders} isPast />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Calendar className="w-12 h-12 text-muted-foreground" />}
                title="No past events"
                description="Your event history will be shown here after you attend events."
              />
            )}
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            {isLoading ? (
              <LoadingState />
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} tickets={tickets} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Package className="w-12 h-12 text-muted-foreground" />}
                title="No orders yet"
                description="Your order history will appear here after your first purchase."
                actionLabel="Browse Events"
                actionHref="/"
              />
            )}
          </TabsContent>

          {/* Transfers */}
          <TabsContent value="transfers">
            {isLoading ? (
              <LoadingState />
            ) : transfers.length > 0 ? (
              <div className="space-y-4">
                {transfers.map((transfer) => {
                  const relatedTicket = tickets.find((t) => t.id === transfer.ticket_id);
                  return (
                    <TransferHistoryCard
                      key={transfer.id}
                      transfer={transfer}
                      ticket={relatedTicket}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={<Send className="w-12 h-12 text-muted-foreground" />}
                title="No transfers"
                description="When you transfer tickets, the history will appear here."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

const LoadingState = () => (
  <div className="flex items-center justify-center py-16">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) => (
  <div className="text-center py-16">
    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="font-display text-xl font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>
    {actionLabel && actionHref && (
      <a href={actionHref}>
        <Button className="bg-primary hover:bg-primary/90">{actionLabel}</Button>
      </a>
    )}
  </div>
);

export default DashboardPage;
