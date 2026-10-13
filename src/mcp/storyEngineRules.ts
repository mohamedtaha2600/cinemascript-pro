export const HOLLYWOOD_SCREENPLAY_CONSTRAINTS = {
  minPageCountPerEpisode: 25,
  maxPageCountPerEpisode: 60,
  targetSceneCountPerEpisode: 12,
  dialogueRatioLimit: 0.65,
  uppercaseTypes: ['scene_heading', 'character', 'transition', 'shot'],

  validateSceneHeading(text: string): boolean {
    const uppercaseText = text.toUpperCase();
    return uppercaseText.startsWith('INT.') || uppercaseText.startsWith('EXT.') || uppercaseText.startsWith('INT/EXT.');
  },

  sanitizeCharacterName(name: string): string {
    return name.trim().toUpperCase().replace(/[^A-Z0-9_\s]/g, '');
  },

  formatParenthetical(text: string): string {
    const clean = text.trim().replace(/^\(|\)$/g, '');
    return `(${clean})`;
  },
};
