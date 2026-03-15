import React from 'react';
export function Button({ children, variant='default', size='default', className='', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-lg font-semibold transition';
  const styles = variant === 'ghost' ? 'bg-transparent hover:bg-slate-800 text-slate-200' : 'bg-slate-700 hover:bg-slate-600 text-white';
  return <button className={`${base} ${styles} ${className}`} {...props}>{children}</button>;
}
