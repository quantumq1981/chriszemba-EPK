/**
 * Tailwind config for the Chris Zemba EPK.
 * Mirrors the theme that previously lived inline under the CDN build, so the
 * purged static stylesheet (assets/tw.css) is a drop-in replacement.
 *
 * Build:  npm run build:css   (see package.json)
 */
module.exports = {
  content: ['./index.html', './songs.html', './venues/**/*.html', './solo-duo/**/*.html', './casino/**/*.html'],
  // Classes toggled at runtime by the media tab switcher — safelisted so the
  // purge never drops them even if the scanner misses a JS-built string.
  safelist: [
    'bg-fire-500', 'text-midnight-950', 'border-fire-500',
    'bg-midnight-850', 'text-slate-400', 'border-white/10',
    'hover:border-fire-500/50', 'hover:text-slate-200',
    'w-full', 'h-full',
  ],
  theme: {
    extend: {
      colors: {
        midnight: { 950:'#04060d', 900:'#080d1a', 850:'#0c1322', 800:'#111a2e', 750:'#17223a', 700:'#1e2b48' },
        fire:  { 300:'#ff9d5f', 400:'#ff7a3d', 500:'#ee5a20', 600:'#cf470f', 700:'#a5360a' },
        azure: { 200:'#bcd4f5', 300:'#8fb8ee', 400:'#5f97e2', 500:'#3d7fd6' },
        ember: '#e0332a'
      },
      fontFamily: {
        heavy: ['Anton','system-ui','sans-serif'],
        display: ['Oswald','system-ui','sans-serif'],
        sans: ['Inter','system-ui','sans-serif']
      },
      fontWeight: {
        '400':'400', '500':'500', '600':'600', '700':'700'
      }
    }
  }
};
