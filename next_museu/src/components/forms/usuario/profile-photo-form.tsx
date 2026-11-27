'use client';

import { saveProfileAvatar } from '@/actions/auth/save-profile-avatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useDictionary } from '@/service/providers/i18n-providers';
import imageCompression from 'browser-image-compression';
import { UserRound } from 'lucide-react';
import { useState, type FormEvent } from 'react';

const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];

export function ProfilePhotoForm() {
  const labels = useDictionary().profilePhoto;
  const [src, setSrc] = useState('/api/profile/avatar');
  const [file, setFile] = useState<File>();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'saved' | 'invalid' | 'failed'>();

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || saving) return;
    if (!imageTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setStatus('invalid');
      return;
    }

    const form = event.currentTarget;
    setSaving(true);
    setStatus(undefined);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 768,
      });
      const data = new FormData();
      data.set('image', compressed, file.name);
      const result = await saveProfileAvatar(data);
      if (!result.success) {
        setStatus('failed');
        return;
      }
      setSrc(`/api/profile/avatar?v=${Date.now()}`);
      setStatus('saved');
      setFile(undefined);
      form.reset();
    } catch {
      setStatus('failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <Avatar className="size-24">
        <AvatarImage key={src} src={src} alt={labels.label} className="object-cover" />
        <AvatarFallback><UserRound className="size-10" aria-hidden="true" /></AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <label htmlFor="profile-photo" className="block text-sm font-medium">{labels.label}</label>
        <input
          id="profile-photo"
          type="file"
          accept={imageTypes.join(',')}
          aria-describedby="profile-photo-hint"
          disabled={saving}
          className="block w-full rounded-md border border-input px-3 py-2 text-sm file:me-3 file:font-medium"
          onChange={(event) => {
            setFile(event.target.files?.[0]);
            setStatus(undefined);
          }}
        />
        <p id="profile-photo-hint" className="text-sm text-muted-foreground">{labels.hint}</p>
      </div>
      <Button type="submit" disabled={!file || saving}>{saving ? labels.saving : labels.save}</Button>
      {status && (
        <p role="status" className={status === 'saved' ? 'text-sm text-muted-foreground' : 'text-sm text-destructive'}>
          {labels[status]}
        </p>
      )}
    </form>
  );
}
