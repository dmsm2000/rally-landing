import { Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Locale } from './i18n/locale';

export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export interface WaitlistEntry {
  email: string;
  locale: Locale;
}

export type WaitlistResult = { ok: true } | { ok: false; reason: 'invalid-email' | 'network' };

/**
 * Calls the `join_waitlist` RPC (see rally/supabase/migrations/0034_landing_waitlist_rpc.sql)
 * instead of writing to `public.landing_waitlist` directly — see that migration for why a plain
 * table insert/upsert doesn't work here. No @supabase/supabase-js: a single RPC call doesn't
 * justify the dependency weight on a marketing page. Nothing is ever read back client-side.
 *
 * The form only asks for an email (name/country/city were dropped) — the RPC still accepts them
 * as optional parameters with defaults, so nothing on the database side needs to change if they
 * come back later.
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
        body: JSON.stringify({ p_email: email, p_locale: entry.locale }),
      });

      return response.ok ? { ok: true } : { ok: false, reason: 'network' };
    } catch {
      return { ok: false, reason: 'network' };
    }
  }
}
