// Use Wikimedia Special:FilePath which redirects to the actual SVG —
// works for every US state without needing the unpredictable hash prefix.
export const stateFlagUrl = (state: string): string => {
  const filename = `Flag of ${state}.svg`
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=640`
}
