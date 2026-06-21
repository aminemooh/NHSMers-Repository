const fs = require('fs');

const modulesData = JSON.parse(fs.readFileSync('parsed_modules.json', 'utf8'));

// Fix Analysis 1 empty key
if (modulesData['Analysis 1'] && modulesData['Analysis 1']['']) {
    modulesData['Analysis 1']['lectures'] = modulesData['Analysis 1'][''];
    delete modulesData['Analysis 1'][''];
}

let pageContent = fs.readFileSync('src/app/resources/page.tsx', 'utf8');

// 1. Update ResourceType
pageContent = pageContent.replace(/interface ResourceType \{[\s\S]*?\}/, `interface ResourceType {\n  id: string;\n  label: string;\n  url?: string;\n}`);

// 2. Change RESOURCE_TYPES to include 'External Resources'
pageContent = pageContent.replace(/\{ id: 'resources', label: 'Resources' \}/, `{ id: 'resources', label: 'External Resources' }`);

// 3. Update arrays
pageContent = pageContent.replace(/const BASIC_TYPES[\s\S]*?;/, `const BASIC_TYPES = RESOURCE_TYPES.filter((t) => ['lectures', 'td', 'exams', 'resources'].includes(t.id));\nconst LAB_TYPES = RESOURCE_TYPES.filter((t) => ['lectures', 'td', 'tp', 'exams', 'resources'].includes(t.id));\nconst PROJ_TYPES = RESOURCE_TYPES.filter((t) => ['lectures', 'td', 'tp', 'projects', 'exams', 'resources'].includes(t.id));\nconst LANG_TYPES = RESOURCE_TYPES.filter((t) => ['lectures', 'exams'].includes(t.id));\nconst HIST_TYPES = RESOURCE_TYPES.filter((t) => ['lectures', 'resources'].includes(t.id));`);

// 4. Update makeModule signature
pageContent = pageContent.replace(/function makeModule\(id: string, label: string, types: ResourceType\[\] = BASIC_TYPES\): Module \{[\s\S]*?\}/, `function makeModule(id: string, label: string, baseTypes: ResourceType[] = BASIC_TYPES, urls?: Record<string, string>): Module {\n  return { id, label, types: baseTypes.map(t => ({ ...t, url: urls ? urls[t.id] : undefined })) };\n}`);

// 5. Replace makeModule calls safely
// We match makeModule('id', 'label') or makeModule('id', 'label', TYPES)
pageContent = pageContent.replace(/makeModule\((['"`])([^'"`]+)\1,\s*(['"`])([^'"`]+)\3(?:,\s*([A-Z_]+))?\)/g, (match, q1, id, q2, label, type) => {
    // If we're modifying an english or history or geop, use LANG_TYPES or HIST_TYPES
    let newType = type || 'BASIC_TYPES';
    if (label.includes('English') || label.includes('Geopolitics')) newType = 'LANG_TYPES';
    if (label.includes('History')) newType = 'HIST_TYPES';

    let urls = modulesData[label] || {};

    // Only inject urls if they exist
    let urlString = Object.keys(urls).length > 0 ? `, ${JSON.stringify(urls)}` : '';

    // if urlString exists and type was missing, we MUST insert newType
    return `makeModule('${id}', '${label}', ${newType}${urlString})`;
});

// 6. Update activateRes to open URL
pageContent = pageContent.replace(/function activateRes\(resId: string\) \{[\s\S]*?\}/, `function activateRes(resId: string) {\n    setActiveRes(prev => prev === resId ? null : resId);\n    let foundUrl: string | undefined;\n    if (activeTrack) {\n      const track = SPECIALTY_NODES.find(s => s.id === activeTrack);\n      const sem = track?.semesters.find(s => s.id === activeSem);\n      const mod = sem?.modules.find(m => m.id === activeMod);\n      const res = mod?.types.find(t => t.id === resId);\n      if (res?.url) foundUrl = res.url;\n    } else if (activeYear) {\n      const yr = YEAR_NODES[activeYear - 1];\n      const sem = yr?.semesters.find(s => s.id === activeSem);\n      const mod = sem?.modules.find(m => m.id === activeMod);\n      const res = mod?.types.find(t => t.id === resId);\n      if (res?.url) foundUrl = res.url;\n    }\n    if (foundUrl) {\n      window.open(foundUrl, '_blank');\n    }\n  }`);

fs.writeFileSync('src/app/resources/page.tsx', pageContent);
console.log('Updated resources/page.tsx successfully');
