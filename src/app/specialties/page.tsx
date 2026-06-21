'use client';

import { useState, useMemo } from 'react';

// ============================================================
// ALL TEXT IS TAKEN WORD-FOR-WORD FROM docs/Specility descritpion.txt
// AND gemini-code-1781806298947.md
// ============================================================

interface Division {
  name: string;
  desc: string;
}

interface Specialty {
  id: string;
  name: string;
  abbr: string;
  color: string;
  icon: string;
  generalIdea: string;
  prereqs: string;
  prereqClarification: string;
  y3Important: string;
  y3Note: string;
  y4s7: string;
  y4s8: string;
  y5s9: string;
  divisions: Division[];
  projects: string[];
  internships: string;
  advice: string;
}

const SPECIALTIES: Specialty[] = [
  {
    id: 'ms',
    name: 'Modeling And Simulation',
    abbr: 'MS',
    color: '#00d4ff',
    icon: '∫',
    // Exact text from [Modeling And Simulation] > [[General Idea]]
    generalIdea:
      'It is a path that bridges rigorous theoretical mathematics with its vast applications in technology and real-world dynamics. It trains students to translate complex, real-world challenges into solvable mathematical models. Backed by a strong analytical foundation, graduates are equipped to tackle problems across a broad spectrum of cutting-edge fields, including computational physics, control and automation, computer vision, and biomathematics.',
    // Exact text from [[Basics & Pre-requirements]]
    prereqs:
      'Everything from the first year up to the last topic you discussed, but I want to specifically highlight topology analysis and measure and integration.',
    prereqClarification:
      'Topology is very important, especially if someone wants to continue in theoretical mathematics. However, even in applied fields, it\'s necessary to know the definitions and theorems well so that when you\'re working in a specific domain, you don\'t make mistakes — you need to understand the space you\'re in, the norms that are useful to you, and so on.\nAs for measure and integration, you need to have a strong understanding of it.',
    // Exact text from [[[Third Year]]]
    y3Important:
      'PDE , ODE , Functional Analysis, Complexe Analysis, Continuous Optimization , Integral Transformation, Numerical Analysis of Differential Equations and Algorithms of Ai.',
    y3Note:
      'the rest are crutual for the speciality core like advanced theoritical components but not the most important.',
    // Exact text from [[[Fourth Year]]]
    y4s7:
      'Control of Differential Eq , Digital Image Processing , Matrix Numerical Analysis , Distributions and Application , Stochastic Simulations also a Modeling Workshop.',
    y4s8:
      'Non-Variational Methods , Stochastic Differential Eq. , Intro. Biological Modeling , Fluid Mechanics , Computer Vision , Fractional Differential Eq. , Convex Optimization',
    // Exact text from [[[Fifth Year]]]
    y5s9:
      'Image Processing, Numerical Fluid Mechanics, Epidemiological Modeling, Bayesian Inference, Modeling Workshop 2',
    // Exact text from [[General divisions in Specility]]
    divisions: [
      {
        name: 'Image Processing',
        desc: 'This field applies mathematics, algorithms, and computing (AI) to extract or manipulate visual data. It is critical in medical imaging, autonomous vehicles, surveillance systems, and industrial automation — real-world applications of modeling and simulation in the digital world.',
      },
      {
        name: 'Fluid Mechanics',
        desc: 'It is a cornerstone of computational physics. You simulate physical environments using PDEs, numerical methods, and high-performance computing, to models the behavior of liquids and gases (Petrol and porous media).',
      },
      {
        name: 'Control',
        desc: 'Control theory is deeply connected to modeling because it requires building mathematical models (typically differential equations) of systems, then designing feedback mechanisms to control them. This is essential in simulating and managing real-time systems.',
      },
      {
        name: 'Bio-Mathematics',
        desc: 'This branch uses differential equations, probability, and stochastic processes to build and analyze dynamic models in biology. It shows how mathematical tools can solve real-world problems in health and life sciences and understand complex biological systems such as: Neural networks , Gene regulation , Disease spread (epidemiology).',
      },
    ],
    // Exact text from [[Final Year Projects]]
    projects: [
      'Modeling nozzle throat erosion and its impact on the performance of a solid rocket motor.',
      'Matematical metods for topography reconstraction using drones imagery.',
      'Advanced modeling, simulation, and control of compression units in natural gas transpor.',
      'Mathematical analysis and application of smoothed particle hydrodynamics (SPH) numerical method for modeling complex dynamic phenomena.',
    ],
    // Exact text from [[Futur and Internships]]
    internships:
      'Intren ships has been done at a lot of companies (Modeling Departement) like: CDTA (Advanced Technology Development Centre), CRTI (Research Center in Industrial Technologies), CRAAG (Center of Research in Astronomy, Astrophysics, and Geophysics), ASAL (Algerian Space Agency), SONATRAC, SEAAL, ONM (center de Météo Algérie)... and are essential it shows the transformation from theory to application and the point of view of an engineer.',
    // Exact text from [[Student Advice]]
    advice:
      'As an addition I\'d like to share with you, for second year students, I imagine you might expect that the studies will continue in the same direction as in the second year. But in reality, that\'s not the case. Second year is an important year for building a solid foundation in mathematics. After that, you\'ll focus more on projects and applications. Of course, studying theoretical subjects and doing proofs will continue (which I personally see as essential), but what I mean to say is: not to the same extent as in second year.\nThere is a variety of application domains, MS is the correct path for students intresting in understanding complex concepts and work in real problems in various engineering fields. Even though it\'s hard and has a lot of workload, each module is its own sub-specialty The modules are tough and include projects, but you\'ll find good work opportunities and benefits you.',
  },
  {
    id: 'sesa',
    name: 'Statistics and Econometrics for Actuarial Science',
    abbr: 'SESA',
    color: '#a855f7',
    icon: 'Σ',
    // Exact text from [Statistics and Econometrics for Actuarial Science] > [[General Idea]]
    generalIdea:
      'It is the engineering track that combines rigorous mathematics and computational tools to train specialists in data science, econometrics and actuarial sciences. Finance and risk management are important areas of emphasis, but the real goal is to apply statistics broadly. Students develop highly transferable skills such as predictive modelling and data mining, equipping them to address complex problems and spearhead data-driven innovation across all industries.',
    prereqs:
      'Everything from the first year up to the last topic you discussed, but I want to specifically highlight Statistics, Probability and measure & integration + programming skills especially python!!!',
    prereqClarification:
      'Understand the tools we learned in statistics, In Probability you need to understand clearly what is probability random variables (with no confusion), you need to be good at coding and solving problems + optimizing your codes etc...',
    y3Important:
      'Stochastical Processes, Infrential Statistics, Data Mining, OOP, Regression Models, Artificial Intelligence & Continuous Optimization',
    y3Note:
      'the rest are crutual for the speciality core like advanced theoritical components but not the most important !',
    y4s7:
      'Stochastic processes , Time Series 1 , Data Mining 2 , Advanced Optimization Algorithms and Graph Theory , Information Systems and Databases, Stochastic Simulation, Introduction to Finance.',
    y4s8:
      'Non-parametric Estimation , Time Series 2 , Stochastic Differential Calculus , Extreme Value Statistics , Actuarial Science 1 , Optimization in Economics and Finance , Insurance Law, Entrepreneurship.',
    y5s9:
      'Actuarial Science 2, Diffusion Models in Finance, Machine Learning, Introduction to Islamic Finance, Bayesian Inference, Modeling Workshop, Academic Communication, Modeling Workshop.',
    divisions: [
      {
        name: 'Data Science',
        desc: 'This branch integrates statistics, computer science, and optimization to turn complex data into actionable insights, operating on one simple principle: wherever there is data, you can apply this knowledge. Rather than being tied to a single industry, you will master AI, data mining, time series forecasting, and risk analysis to solve real-world problems across any field. Backed by strong practical programming skills, this path equips you with the universal mathematical tools to build predictive decision-making systems and tackle data-driven challenges everywhere.',
      },
      {
        name: 'Advanced Statistics',
        desc: 'This branch focuses on mastering advanced statistical tools and concepts to tackle some of the hardest, most complex data problems. You will go far beyond basic analysis, diving into rigorous methods like Bayesian inference, non-parametric estimation, and extreme value theory to model uncertainty, simulate stochastic processes, and study extreme outliers. By blending deep theoretical foundations with real-world applications, this path equips you with the heavy-hitting statistical frameworks needed to estimate intricate models, test hypotheses, and drive critical decision-making across science, economics, and risk analysis.',
      },
      {
        name: 'Finance and Actuarial Science',
        desc: 'This branch applies probability and financial mathematics to assess risk in insurance and finance—but these sectors are ultimately just the training ground. While you will master complex concepts like stochastic calculus, mortality models, and enterprise risk management, these financial applications serve primarily as practical examples to teach you how to deploy your statistics and data science knowledge. By learning to model uncertain future events and design risk strategies in these demanding environments, you develop a highly versatile analytical mindset, equipping you to adapt and tackle complex data problems across entirely different fields with clarity and efficiency.',
      },
    ],
    projects: [
      'Stochastic Modeling for Network Performance Optimization in Telecom Systems.',
      'Cat-Net reinsurance premium under heavy-tailed losses and censored Data.',
      'A Meta-learned and fondation model-guided reinforcement learning framwork for dynamic multi-model geospatial fusion.',
      'A graph-based cleustring framework for latent endmembers discovery in hyperspectral imagery.',
      'Regime switching time series models and machine learning, Application on seismic events.',
    ],
    internships:
      'Internships have been done at many companies such as: Banks, AXA Assurance, Algérie Poste, Algérie Télécom, ASAL, Oredoo, SONATRACH, ... They are essential — they show the transformation from theory to application and the point of view of a data engineer.',
    advice:
      'In the specialization, you will need a good foundation in mathematics, statistics and programming and data and AI. You don\'t have to worry about the first part as a student who passed and well understood his classes. The second part is what you need to work on by yourself.\n Work hard on the projects, take the hardest ones, and always ask, try to learn and fully understand what you are doing.\n "I know that projects or internships like these may seem difficult, but tell yourself that now is the perfect opportunity to learn — even if it means learning everything from scratch."\nAnd finally Where there is data there is SESA so if you are a data and statistics enthousiaste this is your place!',
  },
  {
    id: 'ccs',
    name: 'Cryptology, Coding & Security',
    abbr: 'CCS',
    color: '#10b981',
    icon: '⬡',
    // Exact text from [Cryptology, Coding & Security] > [[General Idea]]
    generalIdea:
      'It is a path explores the deep mathematical and theoretical foundations behind modern digital protection. It trains highly qualified experts to design and implement advanced computer security systems. Grounded in fundamental mathematical concepts, the curriculum focuses heavily on cryptography, coding theory, and cybersecurity, preparing graduates to defend complex technological infrastructures and tackle evolving real-world digital threats.',
    prereqs:
      'Everything from the first year up to the last topic you discussed, but I want to specifically highlight Programmig, Algebra, Basic Probability and Analysis.',
    prereqClarification: '',
    y3Important:
      'Algebra & Coding , Stochastic Processes, Integral transformation, Field extensions',
    y3Note:
      'the rest are crutual for the speciality core like advanced theoritical components but not the most important.',
    y4s7:
      'Mathematical Tools for Cryptography, Cryptography, Operating Systems, Complexity Theory, Formal Calculus, Combinatorial Optimization, Chipsets Programming.',
    y4s8:
      'Information Theory and Error-Correcting Codes, Networks and Protocols, Signal Processing, Number Theory and Cryptography, Arithmetic Algorithms, Advanced Graph Theory, Random Number Generators, Entrepreneurship.',
    y5s9:
      'Cryptanalysis, Advanced Cryptography, System Security, Network Security, Dynamical Systems and Chaos, Elliptic Curves; Audio, Images, and Security.',
    divisions: [
      {
        name: 'Network Security',
        desc: 'This sub-branch implements cryptographic protocols, intrusion detection, and defensive architectures to secure data transmission and network infrastructure. It translates theoretical cryptography into real-world protections against cyber threats such as: Encrypted communications (TLS/SSL, VPNs), Network intrusion attacks (DDoS, malware propagation), Traffic interception (man-in-the-middle), Infrastructure vulnerabilities (routing exploits, firewall bypass). Protocol design ensures data confidentiality/integrity, while operational security monitors, detects, and mitigates live network attacks.',
      },
      {
        name: 'Systems Security',
        desc: 'Implements kernel hardening, access controls, and malware analysis to secure operating systems and hardware. It translates cryptographic principles into resilient defenses against cyber threats such as: Privilege escalation (rootkits, kernel exploits), Memory corruption (buffer overflows, code injection), Physical tampering (side-channel attacks), Malware persistence (ransomware, spyware). Security architecture establishes trust boundaries, while operational hardening isolates, monitors, and neutralizes runtime threats.',
      },
      {
        name: 'Number Theory',
        desc: 'This branch employs algebraic structures, modular arithmetic, and analytic methods to design and analyze secure cryptographic systems. It demonstrates how abstract mathematical concepts solve critical real-world problems in information security and digital communications, such as: Public-key cryptography (RSA/ECC), Post-quantum cryptosystems (lattice-based schemes), Secure random number generation, Error-correcting codes (Reed-Solomon, LDPC). Theoretical focus proves security foundations and develops new algorithms, while applied focus implements these in hardware/software to protect data in networks, blockchain, and embedded systems.',
      },
    ],
    projects: [
      'Leveraging Graph Structures and LLMs for Intelligent Investigations.',
      'Secure Encryption and Decryption of UAV Embedded Images.',
      'Embedded Detection of Abnormal Behaviors in Sensitive Mobile Application Using Machine Learning.',
      'Development of a Lightweight Cryptographic Primitives Library for Smartcard Applications.',
      'Desing of an Automated Security Benchmarking Platform for Critical Mobile Applications: A controlled Offensive Approach.',
    ],
    internships:
      'Students has done some intrenships in diffrent companies like Banks, CDTA and many more.',
    advice: '',
  },
  {
    id: 'mp',
    name: 'Mathematical Physics',
    abbr: 'MP',
    color: '#f59e0b',
    icon: '∂',
    // Exact text from [Mathematical Physics] > [[General Idea]]
    generalIdea:
      'It is a path where the rigorous understanding of advanced mathematics is combined with the vast study of complex physical phenomena. It teaches students how to utilise deep theoretical frameworks in modelling and solving the fundamental problems of the physical world. With this strong analytical base, graduates are well-prepared to face challenges and create new opportunities at the leading edge of fields such as geophysics and quantum mechanics and computing.',
    prereqs:
      'Everything from the first year up to the last topic you discussed, but mainly Algebra, Measure theory and Partial diffrential equations.',
    prereqClarification: '',
    // Exact text from [[Classes]] — "Still Isn't disclosed yet!"
    y3Important: '',
    y3Note: 'Still Isn\'t disclosed yet!',
    y4s7: 'but there are classes such as : Fluid maechnics, thermodynamics, statistical physics, quantum mechanics, quantum information,...',
    y4s8: '',
    y5s9: '',
    divisions: [
      {
        name: 'Geophysics',
        // Exact text from [[[Geophysics]]]
        desc: 'External: weather prediction, spatial geophysics, telecommunications, and GPS.\nInternal: study of Earth\'s tectonics.',
      },
      {
        name: 'Quantum mechanics/ Computing',
        // Exact text from [[[Quantum mechanics/ Computing]]]
        desc: 'Applications including detection, encryption, and more.',
      },
    ],
    projects: [],
    internships: '',
    advice: '',
  },
  {
    id: 'imm',
    name: 'International Masters in Mathematics',
    abbr: 'IMM',
    color: '#ef4444',
    icon: '∞',
    generalIdea: 'The International Masters in Mathematics (IMM) is a prestigious international program available to students, providing top-tier education and international opportunities in advanced mathematics.',
    prereqs: 'Strong foundation in mathematics and English.',
    prereqClarification: '',
    y3Important: '',
    y3Note: '',
    y4s7: '',
    y4s8: '',
    y5s9: '',
    divisions: [],
    projects: [],
    internships: '',
    advice: '',
  },
];

