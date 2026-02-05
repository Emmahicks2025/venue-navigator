import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Pencil, Trash2, Map, Eye, FileCode } from 'lucide-react';
import { toast } from 'sonner';
import { parseSVGSections, SVGSection } from '@/lib/svgParser';

interface VenueMap {
  id: string;
  venue_name: string;
  svg_content: string;
  venue_city: string | null;
  venue_state: string | null;
  venue_country: string | null;
  capacity: number | null;
  venue_type: string | null;
  created_at: string;
  updated_at: string;
}

export function VenueMapsManager() {
  const [selectedMap, setSelectedMap] = useState<VenueMap | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: venueMaps, isLoading } = useQuery({
    queryKey: ['venue-maps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venue_maps')
        .select('*')
        .order('venue_name');
      if (error) throw error;
      return data as VenueMap[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('venue_maps').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-maps'] });
      toast.success('Venue map deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete venue map');
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Venue Maps ({venueMaps?.length || 0})</CardTitle>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="w-4 h-4" />
                Upload SVG Map
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Upload New Venue Map</DialogTitle>
              </DialogHeader>
              <UploadForm 
                onSuccess={() => {
                  setIsUploadDialogOpen(false);
                  queryClient.invalidateQueries({ queryKey: ['venue-maps'] });
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading venue maps...</div>
        ) : venueMaps?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No venue maps uploaded yet. Click "Upload SVG Map" to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venueMaps?.map((venueMap) => (
              <VenueMapCard 
                key={venueMap.id} 
                venueMap={venueMap}
                onEdit={() => {
                  setSelectedMap(venueMap);
                  setIsEditorOpen(true);
                }}
                onDelete={() => {
                  if (confirm('Are you sure you want to delete this venue map?')) {
                    deleteMutation.mutate(venueMap.id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </CardContent>

      {/* SVG Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit SVG Map: {selectedMap?.venue_name}</DialogTitle>
          </DialogHeader>
          {selectedMap && (
            <SVGEditor 
              venueMap={selectedMap}
              onSuccess={() => {
                setIsEditorOpen(false);
                setSelectedMap(null);
                queryClient.invalidateQueries({ queryKey: ['venue-maps'] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function VenueMapCard({ 
  venueMap, 
  onEdit, 
  onDelete 
}: { 
  venueMap: VenueMap; 
  onEdit: () => void;
  onDelete: () => void;
}) {
  const sections = parseSVGSections(venueMap.svg_content);
  
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{venueMap.venue_name}</h3>
          <p className="text-sm text-muted-foreground">
            {venueMap.venue_city}{venueMap.venue_state ? `, ${venueMap.venue_state}` : ''}
          </p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
      
      <div 
        className="aspect-video bg-muted rounded-lg overflow-hidden mb-3 flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: venueMap.svg_content }}
        style={{ 
          maxHeight: '150px',
        }}
      />

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {sections.length} sections
        </span>
        {venueMap.capacity && (
          <span className="text-muted-foreground">
            Capacity: {venueMap.capacity.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    venue_name: '',
    venue_city: '',
    venue_state: '',
    venue_country: 'USA',
    capacity: '',
    venue_type: 'stadium',
    svg_content: '',
  });
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setFormData({ ...formData, svg_content: content });
        
        // Try to extract venue name from filename
        const nameMatch = file.name.replace('.svg', '').replace(/_/g, ' ');
        if (!formData.venue_name) {
          setFormData(prev => ({ ...prev, svg_content: content, venue_name: nameMatch }));
        }
      };
      reader.readAsText(file);
    } else {
      toast.error('Please select a valid SVG file');
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('venue_maps')
        .insert({
          venue_name: formData.venue_name,
          svg_content: formData.svg_content,
          venue_city: formData.venue_city || null,
          venue_state: formData.venue_state || null,
          venue_country: formData.venue_country || 'USA',
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          venue_type: formData.venue_type || 'stadium',
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Venue map uploaded successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload venue map');
    },
  });

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        if (!formData.svg_content) {
          toast.error('Please select an SVG file');
          return;
        }
        saveMutation.mutate();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label>SVG File *</Label>
        <div 
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />
          {fileName ? (
            <div className="flex items-center justify-center gap-2 text-sm">
              <FileCode className="w-5 h-5 text-primary" />
              <span>{fileName}</span>
            </div>
          ) : (
            <div className="text-muted-foreground">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p>Click to select an SVG file</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="venue_city">City</Label>
          <Input
            id="venue_city"
            value={formData.venue_city}
            onChange={(e) => setFormData({ ...formData, venue_city: e.target.value })}
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
        <div className="space-y-2">
          <Label htmlFor="venue_country">Country</Label>
          <Input
            id="venue_country"
            value={formData.venue_country}
            onChange={(e) => setFormData({ ...formData, venue_country: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={saveMutation.isPending || !formData.svg_content}>
          {saveMutation.isPending ? 'Uploading...' : 'Upload Map'}
        </Button>
      </div>
    </form>
  );
}

function SVGEditor({ venueMap, onSuccess }: { venueMap: VenueMap; onSuccess: () => void }) {
  const [sections, setSections] = useState<SVGSection[]>(() => parseSVGSections(venueMap.svg_content));
  const [svgContent, setSvgContent] = useState(venueMap.svg_content);

  const updateMutation = useMutation({
    mutationFn: async () => {
      // Update the SVG content with the new section data
      let updatedSvg = svgContent;
      
      sections.forEach(section => {
        // Update data attributes in the SVG
        const sectionRegex = new RegExp(`(<g[^>]*data-section-id="${section.id}"[^>]*)`, 'g');
        updatedSvg = updatedSvg.replace(sectionRegex, (match) => {
          return match
            .replace(/data-rows="[^"]*"/, `data-rows="${section.rows}"`)
            .replace(/data-seats-per-row="[^"]*"/, `data-seats-per-row="${section.seatsPerRow}"`)
            .replace(/data-price-min="[^"]*"/, `data-price-min="${section.priceMin}"`)
            .replace(/data-price-max="[^"]*"/, `data-price-max="${section.priceMax}"`)
            .replace(/data-current-price="[^"]*"/, `data-current-price="${section.currentPrice}"`)
            .replace(/data-available="[^"]*"/, `data-available="${section.available}"`);
        });
      });

      const { error } = await supabase
        .from('venue_maps')
        .update({ svg_content: updatedSvg })
        .eq('id', venueMap.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('SVG map updated successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update SVG map');
    },
  });

  const updateSection = (index: number, field: keyof SVGSection, value: any) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  return (
    <div className="space-y-6">
      {/* SVG Preview */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h3 className="font-medium mb-3">Map Preview</h3>
        <div 
          className="aspect-video bg-background rounded-lg overflow-hidden flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{ maxHeight: '300px' }}
        />
      </div>

      {/* Sections Editor */}
      <div className="space-y-4">
        <h3 className="font-medium">Section Data ({sections.length} sections)</h3>
        
        {sections.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No sections with data attributes found in this SVG. 
            Make sure sections have data-section-id attributes.
          </p>
        ) : (
          <div className="max-h-[400px] overflow-y-auto space-y-3">
            {sections.map((section, index) => (
              <div key={section.id} className="border rounded-lg p-3 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{section.name}</span>
                  <span className="text-xs text-muted-foreground">ID: {section.id}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Rows</Label>
                    <Input
                      type="number"
                      value={section.rows}
                      onChange={(e) => updateSection(index, 'rows', parseInt(e.target.value) || 0)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Seats/Row</Label>
                    <Input
                      type="number"
                      value={section.seatsPerRow}
                      onChange={(e) => updateSection(index, 'seatsPerRow', parseInt(e.target.value) || 0)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Total Seats</Label>
                    <Input
                      type="number"
                      value={section.totalSeats}
                      onChange={(e) => updateSection(index, 'totalSeats', parseInt(e.target.value) || 0)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Min Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={section.priceMin}
                      onChange={(e) => updateSection(index, 'priceMin', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Max Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={section.priceMax}
                      onChange={(e) => updateSection(index, 'priceMax', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Current Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={section.currentPrice}
                      onChange={(e) => updateSection(index, 'currentPrice', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`available-${section.id}`}
                    checked={section.available}
                    onChange={(e) => updateSection(index, 'available', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor={`available-${section.id}`} className="text-sm">Available</Label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
