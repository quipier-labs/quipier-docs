import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const revalidate = false;

// `english` is the only stemmer bundled with Orama by default; korean/japanese
// require `@orama/stemmers` + a custom tokenizer that Fumadocs's
// `createFromSource` doesn't expose. Practically OK for Korean docs — the
// english stemmer is a no-op on non-ASCII tokens, so Korean queries match by
// exact form. https://docs.orama.com/docs/orama-js/supported-languages
export const { staticGET: GET } = createFromSource(source, {
  language: 'english',
});
