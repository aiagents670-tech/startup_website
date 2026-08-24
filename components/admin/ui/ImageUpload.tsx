'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  bucket: string;
  folder?: string;
  label?: string;
}

export default function ImageUpload({ value, onChange, bucket, folder = '', label = 'Upload Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size (5MB max)
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: false });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
      onChange(publicUrl);
      toast.success('Image uploaded!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>

      {value ? (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10 group">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleRemove}
              className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
              aria-label="Replace image"
            >
              <Upload size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 rounded-xl border-2 border-dashed border-white/15 hover:border-blue-500/60 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-blue-400 transition-all disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin text-blue-400" />
          ) : (
            <ImageIcon size={24} />
          )}
          <span className="text-xs">{uploading ? 'Uploading…' : 'Click to upload'}</span>
          <span className="text-[10px] text-slate-600">PNG, JPG, WebP up to 5MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        aria-label="Upload image file"
      />
    </div>
  );
}
