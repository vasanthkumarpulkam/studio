'use client';

import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type CaptchaGateProps = {
  onChange?: (verified: boolean) => void;
  label?: string;
  className?: string;
};

export default function CaptchaGate({ onChange, label = 'I am not a robot', className }: CaptchaGateProps) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    onChange?.(checked);
  }, [checked, onChange]);

  return (
    <div className={className}>
      <div className="flex items-center space-x-2 border rounded-md p-3">
        <Checkbox id="captcha-gate" checked={checked} onCheckedChange={(v) => setChecked(Boolean(v))} />
        <Label htmlFor="captcha-gate">{label}</Label>
      </div>
    </div>
  );
}

