import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source';

export const revalidate = false;

// Branded llms.txt (https://llmstxt.org/): H1 = project, then the docs index +
// playground + full-text pointer.
export function GET() {
  const docs = llms(source).index().replace(/^#\s*Docs\s*\n+/, '');
  const body = `# Quipier

> Embeddable wallet-based comment widget. Drop-in comments for any website; end users post via an anonymous passport (no signup/login).

## Docs

${docs}
## Playground

- [Live example](/example): paste a project's publishable key to mount the widget instantly

## Full text

- [llms-full.txt](/llms-full.txt): every doc page concatenated
`;
  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