// ─── Shared Y3 Common Core from gemini-code file ──────────
const Y3_S1_SHARED = 'Partial Differential Equations, Ordinary Differential Equations, Functional Analysis, Complex Analysis, Oriented Object Programming, Stochastic processes, Inferential Statistics, Algebra and coding';
const Y3_S2_SHARED = 'Numerical Analysis of Differential Equations, Integral Transformation, Differential geometry, Field Extensions, Artificial Intelligence, Regression Models, Data Mining, Continuous Optimization';

const CLUSTER_POS = [
  { left: 190, top: 50 },
  { left: 330, top: 190 },
  { left: 190, top: 330 },
  { left: 50,  top: 190 },
  { left: 190, top: 190 }, // 5th item at the center
];

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${color}50, transparent)` }} />
      <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color }}>{label}</span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${color}50, transparent)` }} />
    </div>
  );
}

interface TreeNode {
  id: string;
  label: string;
  title?: string;
  text?: string;
  list?: string[];
  children?: TreeNode[];
}

// === Desktop Mind Map (Interactive SVG Recursive Tree) ===
function MindMapDesktop({ specialty, onClose }: { specialty: Specialty, onClose: () => void }) {
  const [path, setPath] = useState<string[]>([]);
  const c = specialty.color;

  const categories: TreeNode[] = useMemo(() => {
    if (specialty.id === 'imm') {
      return [
        { id: 'idea', label: 'General Idea', title: 'General Idea', text: specialty.generalIdea }
      ];
    }

    const classesChildren: TreeNode[] = [
      {
        id: 'y3', label: '3rd Year', title: 'Third Year',
        children: [
          { id: 'y3s1', label: 'Semester 1', title: 'Semester 1', text: Y3_S1_SHARED },
          { id: 'y3s2', label: 'Semester 2', title: 'Semester 2', text: Y3_S2_SHARED },
          ...(specialty.y3Important || specialty.y3Note ? [{ id: 'y3core', label: 'Specialty Core', title: 'Specialty Core Modules', text: `${specialty.y3Important}\n\n${specialty.y3Note}` }] : [])
        ]
      },
      ...(specialty.id === 'mp' 
        ? [
            { id: 'y4', label: '4th Year', title: 'Fourth Year', text: 'Not disclosed yet.' },
            { id: 'y5', label: '5th Year', title: 'Fifth Year', text: 'Not disclosed yet.' }
          ]
        : [
            ...(specialty.y4s7 || specialty.y4s8 ? [{
              id: 'y4', label: '4th Year', title: 'Fourth Year',
              children: [
                ...(specialty.y4s7 ? [{ id: 'y4s7', label: 'Semester 7', title: 'Semester 7', text: specialty.y4s7 }] : []),
                ...(specialty.y4s8 ? [{ id: 'y4s8', label: 'Semester 8', title: 'Semester 8', text: specialty.y4s8 }] : [])
              ]
            }] : []),
            ...(specialty.y5s9 ? [{
              id: 'y5', label: '5th Year', title: 'Fifth Year',
              children: [
                { id: 'y5s9', label: 'Semester 9', title: 'Semester 9', text: specialty.y5s9 }
              ]
            }] : [])
          ])
    ];

    return [
      { id: 'idea', label: 'General Idea', title: 'General Idea', text: specialty.generalIdea },
      { id: 'prereqs', label: 'Prerequisites', title: 'Basics & Pre-requirements', text: specialty.prereqClarification ? `${specialty.prereqs}\n\nClarification:\n${specialty.prereqClarification}` : specialty.prereqs },
      { id: 'classes', label: 'Classes', children: classesChildren },
      ...(specialty.divisions.length > 0 ? [{
        id: 'divisions', label: 'Divisions',
        children: specialty.divisions.map((d, i) => ({ id: `div-${i}`, label: d.name, title: d.name, text: d.desc }))
      }] : []),
      ...(specialty.projects.length > 0 ? [{ id: 'projects', label: 'Projects', title: 'Final Year Projects', list: specialty.projects }] : []),
      ...(specialty.internships ? [{ id: 'internships', label: 'Internships', title: 'Future & Internships', text: specialty.internships }] : []),
      ...(specialty.advice ? [{ id: 'advice', label: 'Advice', title: 'Student Advice', text: specialty.advice }] : [])
    ];
  }, [specialty]);

  type RenderNode = { node: TreeNode; x: number; y: number; px: number; py: number; depth: number };
  const renderNodes: RenderNode[] = [];
  const CX = 500, CY = 400;
  const RADIUS = [0, 180, 150, 150];

  categories.forEach((cat, i) => {
     const angle = (i * 2 * Math.PI) / categories.length - Math.PI / 2;
     const x = CX + RADIUS[1] * Math.cos(angle);
     const y = CY + RADIUS[1] * Math.sin(angle);
     renderNodes.push({ node: cat, x, y, px: CX, py: CY, depth: 1 });

     if (path[0] === cat.id && cat.children) {
        const n2 = cat.children.length;
        const fan = Math.PI / 1.5;
        const startA = angle - fan / 2;
        cat.children.forEach((sub, j) => {
           const a2 = n2 === 1 ? angle : startA + (j * fan) / (n2 - 1);
           const sx = x + RADIUS[2] * Math.cos(a2);
           const sy = y + RADIUS[2] * Math.sin(a2);
           renderNodes.push({ node: sub, x: sx, y: sy, px: x, py: y, depth: 2 });

           if (path[1] === sub.id && sub.children) {
              const n3 = sub.children.length;
              const fan3 = Math.PI / 2;
              const startA3 = a2 - fan3 / 2;
              sub.children.forEach((leaf, k) => {
                 const a3 = n3 === 1 ? a2 : startA3 + (k * fan3) / (n3 - 1);
                 const lx = sx + RADIUS[3] * Math.cos(a3);
                 const ly = sy + RADIUS[3] * Math.sin(a3);
                 renderNodes.push({ node: leaf, x: lx, y: ly, px: sx, py: sy, depth: 3 });
              });
           }
        });
     }
  });

  // Compute camera pan and zoom
  let panX = 0, panY = 0, scale = 1;
  let targetX = CX, targetY = CY;
  
  if (path.length > 0) {
    const activeLeafId = path[path.length - 1];
    const activeRenderNode = renderNodes.find(rn => rn.node.id === activeLeafId);
    if (activeRenderNode) {
        targetX = activeRenderNode.x;
        targetY = activeRenderNode.y;
        scale = 1.6;
        
        const isTextOpen = !!(activeRenderNode.node.text || activeRenderNode.node.list);
        if (isTextOpen) {
           // Shift camera to accommodate the text box rendering on the right or left
           targetX += (activeRenderNode.x < CX) ? -100 : 100;
        }
    }
  }

  panX = 500 - targetX * scale;
  panY = 400 - targetY * scale;

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ fontFamily: 'var(--font-outfit), sans-serif' }} onClick={() => setPath([])}>
      <svg width="100%" height="100%" viewBox="0 0 1000 800" style={{ display: 'block', userSelect: 'none' }}>
        <g style={{ transform: `translate(${panX}px, ${panY}px) scale(${scale})`, transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' }}>
          
          {/* Root Node (Rendered first to be at the bottom z-index) */}
          <g onClick={(e) => { 
            e.stopPropagation(); 
            if (path.length > 0) setPath([]); 
            else onClose(); 
          }} style={{ cursor: 'pointer' }}>
            <circle cx={CX} cy={CY} r="36" fill={c} opacity="0.15" className="svg-node-pulse" />
            <circle cx={CX} cy={CY} r="18" fill="var(--bg-main)" stroke={c} strokeWidth="3" />
            <text x={CX} y={CY + 6} fill={c} fontSize="18" fontWeight="bold" textAnchor="middle" style={{ fontFamily: 'Georgia, serif' }}>{specialty.icon}</text>
            <text x={CX} y={CY + 52} fill="var(--text-main)" fontSize="16" fontWeight="bold" tracking-widest textAnchor="middle">{specialty.abbr}</text>
          </g>

          {/* Edges */}
          {renderNodes.map(rn => {
            const isAncestor = path[rn.depth - 1] === rn.node.id;
            const isLeafOpen = (rn.node.text || rn.node.list) && path[path.length - 1] === rn.node.id;
            
            let opacity = 0.02;
            if (isLeafOpen) opacity = 1;
            else if (rn.depth < path.length + 1) opacity = isAncestor ? 0.6 : 0.02;
            else if (rn.depth === path.length + 1) opacity = 1;

            if (opacity < 0.05) return null;

            return <line key={`line-${rn.node.id}`} x1={rn.px} y1={rn.py} x2={rn.x} y2={rn.y} stroke={c} strokeWidth="1.5" opacity={opacity * 0.4} />;
          })}

          {/* Nodes */}
          {renderNodes.map(rn => {
            const { node, x, y, depth } = rn;
            const isAncestor = path[depth - 1] === node.id;
            const isLeafOpen = (node.text || node.list) && path[path.length - 1] === node.id;
            
            let opacity = 0.02;
            if (isLeafOpen) opacity = 1;
            else if (depth < path.length + 1) opacity = isAncestor ? 0.4 : 0.02;
            else if (depth === path.length + 1) opacity = 1;

            const isActive = isAncestor || isLeafOpen;
            const isLeft = x < CX;

            return (
              <g key={`node-${node.id}`} style={{ opacity, transition: 'opacity 0.4s', cursor: 'pointer' }}
                 onClick={(e) => {
                   e.stopPropagation();
                   const idxInPath = path.indexOf(node.id);
                   if (idxInPath !== -1) {
                     setPath(path.slice(0, idxInPath));
                   } else {
                     setPath([...path.slice(0, depth - 1), node.id]);
                   }
                 }}>
                 
                 <circle cx={x} cy={y} r={isActive ? 20 : 12} fill={c} opacity={isActive ? 0.2 : 0.05} />
                 <circle cx={x} cy={y} r={isActive ? 8 : 5} fill={isActive ? c : 'var(--bg-main)'} stroke={c} strokeWidth="2" />
                 
                 <text x={x} y={y + 26} fill={isActive ? 'var(--text-main)' : 'var(--text-muted)'} fontSize={isActive ? "14" : "12"} fontWeight={isActive ? "bold" : "normal"} textAnchor="middle">
                   {node.label}
                 </text>

                 {isLeafOpen && (
                   <foreignObject x={isLeft ? x - 370 : x + 20} y={y - 120} width="350" height="400" style={{ overflow: 'visible', pointerEvents: 'none' }}>
                     <div className="p-4 rounded-xl shadow-2xl animate-fade-in" style={{ background: 'var(--bg-overlay)', border: `1px solid ${c}70`, pointerEvents: 'auto', boxShadow: `0 0 40px ${c}20` }}>
                       <h4 className="text-[var(--text-main)] font-bold mb-3 text-sm">{node.title}</h4>
                       {node.text && (
                         <div className="text-[var(--text-main)] text-xs whitespace-pre-line leading-relaxed max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                           {node.text}
                         </div>
                       )}
                       {node.list && (
                         <ul className="text-[var(--text-main)] text-xs leading-relaxed max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                           {node.list.map((item: string, idx: number) => (
                             <li key={idx} className="flex gap-2"><span style={{ color: c }}>•</span> {item}</li>
                           ))}
                         </ul>
                       )}
                     </div>
                   </foreignObject>
                 )}
              </g>
            );
          })}

        </g>
      </svg>
    </div>
  );
}

