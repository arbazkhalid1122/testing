'use client';

export function CriticalCSS() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for LCP optimization */
          .hero-section {
            contain: layout style paint;
            will-change: auto;
          }
          
          .hero-image {
            content-visibility: auto;
            contain-intrinsic-size: 600px 400px;
            aspect-ratio: 3/2;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
          
          /* Critical above-the-fold styles */
          .bg-accent {
            background-color: var(--accent);
          }
          
          .text-foreground {
            color: var(--foreground);
          }
          
          .font-league-spartan {
            font-family: var(--font-league-spartan);
          }
          
          /* Optimize font loading */
          @font-face {
            font-family: 'League Spartan';
            font-display: swap;
            src: local('League Spartan');
          }
        `,
      }}
    />
  );
}
