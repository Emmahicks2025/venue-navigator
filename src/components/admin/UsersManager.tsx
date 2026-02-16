import { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Search, RefreshCw, User, Mail, Send, Trash2, Eye, Edit, Save, Users, ShoppingCart, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
}

interface UserOrderSummary {
  totalOrders: number;
  totalSpent: number;
}

export const UsersManager = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Detail dialog
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [userOrders, setUserOrders] = useState<UserOrderSummary | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Email dialog
  const [emailDialog, setEmailDialog] = useState(false);
  const [emailTarget, setEmailTarget] = useState<'single' | 'bulk'>('single');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailProgress, setEmailProgress] = useState({ sent: 0, total: 0 });

  // Delete
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'profiles'), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      setUsers(snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString?.() || data.created_at || new Date().toISOString(),
          updated_at: data.updated_at?.toDate?.()?.toISOString?.() || data.updated_at || new Date().toISOString(),
        } as UserProfile;
      }));
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const fetchUserOrders = async (userId: string) => {
    setLoadingOrders(true);
    try {
      const q = query(collection(db, 'orders'), where('user_id', '==', userId));
      const snap = await getDocs(q);
      const orders = snap.docs.map(d => d.data());
      setUserOrders({
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, o) => sum + (o.total || 0), 0),
      });
    } catch {
      setUserOrders(null);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleViewUser = (user: UserProfile) => {
    setSelectedUser(user);
    setEditing(false);
    setEditForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
    });
    fetchUserOrders(user.user_id);
  };

  const handleSaveProfile = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'profiles', selectedUser.id), {
        first_name: editForm.first_name || null,
        last_name: editForm.last_name || null,
        email: editForm.email || null,
        updated_at: new Date().toISOString(),
      });
      const updated = { ...selectedUser, ...editForm };
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...editForm } : u));
      setSelectedUser(updated);
      setEditing(false);
      toast.success('Profile updated');
    } catch (err) {
      console.error('Failed to update:', err);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string, docId: string) => {
    if (!confirm('Delete this user profile? This will not delete their auth account or orders.')) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'profiles', docId));
      setUsers(prev => prev.filter(u => u.id !== docId));
      if (selectedUser?.id === docId) setSelectedUser(null);
      toast.success('User profile deleted');
    } catch (err) {
      console.error('Failed to delete:', err);
      toast.error('Failed to delete profile');
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} user profile(s)? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map(id => deleteDoc(doc(db, 'profiles', id)))
      );
      setUsers(prev => prev.filter(u => !selectedIds.has(u.id)));
      setSelectedIds(new Set());
      toast.success(`${selectedIds.size} profile(s) deleted`);
    } catch (err) {
      console.error('Bulk delete failed:', err);
      toast.error('Failed to delete some profiles');
    } finally {
      setDeleting(false);
    }
  };

  const openBulkEmail = () => {
    if (selectedIds.size === 0) {
      toast.error('Select users first');
      return;
    }
    setEmailTarget('bulk');
    setEmailSubject('');
    setEmailBody('');
    setEmailDialog(true);
  };

  const openSingleEmail = (user: UserProfile) => {
    setEmailTarget('single');
    setEmailSubject('');
    setEmailBody('');
    setEmailDialog(true);
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error('Subject and message are required');
      return;
    }
    setSendingEmail(true);

    const htmlBody = emailBody
      .split('\n\n')
      .map(p => `<p style="margin:0 0 12px;">${p.replace(/\n/g, '<br>')}</p>`)
      .join('');

    let recipients: { email: string; name: string }[] = [];

    if (emailTarget === 'single' && selectedUser?.email) {
      recipients = [{ email: selectedUser.email, name: `${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() }];
    } else {
      const selectedUsers = users.filter(u => selectedIds.has(u.id) && u.email);
      recipients = selectedUsers.map(u => ({
        email: u.email!,
        name: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
      }));
    }

    if (recipients.length === 0) {
      toast.error('No valid email addresses found');
      setSendingEmail(false);
      return;
    }

    setEmailProgress({ sent: 0, total: recipients.length });
    let successCount = 0;

    for (const recipient of recipients) {
      try {
        await supabase.functions.invoke('send-admin-email', {
          body: {
            to: recipient.email,
            subject: emailSubject,
            body: htmlBody,
            recipientName: recipient.name || undefined,
          },
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to send to ${recipient.email}:`, err);
      }
      setEmailProgress(prev => ({ ...prev, sent: prev.sent + 1 }));
    }

    toast.success(`Sent ${successCount}/${recipients.length} emails`);
    setEmailDialog(false);
    setSendingEmail(false);
    setEmailProgress({ sent: 0, total: 0 });
    setEmailSubject('');
    setEmailBody('');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(u => u.id)));
    }
  };

  const filtered = useMemo(() => {
    let result = [...users];

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(u =>
        (u.email || '').toLowerCase().includes(s) ||
        (u.first_name || '').toLowerCase().includes(s) ||
        (u.last_name || '').toLowerCase().includes(s) ||
        u.user_id.toLowerCase().includes(s)
      );
    }

    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'name':
        result.sort((a, b) => ((a.first_name || '') + (a.last_name || '')).localeCompare((b.first_name || '') + (b.last_name || '')));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [users, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Users</p>
              <p className="font-bold text-foreground text-lg">{users.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <Mail className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">With Email</p>
              <p className="font-bold text-foreground text-lg">{users.filter(u => u.email).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckSquare className="w-5 h-5 text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Selected</p>
              <p className="font-bold text-foreground text-lg">{selectedIds.size}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters + Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, user ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {selectedIds.size > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={openBulkEmail} className="gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Email ({selectedIds.size})
              </Button>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={deleting} className="gap-1.5">
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete ({selectedIds.size})
              </Button>
            </>
          )}
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchUsers}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} users shown</p>

      {/* Users List */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No users found</p>
      ) : (
        <div className="space-y-1">
          {/* Select All */}
          <div className="flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground">
            <Checkbox
              checked={selectedIds.size === filtered.length && filtered.length > 0}
              onCheckedChange={toggleAll}
            />
            <span>Select All</span>
          </div>

          {filtered.map(user => (
            <Card key={user.id} className="border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.has(user.id)}
                    onCheckedChange={() => toggleSelect(user.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground text-sm">
                        {user.first_name || user.last_name
                          ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                          : 'No Name'}
                      </span>
                      {!user.email && (
                        <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/30">No Email</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email || user.user_id}
                    </p>
                  </div>
                  <div className="text-right mr-2">
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUser(user.user_id, user.id)}
                    disabled={deleting}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => { if (!open) setSelectedUser(null); }}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  User Details
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {editing ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="First Name" value={editForm.first_name} onChange={e => setEditForm(p => ({ ...p, first_name: e.target.value }))} className="h-8 text-sm" />
                      <Input placeholder="Last Name" value={editForm.last_name} onChange={e => setEditForm(p => ({ ...p, last_name: e.target.value }))} className="h-8 text-sm" />
                    </div>
                    <Input placeholder="Email" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} className="h-8 text-sm" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveProfile} disabled={saving} className="gap-1.5 h-7 text-xs">
                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="h-7 text-xs">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-secondary/50 border border-border rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Name</p>
                          <p className="text-foreground">{`${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-foreground">{selectedUser.email || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">User ID</p>
                          <p className="text-foreground font-mono text-xs break-all">{selectedUser.user_id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Joined</p>
                          <p className="text-foreground">{new Date(selectedUser.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1.5 h-7 text-xs">
                      <Edit className="w-3 h-3" /> Edit Profile
                    </Button>
                  </div>
                )}

                <Separator />

                {/* Order Summary */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4" />
                    Order Summary
                  </h4>
                  {loadingOrders ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : userOrders ? (
                    <div className="bg-secondary/50 border border-border rounded-lg p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Orders</span>
                        <span className="text-foreground font-semibold">{userOrders.totalOrders}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-muted-foreground">Total Spent</span>
                        <span className="text-accent font-bold">${userOrders.totalSpent.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No orders found</p>
                  )}
                </div>

                <Separator />

                {/* Send Email */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openSingleEmail(selectedUser)}
                    disabled={!selectedUser.email}
                    className="gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Email
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteUser(selectedUser.user_id, selectedUser.id)}
                    disabled={deleting}
                    className="gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Compose Dialog */}
      <Dialog open={emailDialog} onOpenChange={setEmailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              {emailTarget === 'bulk' ? `Send Email to ${selectedIds.size} Users` : 'Send Email'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {emailTarget === 'single' && selectedUser && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">To</p>
                <p className="text-sm text-foreground font-medium">
                  {selectedUser.first_name} {selectedUser.last_name} &lt;{selectedUser.email}&gt;
                </p>
              </div>
            )}
            {emailTarget === 'bulk' && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Recipients</p>
                <p className="text-sm text-foreground">
                  {selectedIds.size} selected users ({users.filter(u => selectedIds.has(u.id) && u.email).length} with email)
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Subject</p>
              <Input
                placeholder="e.g. Important update about your tickets..."
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Message</p>
              <p className="text-[10px] text-muted-foreground mb-1">
                Use blank lines for paragraphs. TixOrbit branding, logo, and footer are included automatically.
              </p>
              <Textarea
                placeholder="Type your message here...&#10;&#10;Use blank lines to separate paragraphs."
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                rows={8}
                className="resize-none text-sm"
              />
            </div>
            {sendingEmail && emailProgress.total > 1 && (
              <div className="text-sm text-muted-foreground">
                Sending... {emailProgress.sent}/{emailProgress.total}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEmailDialog(false)}>Cancel</Button>
              <Button
                size="sm"
                onClick={handleSendEmail}
                disabled={sendingEmail || !emailSubject.trim() || !emailBody.trim()}
                className="gap-1.5"
              >
                {sendingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {emailTarget === 'bulk' ? `Send to ${selectedIds.size}` : 'Send Email'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
