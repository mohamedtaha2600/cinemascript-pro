import { ProjectData } from '@/src/types';
import { selectProjectMetrics, selectProjectCharacters, selectProjectLocations } from '@/src/context/selectors/projectSelectors';

export function inspectProjectState(project: ProjectData) {
  const metrics = selectProjectMetrics(project);
  const characters = selectProjectCharacters(project);
  const locations = selectProjectLocations(project);

  return {
    id: project.id,
    title: project.title,
    subtitle: project.subtitle,
    formatType: project.formatType,
    metrics,
    charactersSummary: {
      registeredCount: characters.registered.length,
      detectedNames: characters.detectedNames,
    },
    locationsSummary: {
      registeredCount: locations.registered.length,
      headingsCount: locations.headingsCount,
    },
  };
}
