const fs = require('fs');

const md = fs.readFileSync('docs/Drive Links.md', 'utf8');

const modulesData = {};
let currentModule = null;

md.split('\n').forEach(line => {
    line = line.trim();
    if (!line) return;
    
    // Unescape link if it has \_
    line = line.replace(/\\_/g, '_');
    
    if (line.endsWith(':') && !line.startsWith('http') && !line.includes('Year:') && !line.includes('Semester')) {
        let name = line.replace(':', '').trim();
        // Normalizations
        if (name === 'Statistics') name = 'Descriptive Statistics & Intro to Probability';
        if (name === 'ASD1') name = 'Algorithms & Data Structures 1';
        if (name === 'Physics1') name = 'Physics 1';
        if (name === 'ASD 2') name = 'Algorithms & Data Structures 2';
        if (name === 'TMS') name = 'Topology & Metric Spaces';
        if (name === 'Comp Ana') name = 'Complex Analysis';
        if (name === 'Func Ana') name = 'Functional Analysis';
        if (name === 'Stat inf') name = 'Statistical Inference';
        if (name === 'Stoch Proc') name = 'Stochastic Processes';
        if (name === 'Alg and Cod') name = 'Algebraic Coding Theory';
        if (name === 'OOP') name = 'Object-Oriented Programming';
        if (name === 'NADE') name = 'Numerical Analysis of Differential Equations';
        if (name === 'Geo Diff') name = 'Differential Geometry';
        if (name === 'Field Ext') name = 'Field Extensions & Galois Theory';
        if (name === 'Trans Int') name = 'Transforms & Integration';
        if (name === 'Reg Models') name = 'Regression Models';
        if (name === 'Con Optim') name = 'Continuous Optimization';
        if (name === 'Data mining') name = 'Data Mining';
        if (name === 'Geop') name = 'Geopolitics and strategy';
        if (name === 'CTM') name = 'Computer Tools for Mathematics';
        if (name === 'NVS') name = 'Normed Vector Spaces';
        
        currentModule = name;
        modulesData[currentModule] = {};
    } else if (line.startsWith('Lectures:') || line.startsWith('Worksheets:') || line.startsWith('Exams:') || line.startsWith('Labs:') || line.startsWith('Projects:') || line.startsWith('External Resources:')) {
        let parts = line.split(':');
        let key = parts[0].trim();
        let url = parts.slice(1).join(':').trim();
        
        if (key === 'Lectures') key = 'lectures';
        if (key === 'Worksheets') key = 'td';
        if (key === 'Exams') key = 'exams';
        if (key === 'Labs') key = 'tp';
        if (key === 'Projects') key = 'projects';
        if (key === 'External Resources') key = 'resources';
        
        if (currentModule) {
            modulesData[currentModule][key] = url;
        }
    } else if (line.startsWith('http')) {
        // sometimes the URL is on the next line
        if (currentModule) {
            let lastKeys = Object.keys(modulesData[currentModule]);
            if (lastKeys.length > 0) {
                let lastKey = lastKeys[lastKeys.length - 1];
                if (!modulesData[currentModule][lastKey]) {
                    modulesData[currentModule][lastKey] = line;
                }
            }
        }
    }
});

let pageContent = fs.readFileSync('src/app/resources/page.tsx', 'utf8');

// 1. Update ResourceType
pageContent = pageContent.replace(/interface ResourceType \{[\s\S]*?\}/, `interface ResourceType {\n  id: string;\n  label: string;\n  url?: string;\n}`);

// 2. Change RESOURCE_TYPES to include 'External Resources'
pageContent = pageContent.replace(/\{ id: 'resources', label: 'Resources' \}/, `{ id: 'resources', label: 'External Resources' }`);

// 3. Update arrays
pageContent = pageContent.replace(/const BASIC_TYPES[\s\S]*?;/, `const BASIC_TYPES = RESOURCE_TYPES.filter((t) => ['lectures', 'td', 'exams', 'resources'].includes(t.id));\nconst LAB_TYPES = RESOURCE_TYPES.filter((t) => ['lectures', 'td', 'tp', 'exams', 'resources'].includes(t.id));\nconst PROJ_TYPES = RESOURCE_TYPES;\nconst LANG_TYPES = RESOURCE_TYPES.filter((t) => ['lectures', 'exams'].includes(t.id));\nconst HIST_TYPES = RESOURCE_TYPES.filter((t) => ['lectures', 'resources'].includes(t.id));`);

// 4. Update makeModule signature
pageContent = pageContent.replace(/function makeModule\(id: string, label: string, types: ResourceType\[\] = BASIC_TYPES\): Module \{[\s\S]*?\}/, `function makeModule(id: string, label: string, baseTypes: ResourceType[] = BASIC_TYPES, urls?: Record<string, string>): Module {\n  return { id, label, types: baseTypes.map(t => ({ ...t, url: urls ? urls[t.id] : undefined })) };\n}`);

// 5. Replace makeModule calls
// We match makeModule('id', 'label', OPTIONAL_TYPES)
pageContent = pageContent.replace(/makeModule\((['"`])([^'"`]+)\1,\s*(['"`])([^'"`]+)\3(?:,\s*([A-Z_]+))?\)/g, (match, q1, id, q2, label, type) => {
    // If we're modifying an english or history or geop, use LANG_TYPES or HIST_TYPES
    let newType = type || 'BASIC_TYPES';
    if (label.includes('English') || label.includes('Geopolitics')) newType = 'LANG_TYPES';
    if (label.includes('History')) newType = 'HIST_TYPES';

    let urls = modulesData[label] || {};
    
    // Only inject urls if they exist
    let urlString = Object.keys(urls).length > 0 ? `, ${JSON.stringify(urls)}` : '';
    
    return `makeModule('${id}', '${label}', ${newType}${urlString})`;
});

// 6. Update activateRes to open URL
pageContent = pageContent.replace(/function activateRes\(resId: string\) \{[\s\S]*?\}/, `function activateRes(resId: string) {\n    setActiveRes(prev => prev === resId ? null : resId);\n    let foundUrl: string | undefined;\n    if (activeTrack) {\n      const track = SPECIALTY_NODES.find(s => s.id === activeTrack);\n      const sem = track?.semesters.find(s => s.id === activeSem);\n      const mod = sem?.modules.find(m => m.id === activeMod);\n      const res = mod?.types.find(t => t.id === resId);\n      if (res?.url) foundUrl = res.url;\n    } else if (activeYear) {\n      const yr = YEAR_NODES[activeYear - 1];\n      const sem = yr?.semesters.find(s => s.id === activeSem);\n      const mod = sem?.modules.find(m => m.id === activeMod);\n      const res = mod?.types.find(t => t.id === resId);\n      if (res?.url) foundUrl = res.url;\n    }\n    if (foundUrl) {\n      window.open(foundUrl, '_blank');\n    }\n  }`);

fs.writeFileSync('src/app/resources/page.tsx', pageContent);
console.log('Updated resources/page.tsx');
