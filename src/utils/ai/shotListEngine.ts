import { ScriptBlock, ShotItem } from '../../types';

export const generateShotListFromScript = (blocks: ScriptBlock[]): ShotItem[] => {
  const shots: ShotItem[] = [];
  let currentScene = 1;
  let shotIndex = 1;

  blocks.forEach((block) => {
    if (block.type === 'scene_heading') {
      currentScene = block.sceneNumber || currentScene + 1;
      shotIndex = 1;
      shots.push({
        id: `shot-${currentScene}-${shotIndex}`,
        sceneNumber: currentScene,
        shotNumber: `${currentScene}.${shotIndex}`,
        shotType: 'Wide',
        angle: 'Eye Level',
        movement: 'Pan',
        description: `Establish scene environment: ${block.text}`,
        linkedBlockId: block.id,
        lensMm: '24mm',
      });
      shotIndex++;
    } else if (block.type === 'dialogue') {
      const isCloseUp = (block.text.length < 50);
      shots.push({
        id: `shot-${currentScene}-${shotIndex}`,
        sceneNumber: currentScene,
        shotNumber: `${currentScene}.${shotIndex}`,
        shotType: isCloseUp ? 'Close-up' : 'Medium',
        angle: 'Eye Level',
        movement: 'Static',
        description: `Focus on ${block.characterName || 'Character'} speaking: "${block.text.slice(0, 35)}..."`,
        linkedBlockId: block.id,
        lensMm: isCloseUp ? '85mm' : '50mm',
      });
      shotIndex++;
    } else if (block.type === 'action' && block.text.toLowerCase().includes('enters')) {
      shots.push({
        id: `shot-${currentScene}-${shotIndex}`,
        sceneNumber: currentScene,
        shotNumber: `${currentScene}.${shotIndex}`,
        shotType: 'Tracking',
        angle: 'Low Angle',
        movement: 'Steadicam',
        description: `Follow movement: ${block.text.slice(0, 40)}`,
        linkedBlockId: block.id,
        lensMm: '35mm',
      });
      shotIndex++;
    }
  });

  return shots;
};

export const exportShotListToCsv = (shots: ShotItem[]): string => {
  const headers = ['Scene #', 'Shot #', 'Type', 'Angle', 'Movement', 'Lens', 'Description'];
  const rows = shots.map((s) => [
    s.sceneNumber,
    s.shotNumber,
    s.shotType,
    s.angle,
    s.movement,
    s.lensMm || '50mm',
    `"${s.description.replace(/"/g, '""')}"`,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};
