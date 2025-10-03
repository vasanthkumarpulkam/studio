'use client';

import { useState, useEffect } from 'react';
import { httpsCallable, getFunctions } from 'firebase/functions';
import Script from 'next/script';

type CaptchaGateProps = {
  onChange?: (verified: boolean) => void;
  className?: string;
};

export default function CaptchaGate({ onChange, className }: CaptchaGateProps) {
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(false);
  const functions = getFunctions();
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string | undefined;

  useEffect(() => { onChange?.(ok); }, [ok, onChange]);

  const execute = async () => {
    if (!siteKey) return setOk(true); // bypass if not configured
    // @ts-ignore
    const token = await window.grecaptcha.execute(siteKey, { action: 'submit' });
    const verify = httpsCallable(functions, 'verifyRecaptcha');
    try {
      const res = await verify({ token });
      setOk((res.data as any)?.ok === true);
    } catch {
      setOk(false);
    }
  };

  return (
    <div className={className}>
      {siteKey && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`} onLoad={() => setReady(true)} strategy="afterInteractive" />
      )}
      <button type="button" onClick={execute} disabled={!ready} className="text-xs text-muted-foreground underline">
        Verify reCAPTCHA
      </button>
      {ok && <span className="ml-2 text-xs text-green-600">Verified</span>}
    </div>
  );
}

