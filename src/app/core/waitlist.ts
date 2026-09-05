import { Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Locale } from './i18n/locale';

export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export interface WaitlistEntry {
  email: string;
  name: string;
  country: string;
  city: string;
  locale: Locale;
}

export type WaitlistResult = { ok: true } | { ok: false; reason: 'invalid-email' | 'network' };

/**
 * Calls the `join_waitlist` RPC (see rally/supabase/migrations/0034_landing_waitlist_rpc.sql)
 * instead of writing to `public.landing_waitlist` directly. A plain `security definer` function was
 * the fix after `INSERT ... ON CONFLICT DO UPDATE` kept failing RLS even with correct INSERT/UPDATE
 * policies in place — that specific statement shape needs read visibility into the conflicting row,
 * which would otherwise require a SELECT policy making every signup email readable by anyone with
 * the published anon key. No @supabase/supabase-js here: a single RPC call doesn't justify the
 * dependency weight on a marketing page. Nothing is ever read back client-side.
 */
@Service()
export class Waitlist {
  async join(entry: WaitlistEntry): Promise<WaitlistResult> {
    const email = entry.email.trim();
    if (!EMAIL_PATTERN.test(email)) {
      return { ok: false, reason: 'invalid-email' };
    }

    try {
      const response = await fetch(`${environment.supabaseUrl}/rest/v1/rpc/join_waitlist`, {
        method: 'POST',
        headers: {
          apikey: environment.supabaseAnonKey,
          Authorization: `Bearer ${environment.supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_email: email,
          p_name: entry.name.trim() || null,
          p_country: entry.country.trim() || null,
          p_city: entry.city.trim() || null,
          p_locale: entry.locale,
        }),
      });

      return response.ok ? { ok: true } : { ok: false, reason: 'network' };
    } catch {
      return { ok: false, reason: 'network' };
    }
  }
}
