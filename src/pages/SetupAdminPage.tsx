import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Shield, CheckCircle, Loader2 } from 'lucide-react';

const SetupAdminPage = () => {
  const { user, loading } = useAuth();
  const [setting, setSetting] = useState(false);
  const [done, setDone] = useState(false);

  const makeAdmin = async () => {
    if (!user) return;
    setSetting(true);
    try {
      // Check if already admin
      const roleDoc = await getDoc(doc(db, 'user_roles', user.uid));
      if (roleDoc.exists() && roleDoc.data()?.role === 'admin') {
        toast.info('You are already an admin!');
        setDone(true);
        setSetting(false);
        return;
      }

      // Set admin role using UID as document ID
      await setDoc(doc(db, 'user_roles', user.uid), {
        user_id: user.uid,
        role: 'admin',
        created_at: new Date().toISOString(),
      });

      toast.success('Admin role assigned! Refresh the page to see admin features.');
      setDone(true);
    } catch (err: any) {
      toast.error(`Failed: ${err.message}`);
    }
    setSetting(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Please log in first at <a href="/auth" className="text-primary underline">/auth</a>, then come back here.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Admin Setup</h1>
        <p className="text-muted-foreground mb-2">Logged in as:</p>
        <p className="font-mono text-sm text-foreground bg-muted px-3 py-2 rounded-lg mb-1">{user.email}</p>
        <p className="font-mono text-xs text-muted-foreground mb-6">UID: {user.uid}</p>

        {done ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <p className="text-foreground font-medium">You are now an admin!</p>
            <Button onClick={() => window.location.href = '/admin'}>
              Go to Admin Panel
            </Button>
          </div>
        ) : (
          <Button
            onClick={makeAdmin}
            disabled={setting}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-lg"
          >
            {setting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Setting up...
              </span>
            ) : (
              'Make Me Admin'
            )}
          </Button>
        )}

        <p className="text-xs text-muted-foreground mt-6">
          ⚠️ Delete this page after setup for security. Remove the /setup-admin route from App.tsx.
        </p>
      </div>
    </Layout>
  );
};

export default SetupAdminPage;
