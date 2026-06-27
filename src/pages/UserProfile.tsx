import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Bell, Moon, Sun, Shield, Camera, Save, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { updateProfile } from '@/services/authService';

export function UserProfile() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifs, setNotifs] = useState(user?.notifications ?? { email: true, push: true, priceAlerts: true, newsAlerts: false });
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '' });

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
    setEditing(false);
    toast.success('Profile updated successfully');
  };

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(n => ({ ...n, [key]: !n[key] }));
    toast.success('Notification preference updated');
  };

  const planColors = { Free: 'neutral', Pro: 'brand', Enterprise: 'success' } as const;

  return (
    <div className="page-container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Profile</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="text-center p-8">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-24 h-24 rounded-full border-4 border-brand-500/30 object-cover"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white hover:bg-brand-600 transition-colors">
                <Camera size={14} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{user?.name}</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">{user?.email}</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown size={14} className="text-warning-400" />
              <Badge variant={planColors[user?.plan ?? 'Free'] as 'brand' | 'success' | 'neutral'}>{user?.plan} Plan</Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Member since {new Date(user?.joinedAt ?? '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>

            {user?.plan === 'Free' && (
              <div className="mt-6 p-3 rounded-xl bg-gradient-brand text-white text-sm">
                <p className="font-bold mb-1">Upgrade to Pro</p>
                <p className="text-xs opacity-80 mb-2">Get AI predictions, advanced charts & more</p>
                <button className="w-full py-1.5 rounded-lg bg-white/20 text-white text-xs font-semibold hover:bg-white/30 transition-colors">
                  Upgrade Now
                </button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  className="text-sm text-brand-500 hover:text-brand-400 transition-colors flex items-center gap-1"
                >
                  {editing ? <Save size={14} /> : null}
                  {editing ? 'Save Changes' : 'Edit'}
                </button>
              </CardHeader>
              <div className="space-y-4">
                <Input
                  id="profile-name"
                  label="Full Name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  icon={<User size={16} />}
                  disabled={!editing}
                />
                <Input
                  id="profile-email"
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  icon={<Mail size={16} />}
                  disabled={!editing}
                />
                <Input
                  id="profile-phone"
                  label="Phone Number"
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  icon={<Phone size={16} />}
                  disabled={!editing}
                />
                {editing && (
                  <div className="flex gap-3">
                    <Button onClick={handleSave} loading={saving} size="sm">Save Changes</Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Theme */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon size={18} className="text-brand-400" /> : <Sun size={18} className="text-warning-400" />}
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">Switch between dark and light themes</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-brand-500' : 'bg-dark-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader><CardTitle>Notifications</CardTitle><Bell size={16} className="text-[var(--text-muted)]" /></CardHeader>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates and alerts via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Get push notifications on your device' },
                  { key: 'priceAlerts', label: 'Price Alerts', desc: 'Alerts when stocks hit your target price' },
                  { key: 'newsAlerts', label: 'News Alerts', desc: 'Breaking financial news notifications' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
                      <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleNotif(item.key as keyof typeof notifs)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${notifs[item.key as keyof typeof notifs] ? 'bg-brand-500' : 'bg-dark-400'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${notifs[item.key as keyof typeof notifs] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader><CardTitle>Security</CardTitle><Shield size={16} className="text-[var(--text-muted)]" /></CardHeader>
              <div className="space-y-3">
                {[
                  { label: 'Change Password', desc: 'Update your account password' },
                  { label: 'Two-Factor Authentication', desc: '2FA is currently disabled' },
                  { label: 'Active Sessions', desc: 'Manage devices where you\'re logged in' },
                ].map(item => (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
                      <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                    </div>
                    <span className="text-[var(--text-muted)]">›</span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
