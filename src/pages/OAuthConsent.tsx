import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// Typed shim for the beta supabase.auth.oauth namespace.
type OAuthClient = {
  name?: string;
  redirect_uri?: string;
  logo_uri?: string;
};
type OAuthDetails = {
  client?: OAuthClient;
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};
type OAuthResult<T> = { data: T | null; error: { message: string } | null };
type SupabaseOAuth = {
  getAuthorizationDetails(id: string): Promise<OAuthResult<OAuthDetails>>;
  approveAuthorization(id: string): Promise<OAuthResult<{ redirect_url?: string; redirect_to?: string }>>;
  denyAuthorization(id: string): Promise<OAuthResult<{ redirect_url?: string; redirect_to?: string }>>;
};
function getOAuth(): SupabaseOAuth {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase.auth as any).oauth as SupabaseOAuth;
}

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<OAuthDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await getOAuth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const { data, error } = approve
      ? await getOAuth().approveAuthorization(authorizationId)
      : await getOAuth().denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full rounded-xl border border-border bg-card p-6">
          <h1 className="text-lg font-semibold mb-2">Could not load this authorization request</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }
  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  const clientName = details.client?.name ?? "an app";
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 shadow-xl">
        <h1 className="text-xl font-bold mb-2">
          Connect {clientName} to your account
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {clientName} will be able to call this app's enabled tools while you are signed in.
          This does not bypass this app's permissions or backend policies.
        </p>
        {details.client?.redirect_uri && (
          <p className="text-xs text-muted-foreground mb-4 break-all">
            Redirect: <span className="font-mono">{details.client.redirect_uri}</span>
          </p>
        )}
        <div className="flex gap-3">
          <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>
            Approve
          </Button>
          <Button variant="outline" className="flex-1" disabled={busy} onClick={() => decide(false)}>
            Cancel connection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OAuthConsent;
