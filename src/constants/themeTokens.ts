export const COLOR_PALETTE = {
  primary: {
    amber500: '#f59e0b',
    amber600: '#d97706',
    amber400: '#fbbf24',
    amber300: '#fcd34d',
    orange500: '#f97316',
    cyan400: '#22d3ee',
  },
  dark: {
    bg: '#0a0a0c',
    surface: '#0f1015',
    surfaceHover: '#14161f',
    card: '#161822',
    border: '#242838',
    borderHover: '#383e54',
  },
  text: {
    primary: '#f3f4f6',
    secondary: '#9ca3af',
    muted: '#6b7280',
    light: '#ffffff',
  },
  tags: {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
    yellow: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  },
} as const;

export const SCREENPLAY_ELEMENT_STYLES = {
  scene_heading: 'font-bold uppercase tracking-widest text-amber-400 text-lg my-4 border-b border-amber-500/20 pb-1.5 font-mono drop-shadow-sm',
  action: 'text-slate-200 leading-relaxed font-mono my-2.5 text-base tracking-wide',
  character: 'font-bold uppercase tracking-widest text-emerald-400 text-center mt-5 mb-1 text-base font-mono',
  parenthetical: 'text-slate-400 italic text-center -mt-1 mb-1 text-sm font-mono',
  dialogue: 'text-slate-100 text-center max-w-xl mx-auto mb-4 leading-relaxed font-mono text-base',
  transition: 'font-bold uppercase tracking-widest text-purple-400 text-right my-4 text-base font-mono',
  shot: 'font-bold uppercase tracking-wider text-cyan-400 my-3 text-base font-mono',
} as const;
