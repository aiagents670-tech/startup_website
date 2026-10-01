'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '@/lib/db';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import ImageUpload from '@/components/admin/ui/ImageUpload';

const SETTING_KEYS = [
  'company_name', 'tagline', 'email', 'phone', 'whatsapp', 'address',
  'twitter', 'linkedin', 'github', 'instagram', 'youtube',
  'google_analytics', 'footer_text', 'seo_title', 'seo_description',
];

const LABELS: Record<string, string> = {
  company_name: 'Company Name', tagline: 'Tagline', email: 'Email',
  phone: 'Phone', whatsapp: 'WhatsApp Number', address: 'Address',
  twitter: 'Twitter URL', linkedin: 'LinkedIn URL', github: 'GitHub URL',
  instagram: 'Instagram URL', youtube: 'YouTube URL',
  google_analytics: 'Google Analytics ID', footer_text: 'Footer Text',
  seo_title: 'Default SEO Title', seo_description: 'Default SEO Description',
};

const GROUPS = [
  { title: 'Company', keys: ['company_name', 'tagline', 'footer_text'] },
  { title: 'Contact Information', keys: ['email', 'phone', 'whatsapp', 'address'] },
  { title: 'Social Links', keys: ['twitter', 'linkedin', 'github', 'instagram', 'youtube'] },
  { title: 'SEO & Analytics', keys: ['seo_title', 'seo_description', 'google_analytics'] },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      const data = await db.getSettings();
      const map: Record<string, string> = {};
      data.forEach(({ key, value }) => {
        map[key] = typeof value === 'string' ? value : String(value ?? '');
      });
      setSettings(map);
      // Load logo separately
      const logoSetting = data.find(s => s.key === 'logo_url');
      if (logoSetting && typeof logoSetting.value === 'string') {
        setLogoUrl(logoSetting.value);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        ...SETTING_KEYS.map((key) => db.saveSetting(key, settings[key] ?? '')),
        db.saveSetting('logo_url', logoUrl ?? ''),
      ]);
      toast.success('Settings saved!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/60 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";

  if (loading) {
    return (
      <>
        <AdminHeader title="Settings" />
        <main className="flex-1 p-6 space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />)}
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Settings" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl">

        {/* Logo */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Company Logo</h3>
          <ImageUpload value={logoUrl} onChange={setLogoUrl} label="Logo (replaces current logo)" />
        </div>

        {/* Setting Groups */}
        {GROUPS.map(group => (
          <div key={group.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">{group.title}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {group.keys.map(key => (
                <div key={key} className={key === 'seo_description' || key === 'address' ? 'sm:col-span-2' : ''}>
                  <label className={labelClass}>{LABELS[key]}</label>
                  {key === 'seo_description' || key === 'address' ? (
                    <textarea
                      value={settings[key] ?? ''}
                      onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                      rows={2}
                      className={inputClass}
                    />
                  ) : (
                    <input
                      type="text"
                      value={settings[key] ?? ''}
                      onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                      className={inputClass}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save All Settings
        </button>
      </main>
    </>
  );
}
