export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

export function generateLink(slug: string): string {
  return `https://t.me/usat_ariza_bot?start=${slug}`;
}