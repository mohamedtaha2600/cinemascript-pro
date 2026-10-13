import { ScriptBlock } from '@/src/types';

/**
 * Converts ScriptBlocks to industry standard Fountain syntax
 */
export function exportToFountain(title: string, author: string, blocks: ScriptBlock[]): string {
  let output = `Title: ${title}\nCredit: written by\nAuthor: ${author}\nDraft date: ${new Date().toLocaleDateString()}\n\n===\n\n`;

  for (const block of blocks) {
    switch (block.type) {
      case 'scene_heading':
        output += `\n${block.text.toUpperCase()}\n\n`;
        break;
      case 'character':
        output += `\n${block.text.toUpperCase()}\n`;
        break;
      case 'parenthetical': {
        const pText = block.text.startsWith('(') && block.text.endsWith(')')
          ? block.text
          : `(${block.text.replace(/^\(|\)$/g, '')})`;
        output += `${pText}\n`;
        break;
      }
      case 'dialogue':
        output += `${block.text}\n\n`;
        break;
      case 'transition':
        output += `\n> ${block.text.toUpperCase()}\n\n`;
        break;
      case 'shot':
        output += `\n.${block.text.toUpperCase()}\n\n`;
        break;
      case 'action':
      default:
        output += `${block.text}\n\n`;
        break;
    }
  }

  return output;
}

/**
 * Converts ScriptBlocks to Final Draft FDX XML format
 */
export function exportToFDX(title: string, author: string, blocks: ScriptBlock[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<FinalDraft DocumentType="Script" Template="No" Version="1">
<Content>
`;

  for (const block of blocks) {
    let paragraphType = 'Action';
    let text = block.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    switch (block.type) {
      case 'scene_heading':
        paragraphType = 'Scene Heading';
        text = text.toUpperCase();
        break;
      case 'character':
        paragraphType = 'Character';
        text = text.toUpperCase();
        break;
      case 'parenthetical':
        paragraphType = 'Parenthetical';
        break;
      case 'dialogue':
        paragraphType = 'Dialogue';
        break;
      case 'transition':
        paragraphType = 'Transition';
        text = text.toUpperCase();
        break;
      case 'shot':
        paragraphType = 'Shot';
        text = text.toUpperCase();
        break;
      case 'action':
      default:
        paragraphType = 'Action';
        break;
    }

    xml += `  <Paragraph Type="${paragraphType}">
    <Text>${text}</Text>
  </Paragraph>\n`;
  }

  xml += `</Content>
<TitlePage>
  <Content>
    <Paragraph Type="Title"><Text>${title}</Text></Paragraph>
    <Paragraph Type="Author"><Text>${author}</Text></Paragraph>
  </Content>
</TitlePage>
</FinalDraft>`;

  return xml;
}

/**
 * Exports project screenplay blocks to formatted JSON
 */
export function exportToJSON(title: string, author: string, blocks: ScriptBlock[]): string {
  return JSON.stringify({ title, author, exportedAt: new Date().toISOString(), blocks }, null, 2);
}

/**
 * Triggers a browser file download
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
