import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { venueNames } from '@/data/venues';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Plus, Pencil, Trash2, Search, Calendar, MapPin, DollarSign, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { formatPrice, formatDate } from '@/data/events';

interface Event {
  id: string;
  name: string;
  performer: string;
  category: string;
  venue_name: string;
  venue_city: string;
  venue_state: string | null;
  date: string;
  time: string;
  description: string | null;
  is_featured: boolean;
  min_price: number;
  max_price: number;
  svg_map_name: string | null;
  ticket_url: string | null;
  performer_image: string | null;
  source: string | null;
  match_number: number | null;
  round: string | null;
  group_name: string | null;
  home_team: string | null;
  away_team: string | null;
}

export function EventsManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,venue_name.ilike.%${searchQuery}%,performer.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data as Event[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast.success('Event deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete event');
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Events ({events?.length || 0})</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <EventForm 
                onSuccess={() => {
                  setIsAddDialogOpen(false);
                  queryClient.invalidateQueries({ queryKey: ['admin-events'] });
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events by name, venue, or performer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading events...</div>
        ) : events?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No events found. Click "Add Event" or "Seed World Cup Data" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>SVG Map</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events?.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground">{event.performer}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3" />
                        {event.venue_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {event.venue_city}{event.venue_state ? `, ${event.venue_state}` : ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {formatDate(event.date)}
                      </div>
                      <div className="text-xs text-muted-foreground">{event.time}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="w-3 h-3" />
                        {formatPrice(event.min_price)} - {formatPrice(event.max_price)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.svg_map_name ? (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {event.svg_map_name}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setEditingEvent(event)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Event</DialogTitle>
                            </DialogHeader>
                            <EventForm 
                              event={event}
                              onSuccess={() => {
                                setEditingEvent(null);
                                queryClient.invalidateQueries({ queryKey: ['admin-events'] });
                              }} 
                            />
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this event?')) {
                              deleteMutation.mutate(event.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EventForm({ event, onSuccess }: { event?: Event; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: event?.name || '',
    performer: event?.performer || '',
    category: event?.category || 'sports',
    venue_name: event?.venue_name || '',
    venue_city: event?.venue_city || '',
    venue_state: event?.venue_state || '',
    date: event?.date || '',
    time: event?.time || '19:00',
    description: event?.description || '',
    is_featured: event?.is_featured || false,
    min_price: event?.min_price || 0,
    max_price: event?.max_price || 0,
    svg_map_name: event?.svg_map_name || '',
    ticket_url: event?.ticket_url || '',
    performer_image: event?.performer_image || '',
    source: event?.source || '',
    match_number: event?.match_number || null,
    round: event?.round || '',
    group_name: event?.group_name || '',
    home_team: event?.home_team || '',
    away_team: event?.away_team || '',
  });

  const [svgMapOpen, setSvgMapOpen] = useState(false);

  // Use local venue names (SVG files in public/venue-maps/) as the source
  const venueMaps = useMemo(() => [...venueNames].sort(), []);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const eventData = {
        ...formData,
        svg_map_name: formData.svg_map_name || null,
        ticket_url: formData.ticket_url || null,
        performer_image: formData.performer_image || null,
        source: formData.source || null,
        match_number: formData.match_number || null,
        round: formData.round || null,
        group_name: formData.group_name || null,
        home_team: formData.home_team || null,
        away_team: formData.away_team || null,
      };

      if (event?.id) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert(eventData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(event ? 'Event updated successfully' : 'Event created successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save event');
    },
  });

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        saveMutation.mutate();
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Event Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="performer">Performer / Teams *</Label>
          <Input
            id="performer"
            value={formData.performer}
            onChange={(e) => setFormData({ ...formData, performer: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="concerts">Concerts</SelectItem>
              <SelectItem value="theater">Theater</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="festivals">Festivals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="venue_name">Venue Name *</Label>
          <Input
            id="venue_name"
            value={formData.venue_name}
            onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="venue_city">City *</Label>
          <Input
            id="venue_city"
            value={formData.venue_city}
            onChange={(e) => setFormData({ ...formData, venue_city: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="venue_state">State</Label>
          <Input
            id="venue_state"
            value={formData.venue_state}
            onChange={(e) => setFormData({ ...formData, venue_state: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min_price">Min Price ($)</Label>
          <Input
            id="min_price"
            type="number"
            step="0.01"
            value={formData.min_price}
            onChange={(e) => setFormData({ ...formData, min_price: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_price">Max Price ($)</Label>
          <Input
            id="max_price"
            type="number"
            step="0.01"
            value={formData.max_price}
            onChange={(e) => setFormData({ ...formData, max_price: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label>SVG Map Name</Label>
          <Popover open={svgMapOpen} onOpenChange={setSvgMapOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={svgMapOpen}
                className="w-full justify-between font-normal"
              >
                {formData.svg_map_name || "Select venue map..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search venue maps..." />
                <CommandList>
                  <CommandEmpty>No venue map found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="__none__"
                      onSelect={() => {
                        setFormData({ ...formData, svg_map_name: '' });
                        setSvgMapOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", !formData.svg_map_name ? "opacity-100" : "opacity-0")} />
                      None
                    </CommandItem>
                    {venueMaps?.map((name) => (
                      <CommandItem
                        key={name}
                        value={name}
                        onSelect={() => {
                          setFormData({ ...formData, svg_map_name: name });
                          setSvgMapOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", formData.svg_map_name === name ? "opacity-100" : "opacity-0")} />
                        {name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ticket_url">Ticket URL</Label>
          <Input
            id="ticket_url"
            type="url"
            value={formData.ticket_url}
            onChange={(e) => setFormData({ ...formData, ticket_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="performer_image">Performer Image URL</Label>
          <Input
            id="performer_image"
            type="url"
            value={formData.performer_image}
            onChange={(e) => setFormData({ ...formData, performer_image: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="e.g., ticketmaster, manual"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="home_team">Home Team</Label>
          <Input
            id="home_team"
            value={formData.home_team}
            onChange={(e) => setFormData({ ...formData, home_team: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="away_team">Away Team</Label>
          <Input
            id="away_team"
            value={formData.away_team}
            onChange={(e) => setFormData({ ...formData, away_team: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="round">Round</Label>
          <Input
            id="round"
            value={formData.round}
            onChange={(e) => setFormData({ ...formData, round: e.target.value })}
            placeholder="e.g., Group Stage, Final"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_featured"
          checked={formData.is_featured}
          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="is_featured">Featured Event</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}
