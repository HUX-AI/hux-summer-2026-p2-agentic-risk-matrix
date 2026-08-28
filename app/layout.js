import './globals.css';

export const metadata = {
  title: 'Agentic AI Risk Control Matrix — HUX AI',
  description:
    'A control matrix mapping AI autonomy levels against impact classes, with the controls, evidence and rollback requirements at each intersection.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts are loaded by the browser, not at build time, so the build never
            depends on a network call. If you swap fonts, update globals.css too. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
