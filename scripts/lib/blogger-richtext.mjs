// Blogger-only prose conversion. Code blocks are rendered separately and never
// pass through this parser. Keep the existing theme's list/table styles.
export function renderBloggerProse(text, { inline, heading }) {
  const lines = String(text).replace(/\r\n?/g, '\n').split('\n');
  const listItem = line => /^(\s*)([-*+]|\d+[.)])\s+(.+)$/.exec(line);
  const cells = line => {
    // Pipes inside inline code and escaped pipes are content, not separators.
    let code = false, cell = '', result = [];
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '\\' && line[i + 1] === '|') { cell += '|'; i++; }
      else if (char === '`') { code = !code; cell += char; }
      else if (char === '|' && !code) { result.push(cell.trim()); cell = ''; }
      else cell += char;
    }
    result.push(cell.trim());
    if (line.trim().startsWith('|')) result.shift();
    if (line.trim().endsWith('|')) result.pop();
    return result;
  };
  const tableAt = index => index + 1 < lines.length && lines[index].includes('|') &&
    cells(lines[index + 1]).length > 1 && cells(lines[index + 1]).every(cell => /^:?-{3,}:?$/.test(cell));
  let cursor = 0;
  function list(indent) {
    const first = listItem(lines[cursor]);
    const ordered = /\d/.test(first[2]);
    const tag = ordered ? 'ol' : 'ul';
    const start = ordered && parseInt(first[2], 10) !== 1 ? ` start="${parseInt(first[2], 10)}"` : '';
    let html = `<${tag}${start}>`;
    while (cursor < lines.length) {
      const match = listItem(lines[cursor]);
      if (!match || match[1].length !== indent || /\d/.test(match[2]) !== ordered) break;
      let item = inline(match[3]); cursor++;
      while (cursor < lines.length) {
        const nested = listItem(lines[cursor]);
        if (nested && nested[1].length > indent) item += list(nested[1].length);
        else if (!lines[cursor].trim() && listItem(lines[cursor + 1] || '')?.[1].length >= indent) cursor++;
        else if (!nested && /^\s+\S/.test(lines[cursor]) && lines[cursor].match(/^\s*/)[0].length > indent) item += '<br/>' + inline(lines[cursor++].trim());
        else break;
      }
      html += '<li>' + item + '</li>';
    }
    return html + `</${tag}>`;
  }
  const output = [];
  while (cursor < lines.length) {
    const line = lines[cursor];
    if (!line.trim()) { cursor++; continue; }
    const title = /^(#{2,3})\s+(.+)$/.exec(line);
    if (title) { output.push(heading(title[1].length, title[2])); cursor++; continue; }
    if (tableAt(cursor)) {
      const headers = cells(line); cursor += 2;
      const rows = [];
      while (cursor < lines.length && lines[cursor].trim() && lines[cursor].includes('|')) {
        const row = cells(lines[cursor]);
        if (row.length !== headers.length) throw new Error('Blogger table column count differs from its header');
        rows.push(row); cursor++;
      }
      output.push('<table><thead><tr>' + headers.map(cell => '<th scope="col">' + inline(cell) + '</th>').join('') + '</tr></thead><tbody>' + rows.map(row => '<tr>' + row.map(cell => '<td>' + inline(cell) + '</td>').join('') + '</tr>').join('') + '</tbody></table>');
      continue;
    }
    const item = listItem(line);
    if (item) { output.push(list(item[1].length)); continue; }
    const paragraph = [line]; cursor++;
    while (cursor < lines.length && lines[cursor].trim() && !/^(#{2,3})\s/.test(lines[cursor]) && !listItem(lines[cursor]) && !tableAt(cursor)) paragraph.push(lines[cursor++]);
    output.push('<p>' + paragraph.map(inline).join('<br/>') + '</p>');
  }
  return output.join('\n');
}
