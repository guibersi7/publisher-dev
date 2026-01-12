'use client';

import { useState } from 'react';

export default function ClientCounter() {
  const [count, setCount] = useState(0);

  return (
    <button
      type="button"
      className="rounded-full border border-brand-100 bg-surface-0 px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition hover:border-brand-500"
      onClick={() => setCount((value) => value + 1)}
    >
      Cliques: {count}
    </button>
  );
}