// === Mobile Scrollable Text (Fallback) ===
function MindMapMobile({ specialty }: { specialty: Specialty }) {
  const [openDiv, setOpenDiv] = useState<number | null>(null);
  const c = specialty.color;

  return (
    <div style={{ color: '#e5e7eb', padding: '32px 24px', fontFamily: 'var(--font-outfit), sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl font-bold mb-4"
          style={{ background: c + '18', border: `2px solid ${c}50`, color: c, boxShadow: `0 0 30px ${c}30`, fontFamily: 'Georgia, serif' }}>
          {specialty.icon}
        </div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: c }}>{specialty.name}</h2>
      </div>

      {/* General Idea */}
      <div className="mb-8">
        <SectionLabel label="General Idea" color={c} />
        <p className="text-[var(--text-main)] leading-relaxed text-sm whitespace-pre-line">{specialty.generalIdea}</p>
      </div>

      {specialty.id !== 'imm' && (
        <>
          {/* Basics & Pre-requirements */}
          <div className="mb-8">
            <SectionLabel label="Basics & Pre-requirements" color={c} />
            <p className="text-[var(--text-main)] leading-relaxed text-sm mb-3">{specialty.prereqs}</p>
            {specialty.prereqClarification && (
              <div className="pl-4 text-sm text-[var(--text-main)] leading-relaxed whitespace-pre-line"
                style={{ borderLeft: `2px solid ${c}40` }}>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Clarification:</span>
                {specialty.prereqClarification}
              </div>
            )}
          </div>

          {/* Classes */}
          <div className="mb-8">
            <SectionLabel label="Classes" color={c} />

            {/* Third Year */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Third Year</p>
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1">Semester 1 (Common to all specialties):</p>
                <p className="text-sm text-[var(--text-main)] leading-relaxed">{Y3_S1_SHARED}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1">Semester 2 (Common to all specialties):</p>
                <p className="text-sm text-[var(--text-main)] leading-relaxed">{Y3_S2_SHARED}</p>
              </div>
              {specialty.y3Important && (
                <div className="mt-3 p-3 rounded-lg" style={{ background: c + '08', border: `1px solid ${c}20` }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: c }}>The important ones:</p>
                  <p className="text-sm text-[var(--text-main)] leading-relaxed">{specialty.y3Important}</p>
                  {specialty.y3Note && <p className="text-xs text-gray-500 mt-2 italic">{specialty.y3Note}</p>}
                </div>
              )}
              {!specialty.y3Important && specialty.y3Note && (
                <p className="text-sm text-[var(--text-main)] italic mt-2">{specialty.y3Note}</p>
              )}
            </div>

            {/* Fourth Year */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Fourth Year</p>
              {specialty.id === 'mp' ? (
                <p className="text-sm text-[var(--text-main)] leading-relaxed">Not disclosed yet.</p>
              ) : (
                <>
                  {specialty.y4s7 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-600 mb-1">S7:</p>
                      <p className="text-sm text-[var(--text-main)] leading-relaxed">{specialty.y4s7}</p>
                    </div>
                  )}
                  {specialty.y4s8 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">S8:</p>
                      <p className="text-sm text-[var(--text-main)] leading-relaxed">{specialty.y4s8}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Fifth Year */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Fifth Year</p>
              {specialty.id === 'mp' ? (
                <p className="text-sm text-[var(--text-main)] leading-relaxed">Not disclosed yet.</p>
              ) : specialty.y5s9 ? (
                <div>
                  <p className="text-xs text-gray-600 mb-1">S9:</p>
                  <p className="text-sm text-[var(--text-main)] leading-relaxed">{specialty.y5s9}</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* General Divisions */}
          {specialty.divisions.length > 0 && (
            <div className="mb-8">
              <SectionLabel label="General divisions in Specility" color={c} />
              <div className="space-y-2">
                {specialty.divisions.map((div, i) => (
                  <button key={div.name}
                    className="w-full text-left rounded-lg overflow-hidden"
                    style={{
                      background: openDiv === i ? c + '12' : 'var(--bg-card)',
                      border: `1px solid ${openDiv === i ? c + '55' : 'var(--border-light)'}`,
                      transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                    onClick={() => setOpenDiv(openDiv === i ? null : i)}>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="font-semibold text-sm text-[var(--text-main)]">{div.name}</span>
                      <span className="text-xs" style={{
                        color: c,
                        transform: openDiv === i ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s ease',
                        display: 'inline-block',
                      }}>▾</span>
                    </div>
                    {openDiv === i && (
                      <div className="px-4 pb-4 text-sm text-[var(--text-main)] leading-relaxed whitespace-pre-line">{div.desc}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Final Year Projects */}
          {specialty.projects.length > 0 && (
            <div className="mb-8">
              <SectionLabel label="Final Year Projects" color={c} />
              <p className="text-sm text-gray-500 mb-3 italic">
                The students has worked on many diffrent fields applying their knowledge and taking the challenge to the next level, some projects&apos; titles were:
              </p>
              <ul className="space-y-3">
                {specialty.projects.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex-shrink-0" style={{ color: c }}>-</span>
                    <span className="text-[var(--text-main)]">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Future and Internships */}
          {specialty.internships && (
            <div className="mb-8">
              <SectionLabel label="Futur and Internships" color={c} />
              <p className="text-sm text-[var(--text-main)] leading-relaxed px-4 py-3 rounded-lg"
                style={{ background: c + '0a', border: `1px solid ${c}25` }}>
                {specialty.internships}
              </p>
            </div>
          )}

          {/* Student Advice */}
          {specialty.advice && (
            <div className="mb-4">
              <SectionLabel label="Student Advice" color={c} />
              <blockquote className="pl-5 py-3 text-sm text-[var(--text-main)] leading-relaxed rounded-r-lg whitespace-pre-line"
                style={{ borderLeft: `3px solid ${c}70`, background: c + '08' }}>
                {specialty.advice}
              </blockquote>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SpecialtiesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);

  const selectedSpecialty = SPECIALTIES.find((s) => s.id === selectedId) ?? null;

  const handleDiamondClick = (id: string) => {
    setSelectedId(id);
    setTimeout(() => setIsExpanded(true), 80);
  };

  const handleBack = () => {
    setIsExpanded(false);
    setTimeout(() => setSelectedId(null), 420);
  };

  return (
    <>
      {/* Page Header */}
      <div className="text-center pt-8 pb-10 animate-fade-in-up">
        {/* Exact title from docs */}
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-main)] mb-4 tracking-tight">
          Discover Our{' '}
          <span style={{
            background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Specialties
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
          Five paths in applied mathematics. One destiny. Choose your domain.
        </p>
      </div>

      {/* ── DESKTOP: Diamond Cluster ──────────────────────── */}
      <div className="hidden md:block">
        <div className="flex flex-col items-center">
          <div className="relative" style={{
            width: 520, height: 520,
            transition: 'opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            opacity: isExpanded ? 0 : 1,
            transform: isExpanded ? 'scale(0.9)' : 'scale(1)',
            pointerEvents: isExpanded ? 'none' : 'auto',
          }}>
            {SPECIALTIES.map((sp, idx) => (
              <button key={sp.id} id={`diamond-${sp.id}`} className="absolute group"
                style={{
                  left: CLUSTER_POS[idx].left, top: CLUSTER_POS[idx].top,
                  width: 140, height: 140, transform: 'rotate(45deg)',
                  background: sp.color + '14', border: `2px solid ${sp.color}50`,
                  boxShadow: `0 0 20px ${sp.color}20, inset 0 0 20px ${sp.color}08`,
                  transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)', cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = sp.color + '28';
                  el.style.border = `2px solid ${sp.color}90`;
                  el.style.boxShadow = `0 0 40px ${sp.color}40, 0 0 80px ${sp.color}20, inset 0 0 30px ${sp.color}10`;
                  el.style.transform = 'rotate(45deg) scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = sp.color + '14';
                  el.style.border = `2px solid ${sp.color}50`;
                  el.style.boxShadow = `0 0 20px ${sp.color}20, inset 0 0 20px ${sp.color}08`;
                  el.style.transform = 'rotate(45deg) scale(1)';
                }}
                onClick={() => handleDiamondClick(sp.id)}>
                <div style={{
                  transform: 'rotate(-45deg)', width: '100%', height: '100%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <span className="font-bold text-2xl leading-none" style={{ color: sp.color, fontFamily: 'Georgia, serif' }}>{sp.icon}</span>
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: sp.color }}>{sp.abbr}</span>
                  <span className="text-center text-[var(--text-main)] leading-tight px-2" style={{ fontSize: '10px', lineHeight: '1.3' }}>{sp.name}</span>
                </div>
              </button>
            ))}
          </div>

          {!isExpanded && (
            <p className="text-gray-600 text-sm mt-2 animate-fade-in">
              ✦ Hover to preview · Click to enter the specialty ✦
            </p>
          )}
        </div>

        {/* Expanded Overlay */}
        {selectedSpecialty && (
          <div className="fixed inset-0 z-50" style={{
            background: 'var(--bg-overlay)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            transition: 'opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            opacity: isExpanded ? 1 : 0, pointerEvents: isExpanded ? 'auto' : 'none',
          }}>
            <button id="back-to-specialties"
              className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-gray-400"
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; }}
              onClick={handleBack}>
              ← Back to Specialties
            </button>

            <div className="absolute top-5 right-6 z-20 flex gap-2">
              {SPECIALTIES.map((sp) => (
                <button key={sp.id} id={`switch-${sp.id}`}
                  className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
                  style={{
                    transform: 'rotate(45deg)',
                    background: selectedId === sp.id ? sp.color + '35' : 'var(--bg-card)',
                    border: `1px solid ${selectedId === sp.id ? sp.color + '80' : 'var(--border-light)'}`,
                    boxShadow: selectedId === sp.id ? `0 0 15px ${sp.color}40` : 'none',
                    transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)', cursor: 'pointer',
                  }}
                  onClick={() => setSelectedId(sp.id)}>
                  <span style={{ transform: 'rotate(-45deg)', color: sp.color }}>{sp.icon}</span>
                </button>
              ))}
            </div>

            {SPECIALTIES.map((sp, idx) => {
              const isActive = sp.id === selectedId;
              const cornerStyle: React.CSSProperties = {
                position: 'absolute', width: 90, height: 90,
                background: isActive ? sp.color + '30' : 'transparent',
                border: `2px solid ${sp.color}${isActive ? 'aa' : '45'}`,
                boxShadow: isActive ? `0 0 30px ${sp.color}45, 0 0 60px ${sp.color}20` : 'none',
                transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: isActive ? 'default' : 'pointer',
              };
              if (idx === 0) { cornerStyle.top = 64; cornerStyle.left = 'calc(50% - 45px)'; cornerStyle.transform = 'rotate(45deg)'; }
              else if (idx === 1) { cornerStyle.top = 'calc(50% - 45px)'; cornerStyle.right = 64; cornerStyle.transform = 'rotate(45deg)'; }
              else if (idx === 2) { cornerStyle.bottom = 64; cornerStyle.left = 'calc(50% - 45px)'; cornerStyle.transform = 'rotate(45deg)'; }
              else if (idx === 3) { cornerStyle.top = 'calc(50% - 45px)'; cornerStyle.left = 64; cornerStyle.transform = 'rotate(45deg)'; }
              else { cornerStyle.top = 'calc(50% - 45px)'; cornerStyle.left = 'calc(50% - 45px)'; cornerStyle.transform = 'rotate(45deg)'; }
              return (
                <div key={sp.id} style={cornerStyle} onClick={() => !isActive && setSelectedId(sp.id)}>
                  <div style={{ transform: 'rotate(-45deg)', textAlign: 'center' }}>
                    <div className="text-sm font-bold leading-none mb-0.5" style={{ color: sp.color }}>{sp.abbr}</div>
                    <div className="text-[9px] text-gray-400 leading-tight">{sp.name.split(' ')[0]}</div>
                  </div>
                </div>
              );
            })}

            {/* Desktop SVG Overlay */}
            <div key={`${selectedId}-desktop`} className="hidden md:block absolute overflow-hidden" style={{
              top: 40, bottom: 40, left: 40, right: 40,
              background: 'var(--bg-overlay)', border: '1px solid var(--border-light)',
              borderRadius: 24, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            }}>
              <MindMapDesktop specialty={selectedSpecialty} onClose={handleBack} />
            </div>

            {/* Mobile HTML Overlay */}
            <div key={`${selectedId}-mobile`} className="md:hidden absolute overflow-y-auto" style={{
              top: 20, bottom: 20, left: 16, right: 16,
              background: 'var(--bg-overlay)', border: '1px solid var(--border-light)',
              borderRadius: 24, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            }}>
              <MindMapMobile specialty={selectedSpecialty} />
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE: Vertical Accordion ───────────────────── */}
      <div className="md:hidden space-y-3 pb-10">
        {SPECIALTIES.map((sp) => {
          const isOpen = mobileOpenId === sp.id;
          return (
            <div key={sp.id} className="rounded-xl overflow-hidden" style={{
              border: `1px solid ${isOpen ? sp.color + '55' : 'var(--border-light)'}`,
              background: isOpen ? sp.color + '08' : 'var(--bg-card)',
              transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            }}>
              <button id={`mobile-${sp.id}`}
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => setMobileOpenId(isOpen ? null : sp.id)}>
                <div className="flex-shrink-0 flex items-center justify-center" style={{
                  width: 48, height: 48, transform: 'rotate(45deg)',
                  background: sp.color + '20', border: `1.5px solid ${sp.color}55`,
                  boxShadow: isOpen ? `0 0 20px ${sp.color}35` : 'none',
                  transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                }}>
                  <span className="font-bold text-lg" style={{ transform: 'rotate(-45deg)', color: sp.color, fontFamily: 'Georgia, serif' }}>{sp.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: sp.color }}>{sp.abbr}</div>
                  <div className="font-semibold text-foreground text-sm">{sp.name}</div>
                </div>
                <span style={{
                  color: sp.color, display: 'inline-block',
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                  fontSize: 18, flexShrink: 0,
                }}>▾</span>
              </button>
              <div style={{
                maxHeight: isOpen ? '9000px' : 0,
                overflow: 'hidden',
                transition: 'max-height 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
              }}>
                <div className="px-5 pb-6 pt-2 border-t" style={{ borderColor: sp.color + '20' }}>
                  <MindMapMobile specialty={sp} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
