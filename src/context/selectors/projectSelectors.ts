import { ProjectData } from '@/src/types';
import { computeScreenplayMetrics } from '@/src/utils/screenplay/metrics';
import { extractUniqueCharacters, parseSlugline } from '@/src/utils/screenplay/parser';

export function selectProjectMetrics(project: ProjectData) {
  const metrics = computeScreenplayMetrics(project.scriptBlocks || []);
  return {
    ...metrics,
    targetPages: project.targetPages || 110,
    progressPercentage: Math.min(100, Math.round((metrics.pagesCount / (project.targetPages || 110)) * 100)),
  };
}

export function selectProjectCharacters(project: ProjectData) {
  const detectedNames = extractUniqueCharacters(project.scriptBlocks || []);
  const registered = project.characters || [];

  const registeredNames = new Set(registered.map((c) => c.name.toUpperCase()));
  const unmapped = detectedNames.filter((name) => !registeredNames.has(name));

  return {
    registered,
    detectedNames,
    unmapped,
  };
}

export function selectProjectLocations(project: ProjectData) {
  const headings = (project.scriptBlocks || []).filter((b) => b.type === 'scene_heading');
  const parsedLocations = headings.map((h) => parseSlugline(h.text));

  return {
    registered: project.locations || [],
    parsedLocations,
    headingsCount: headings.length,
  };
}
