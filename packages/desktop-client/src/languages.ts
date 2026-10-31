export const languages = import.meta.glob([
  '/locale/*.json',
  '!/locale/*_old.json',
]);

/**
 * Local translations applied on top of the official ones from the
 * translations repo (which is cloned into /locale and reset on builds).
 * Use them for strings that are not translated upstream yet.
 */
export const languageOverrides = import.meta.glob<Record<string, string>>(
  '/locale-overrides/*.json',
  { import: 'default' },
);
