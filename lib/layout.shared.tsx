import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported. Black-chip mark (icon-192) so it stays visible in both
      // light and dark Fumadocs themes (a transparent white mark would vanish
      // on the light header).
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" alt="" width={22} height={22} style={{ borderRadius: 6 }} />
          {appName}
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
