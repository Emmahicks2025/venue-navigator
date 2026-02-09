import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, orderBy, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { venueNames } from '@/data/venues';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import {
  Pencil, Trash2, Search, Calendar, MapPin, DollarSign,
  ChevronsUpDown, Check, Trophy, Filter, Map,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { formatPrice, formatDate } from '@/data/events';

interface FifaEvent {
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

const ROUND_OPTIONS = [
  'Group Stage',
  'Round of 32',
  'Round of 16',
  'Quarter-Final',
  'Semi-Final',
  'Third Place',
  'Final',
];

const GROUP_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export function FifaEventsManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roundFilter, setRoundFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [mapFilter, setMapFilter] = useState<string>('all');
  const [editingEvent, setEditingEvent] = useState<FifaEvent | null>(null);
  const queryClient = useQueryClient();

  const { data: allFifaEvents, isLoading } = useQuery({
    queryKey: ['admin-fifa-events'],
    queryFn: async () => {
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FifaEvent));
      return all.filter((e) => e.name?.toLowerCase().includes('world cup'));
    },
  });

  const filteredEvents = useMemo(() => {
    if (!allFifaEvents) return [];
    return allFifaEvents.filter((e) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          e.name.toLowerCase().includes(q) ||
          e.venue_name.toLowerCase().includes(q) ||
          e.home_team?.toLowerCase().includes(q) ||
          e.away_team?.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (roundFilter !== 'all' && e.round !== roundFilter) return false;
      if (groupFilter !== 'all' && e.group_name !== groupFilter) return false;
      if (mapFilter === 'assigned' && !e.svg_map_name) return false;
      if (mapFilter === 'unassigned' && e.svg_map_name) return false;
      return true;
    });
  }, [allFifaEvents, searchQuery, roundFilter, groupFilter, mapFilter]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'events', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-fifa-events'] });
      toast.success('Event deleted');
    },
    onError: (err: any) => toast.error(err.message || 'Delete failed'),
  });

  const stats = useMemo(() => {
    if (!allFifaEvents) return { total: 0, withMap: 0, withoutMap: 0 };
    const withMap = allFifaEvents.filter((e) => e.svg_map_name).length;
    return { total: allFifaEvents.length, withMap, withoutMap: allFifaEvents.length - withMap };
  }, [allFifaEvents]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Map className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.withMap}</p>
                <p className="text-sm text-muted-foreground">Maps Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Map className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.withoutMap}</p>
                <p className="text-sm text-muted-foreground">Missing Maps</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            FIFA World Cup 2026 Events ({filteredEvents.length})
          </CardTitle>
          <CardDescription>Manage match details, SVG map assignments, and pricing for all World Cup matches.</CardDescription>

          <div className="flex flex-wrap gap-3 mt-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search teams, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roundFilter} onValueChange={setRoundFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Round" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rounds</SelectItem>
                {ROUND_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {GROUP_OPTIONS.map((g) => (
                  <SelectItem key={g} value={g}>Group {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={mapFilter} onValueChange={setMapFilter}>
              <SelectTrigger className="w-[160px]">
                <Map className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Map Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Maps</SelectItem>
                <SelectItem value="assigned">Map Assigned</SelectItem>
                <SelectItem value="unassigned">No Map</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading FIFA events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No matching events found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead>Round / Group</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>SVG Map</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {event.match_number || '—'}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">
                          {event.home_team && event.away_team
                            ? `${event.home_team} vs ${event.away_team}`
                            : event.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {event.round && (
                            <Badge variant="outline" className="text-xs">
                              {event.round}
                            </Badge>
                          )}
                          {event.group_name && (
                            <Badge variant="secondary" className="text-xs">
                              Grp {event.group_name}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[140px]">{event.venue_name}</span>
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
                          {formatPrice(event.min_price)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.svg_map_name ? (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                            {event.svg_map_name}
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">None</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingEvent(event)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Delete this FIFA event?')) {
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

      {/* Edit Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              Edit FIFA Match
            </DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <FifaEventForm
              event={editingEvent}
              onSuccess={() => {
                setEditingEvent(null);
                queryClient.invalidateQueries({ queryKey: ['admin-fifa-events'] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FifaEventForm({ event, onSuccess }: { event: FifaEvent; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    home_team: event.home_team || '',
    away_team: event.away_team || '',
    round: event.round || '',
    group_name: event.group_name || '',
    match_number: event.match_number ?? '',
    venue_name: event.venue_name || '',
    venue_city: event.venue_city || '',
    venue_state: event.venue_state || '',
    date: event.date || '',
    time: event.time || '19:00',
    min_price: event.min_price || 0,
    max_price: event.max_price || 0,
    svg_map_name: event.svg_map_name || '',
    performer_image: event.performer_image || '',
    description: event.description || '',
  });

  const [svgMapOpen, setSvgMapOpen] = useState(false);
  const venueMaps = useMemo(() => [...venueNames].sort(), []);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updateData: Record<string, any> = {
        home_team: formData.home_team || null,
        away_team: formData.away_team || null,
        round: formData.round || null,
        group_name: formData.group_name || null,
        match_number: formData.match_number ? Number(formData.match_number) : null,
        venue_name: formData.venue_name,
        venue_city: formData.venue_city,
        venue_state: formData.venue_state || null,
        date: formData.date,
        time: formData.time,
        min_price: formData.min_price,
        max_price: formData.max_price,
        svg_map_name: formData.svg_map_name || null,
        performer_image: formData.performer_image || null,
        description: formData.description || null,
        updated_at: new Date().toISOString(),
      };

      // Update derived fields
      if (formData.home_team && formData.away_team) {
        updateData.name = `${formData.home_team} vs ${formData.away_team} - World Cup${formData.match_number ? ` - Match ${formData.match_number}` : ''}${formData.group_name ? ` (Group ${formData.group_name})` : ''}`;
        updateData.performer = `${formData.home_team} vs ${formData.away_team}`;
      }

      await updateDoc(doc(db, 'events', event.id), updateData);
    },
    onSuccess: () => {
      toast.success('FIFA match updated');
      onSuccess();
    },
    onError: (err: any) => toast.error(err.message || 'Update failed'),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
      {/* Teams */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Home Team</Label>
          <Input value={formData.home_team} onChange={(e) => setFormData({ ...formData, home_team: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Away Team</Label>
          <Input value={formData.away_team} onChange={(e) => setFormData({ ...formData, away_team: e.target.value })} />
        </div>
      </div>

      {/* Round / Group / Match */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Round</Label>
          <Select value={formData.round} onValueChange={(v) => setFormData({ ...formData, round: v })}>
            <SelectTrigger><SelectValue placeholder="Select round" /></SelectTrigger>
            <SelectContent>
              {ROUND_OPTIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Group</Label>
          <Select value={formData.group_name} onValueChange={(v) => setFormData({ ...formData, group_name: v })}>
            <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
              {GROUP_OPTIONS.map((g) => (
                <SelectItem key={g} value={g}>Group {g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Match #</Label>
          <Input type="number" value={formData.match_number} onChange={(e) => setFormData({ ...formData, match_number: e.target.value })} />
        </div>
      </div>

      {/* Venue */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Venue</Label>
          <Input value={formData.venue_name} onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>City</Label>
          <Input value={formData.venue_city} onChange={(e) => setFormData({ ...formData, venue_city: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <Input value={formData.venue_state} onChange={(e) => setFormData({ ...formData, venue_state: e.target.value })} />
        </div>
      </div>

      {/* Date/Time & Price */}
      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Time</Label>
          <Input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Min Price ($)</Label>
          <Input type="number" step="0.01" value={formData.min_price} onChange={(e) => setFormData({ ...formData, min_price: parseFloat(e.target.value) || 0 })} />
        </div>
        <div className="space-y-2">
          <Label>Max Price ($)</Label>
          <Input type="number" step="0.01" value={formData.max_price} onChange={(e) => setFormData({ ...formData, max_price: parseFloat(e.target.value) || 0 })} />
        </div>
      </div>

      {/* SVG Map */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Map className="w-4 h-4" />
          SVG Map Assignment
        </Label>
        <Popover open={svgMapOpen} onOpenChange={setSvgMapOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
              {formData.svg_map_name || 'Select venue map...'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[350px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search venue maps..." />
              <CommandList>
                <CommandEmpty>No venue map found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem value="__none__" onSelect={() => { setFormData({ ...formData, svg_map_name: '' }); setSvgMapOpen(false); }}>
                    <Check className={cn('mr-2 h-4 w-4', !formData.svg_map_name ? 'opacity-100' : 'opacity-0')} />
                    None (Generic Fallback)
                  </CommandItem>
                  {venueMaps.map((name) => (
                    <CommandItem key={name} value={name} onSelect={() => { setFormData({ ...formData, svg_map_name: name }); setSvgMapOpen(false); }}>
                      <Check className={cn('mr-2 h-4 w-4', formData.svg_map_name === name ? 'opacity-100' : 'opacity-0')} />
                      {name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label>Performer Image URL</Label>
        <Input type="url" value={formData.performer_image} onChange={(e) => setFormData({ ...formData, performer_image: e.target.value })} placeholder="https://..." />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Saving...' : 'Update Match'}
        </Button>
      </div>
    </form>
  );
}
