export function initGA4() {
  if (typeof window === 'undefined') return;
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return;
  // Lightweight GA snippet
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  function gtag(){
    // eslint-disable-next-line prefer-rest-params
    // @ts-ignore
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', id);
}

export function initSentry() {
  // placeholder for Sentry init if DSN present
}

