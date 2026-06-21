const fs = require('fs');

const md = fs.readFileSync('docs/Drive Links.md', 'utf8');

const modulesData = {};
let currentModule = null;
let currentKey = null;

md.split('\n').forEach(line => {
    line = line.trim();
    if (!line) return;
    
    // Unescape link if it has \_
    line = line.replace(/\\_/g, '_');
    
    // Check if it's an http link
    if (line.startsWith('http')) {
        if (currentModule && currentKey) {
            modulesData[currentModule][currentKey] = line;
            currentKey = null; // reset key so we don't overwrite
        }
        return;
    }
    
    // If it's a key like Lectures:, Exams:, etc.
    if (line.match(/^(Lectures|Worksheets|Exams|Labs|Projects|External Resources):?/i)) {
        let keyStr = line.replace(':', '').trim();
        let key = '';
        if (keyStr === 'Lectures') key = 'lectures';
        if (keyStr === 'Worksheets') key = 'td';
        if (keyStr === 'Exams') key = 'exams';
        if (keyStr === 'Labs') key = 'tp';
        if (keyStr === 'Projects') key = 'projects';
        if (keyStr === 'External Resources') key = 'resources';
        
        currentKey = key;
        
        // If the URL is on the same line
        if (line.includes('http')) {
            let url = line.substring(line.indexOf('http')).trim();
            if (currentModule) {
                modulesData[currentModule][currentKey] = url;
            }
            currentKey = null;
        }
        return;
    }
    
    // If it's a module name
    if (line.endsWith(':') && !line.includes('Year:') && !line.includes('Semester')) {
        let name = line.replace(':', '').trim();
        // Normalizations
        if (name === 'Statistics') name = 'Descriptive Statistics & Intro to Probability';
        if (name === 'ASD1') name = 'Algorithms & Data Structures 1';
        if (name === 'Physics1') name = 'Physics 1';
        if (name === 'ASD 2') name = 'Algorithms & Data Structures 2';
        if (name === 'TMS') name = 'Topological & Metric Spaces'; // wait, what was it in the file? Let's check page.tsx
        if (name === 'Comp Ana') name = 'Complex Analysis';
        if (name === 'Func Ana') name = 'Functional Analysis';
        if (name === 'Stat inf') name = 'Inferential Statistics'; // changed from Statistical Inference based on page.tsx
        if (name === 'Stoch Proc') name = 'Stochastic Processes';
        if (name === 'Alg and Cod') name = 'Algebra & Coding'; // changed from Algebraic Coding Theory
        if (name === 'OOP') name = 'Object-Oriented Programming';
        if (name === 'NADE') name = 'Numerical Analysis of Differential Equations';
        if (name === 'Geo Diff') name = 'Differential Geometry';
        if (name === 'Field Ext') name = 'Field Extensions & Galois Theory';
        if (name === 'Trans Int') name = 'Transforms & Integration';
        if (name === 'Reg Models') name = 'Regression Models';
        if (name === 'Con Optim') name = 'Continuous Optimization';
        if (name === 'Data mining') name = 'Data Mining';
        if (name === 'Geop') name = 'Geopolitics & Strategy';
        if (name === 'CTM') name = 'Computer Tools for Mathematics';
        if (name === 'NVS') name = 'Normed & Topological Vector Spaces';
        if (name === 'Measure and Integration') name = 'Measure & Integration';
        if (name === 'ODE') name = 'Ordinary Differential Equations';
        if (name === 'PDE') name = 'Partial Differential Equations';
        
        currentModule = name;
        modulesData[currentModule] = {};
        currentKey = null;
    }
});

fs.writeFileSync('parsed_modules.json', JSON.stringify(modulesData, null, 2));
console.log('Parsed modules length:', Object.keys(modulesData).length);
