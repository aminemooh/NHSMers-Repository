const fs = require('fs');

const pageContent = `
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ============================================================
// DATA STRUCTURES
// ============================================================

interface ResourceType { id: string; label: string; url?: string; }
interface Module { id: string; label: string; types: ResourceType[]; }
interface Semester { id: string; label: string; modules: Module[]; }
interface YearNode { id: string; label: string; sublabel: string; type: 'trunk' | 'split'; semesters: Semester[]; }
interface SpecialtyNode { id: string; label: string; abbr: string; color: string; semesters: Semester[]; }

const RESOURCE_TYPES: ResourceType[] = [
  { id: 'lectures', label: 'Lectures' },
  { id: 'td', label: 'Worksheets' },
  { id: 'tp', label: 'Labs' },
  { id: 'projects', label: 'Projects' },
  { id: 'exams', label: 'Exams' },
  { id: 'resources', label: 'External Resources' },
];

const BASIC_TYPES = RESOURCE_TYPES.filter(t => ['lectures', 'td', 'exams', 'resources'].includes(t.id));
const LAB_TYPES = RESOURCE_TYPES.filter(t => ['lectures', 'td', 'tp', 'exams', 'resources'].includes(t.id));
const PROJ_TYPES = RESOURCE_TYPES;
const LANG_TYPES = RESOURCE_TYPES.filter(t => ['lectures', 'exams'].includes(t.id));

const driveLinks: Record<string, Record<string, string>> = {
  "Analysis 1": {"lectures":"https://drive.google.com/drive/folders/17trYn2mgoiMjf-j_r3-UrmN7CoTAO5u7?usp=drive_link","td":"https://drive.google.com/drive/folders/1uCT4SWp5xJUWe9geMKoverFgwm0V-b5N?usp=drive_link","exams":"https://drive.google.com/drive/folders/1yL3D4vKq50Yt3hF-N0fD-k_L475S2FST?usp=drive_link"},
  "Descriptive Statistics & Intro to Probability": {"lectures":"https://drive.google.com/drive/folders/1w7cW0G5k8h1tG02b_A46kG9G554r7yq4?usp=drive_link","td":"https://drive.google.com/drive/folders/1fR7cnsNnZ0Q7E1i91-nOqWwI9d_M542i?usp=drive_link","exams":"https://drive.google.com/drive/folders/1iZ18WnL8nZ9Lh64K3hZg9u0024oV9X-8?usp=drive_link"},
  "Algebra 1": {"lectures":"https://drive.google.com/drive/folders/13E_q8gKjO8s1j9D5vT5o4K2q8w0D6XqR?usp=drive_link","td":"https://drive.google.com/drive/folders/1X-5tD-O8p5kK3W9vI3m1fK7R1O6vP4p-?usp=drive_link","exams":"https://drive.google.com/drive/folders/12f2z4gT8-2e06f86Y036x_73I8V3x8_4?usp=drive_link"},
  "Discrete Mathematics 1": {"lectures":"https://drive.google.com/drive/folders/198Q41Z7O2YQ0v4G9W9v52l2h0P7H-K6w?usp=drive_link","td":"https://drive.google.com/drive/folders/1h809Q5K3lq-1e8q8vH4o-8yQ8h8Z_7u0?usp=drive_link","exams":"https://drive.google.com/drive/folders/1h0W49n374Q06U2fW6y35_u5O_0I7y1x1?usp=drive_link"},
  "Algorithms & Data Structures 1": {"lectures":"https://drive.google.com/drive/folders/1O1uO_D7814X8832I5O47L8W78U-yX9k5?usp=drive_link","td":"https://drive.google.com/drive/folders/175z47p4_L-0L80m_rW7s-0010_e62t6_?usp=drive_link","tp":"https://drive.google.com/drive/folders/12wV0nU2g8_8tG7H43gL_6X_4_bK6xW5h?usp=drive_link","exams":"https://drive.google.com/drive/folders/1sX9Yv96T7x6L8V6W9xK0_174mG8j1oV3?usp=drive_link"},
  "Physics 1": {"lectures":"https://drive.google.com/drive/folders/1M4_H9gO_9S-5P9_1K0oU_8jL_R8l-t8b?usp=drive_link","td":"https://drive.google.com/drive/folders/1I9R_z_P_a4S3y9150G42Q9X0x60m8m0c?usp=drive_link","exams":"https://drive.google.com/drive/folders/1T60zW8yV95123992qG5Q3v88L9_6-R19?usp=drive_link"},
  "Analysis 2": {"lectures":"https://drive.google.com/drive/folders/14U4s4gL_r1mO0K5e0E7uO_7L5n35S5O5?usp=drive_link","td":"https://drive.google.com/drive/folders/1O7m2y2lO9uO8w2O8k6o0zK5O8x0w1_pX?usp=drive_link","exams":"https://drive.google.com/drive/folders/1r02jE2kL5wW45x_g3_9K2E1r180tP5w1?usp=drive_link"},
  "Probability 1": {"lectures":"https://drive.google.com/drive/folders/1v6H-I6wZ03O45p9_b7Q0_9w42VwY_yM2?usp=drive_link","td":"https://drive.google.com/drive/folders/1-8n0P_eZ2y0mE1O3sX_K4eZ1eN5I589V?usp=drive_link","exams":"https://drive.google.com/drive/folders/1r3Z3l762S0_G51O_j8T_5W_X1o5X4r_9?usp=drive_link"},
  "Algebra 2": {"lectures":"https://drive.google.com/drive/folders/1s8Q49zG0X9rU4T6h4qI4Q_qU5R2e2U2e?usp=drive_link","td":"https://drive.google.com/drive/folders/1G8x3y0P_Z7O5E8sU_G_M8v6h1n2E5D0E?usp=drive_link","exams":"https://drive.google.com/drive/folders/1-2Y36xQ1I_lZ9V4lT5I6j_kL_o2n5I3P?usp=drive_link"},
  "Discrete Mathematics 2": {"lectures":"https://drive.google.com/drive/folders/1Y-83kL93_6X0H5G5jH_kZ8R7T5xO7u5x?usp=drive_link","td":"https://drive.google.com/drive/folders/1a8r7nZ9V8G2t5wY9F4oT9G_pX_X0L7q_?usp=drive_link","exams":"https://drive.google.com/drive/folders/1N1iX288_r0Q4P3aV4X9F7z2X6Z_G1O4P?usp=drive_link"},
  "Algorithms & Data Structures 2": {"lectures":"https://drive.google.com/drive/folders/1H4n8k1y9R7j_o1v2X5W8_p9G4T9I4D2V?usp=drive_link","td":"https://drive.google.com/drive/folders/1U8sO_G0X7Z6P4X9dZ0Q_k0K4n6X_3Q5h?usp=drive_link","tp":"https://drive.google.com/drive/folders/1J_17uX_1P8c1vQ4j0_L1I7f1F7fO9n5h?usp=drive_link","exams":"https://drive.google.com/drive/folders/1Q8r3X4wL8D4H2r4F9c2O5T1P4U1wL_mN?usp=drive_link"},
  "Physics 2": {"lectures":"https://drive.google.com/drive/folders/1xP7U0sP1H3g_4V7y4R0b1Z0yK9d3D5wF?usp=drive_link","td":"https://drive.google.com/drive/folders/1r_W6H7a0B7y4V5aT6D9_F0E4zX4kL6V4?usp=drive_link","exams":"https://drive.google.com/drive/folders/1A0_7w8g8E_p2c0O3J5I5Y6W1U8h8R5s?usp=drive_link"},
  "Mathematical Logic": {"lectures":"https://drive.google.com/drive/folders/1b0_0X4f9A4_W2O7n3g_0I4J7_zZ2Z7D4?usp=drive_link","td":"https://drive.google.com/drive/folders/1z0G8t9X6nZ0eZ5R_o5B0H1I2r3F7t1A0?usp=drive_link","exams":"https://drive.google.com/drive/folders/1P3h0_6I0c9fT9D2p_G1F9r5k4c4Y4G2X?usp=drive_link"},
  "Analysis 3": {"lectures":"https://drive.google.com/drive/folders/10KWeH1v4N_6aJb5eQ6J0f8aU3r0i2q4w?usp=drive_link","td":"https://drive.google.com/drive/folders/1W0n8d_3K9lG4B7bT0R1b7D6Q_q4U0Y8x?usp=drive_link","exams":"https://drive.google.com/drive/folders/1K5V0B5h7q_0I7d4e5S1P4l0F0O1F8K1O?usp=drive_link"},
  "Algebra 3": {"lectures":"https://drive.google.com/drive/folders/1O0E4W6Q0tY0Z_u4X9D0N3y6Y8F8b1Z1_?usp=drive_link","td":"https://drive.google.com/drive/folders/1Q2Z4o1F_3c_I5m7t1O_U1Y9o_n3X5A8W?usp=drive_link","exams":"https://drive.google.com/drive/folders/1O9_0w0q6sO7U6u9c_5_k_X2E1F4U1p1c?usp=drive_link"},
  "Probability 2": {"lectures":"https://drive.google.com/drive/folders/1F9v5D4Q6l8U_p_y_w8w_0o5r2U1m_h5H?usp=drive_link","td":"https://drive.google.com/drive/folders/1G2w_7p6X1A9r_R5T9c6B4K5e8V1R_k9L?usp=drive_link","exams":"https://drive.google.com/drive/folders/1C9q0Z_g1r6A2c8V9J3_Q8S7O2n1Q2O6Z?usp=drive_link"},
  "Numerical Analysis 1": {"lectures":"https://drive.google.com/drive/folders/1w8z4H4I9W9v4b_9P1_6K2t_H8H4O0O1b?usp=drive_link","td":"https://drive.google.com/drive/folders/1_9V4R8s9w8c3R_k1g2o1X2d_1s_3O5Y7?usp=drive_link","tp":"https://drive.google.com/drive/folders/1V3F0Q9n_w6u6J1d7Y9s0Y5_3Y0e9E3L7?usp=drive_link","exams":"https://drive.google.com/drive/folders/1u5K8n6P3S1q1K8e2n2y0A3q8L0k0O_r?usp=drive_link"},
  "Topological & Metric Spaces": {"lectures":"https://drive.google.com/drive/folders/1r0O8u0v6n4w_N0U_1h_3P_1Y0O1y0O0q?usp=drive_link","td":"https://drive.google.com/drive/folders/1K7U5w8p0e9t0w6K7r6_0J0M1Q5_0C3S_?usp=drive_link","exams":"https://drive.google.com/drive/folders/1M6y5l4k1O8s3A9S6X2R1s_5Y2V6B_v3T?usp=drive_link"},
  "Geometry 1": {"lectures":"https://drive.google.com/drive/folders/1T0R9_5K8U_2x_z8v3H1z9g2_u2D9P6g2?usp=drive_link","td":"https://drive.google.com/drive/folders/1O0J9U9_6Y1z5p2U_6d2k0D4Y5Z7Q1H3U?usp=drive_link","exams":"https://drive.google.com/drive/folders/1z_0d1C5e9U7e_3K3k6o9M_5M8X8P6z9V?usp=drive_link"}
};

function makeModule(id: string, label: string, baseTypes: ResourceType[] = BASIC_TYPES): Module {
  const isLangOrGeop = label.includes('English') || label.includes('Geopolitics');
  const isHist = label.includes('History');
  let typesToUse = baseTypes;
  if (isLangOrGeop) typesToUse = LANG_TYPES;
  else if (isHist) typesToUse = RESOURCE_TYPES.filter(t => ['lectures', 'resources'].includes(t.id));
  
  const urls = driveLinks[label] || {};
  return { id, label, types: typesToUse.map(t => ({ ...t, url: urls[t.id] })) };
}

const YEAR_NODES: YearNode[] = [
  { id: 'y1', label: 'First Year', sublabel: 'Preparatory Class', type: 'trunk', semesters: [
      { id: 'y1s1', label: 'Semester 1', modules: [
          makeModule('y1s1-mod1', 'Analysis 1', LAB_TYPES),
          makeModule('y1s1-mod2', 'Descriptive Statistics & Intro to Probability'),
          makeModule('y1s1-mod3', 'Algebra 1'),
          makeModule('y1s1-mod4', 'Discrete Mathematics 1'),
          makeModule('y1s1-mod5', 'Algorithms & Data Structures 1', PROJ_TYPES),
          makeModule('y1s1-mod6', 'Physics 1', LAB_TYPES),
          makeModule('y1s1-mod7', 'History of Mathematics'),
          makeModule('y1s1-mod8', 'English 1'),
      ]},
      { id: 'y1s2', label: 'Semester 2', modules: [
          makeModule('y1s2-mod1', 'Analysis 2'),
          makeModule('y1s2-mod2', 'Probability 1'),
          makeModule('y1s2-mod3', 'Algebra 2'),
          makeModule('y1s2-mod4', 'Discrete Mathematics 2'),
          makeModule('y1s2-mod5', 'Algorithms & Data Structures 2', PROJ_TYPES),
          makeModule('y1s2-mod6', 'Physics 2', LAB_TYPES),
          makeModule('y1s2-mod7', 'Mathematical Logic'),
          makeModule('y1s2-mod8', 'English 2'),
      ]},
  ]},
  { id: 'y2', label: 'Second Year', sublabel: 'Preparatory Class', type: 'trunk', semesters: [
      { id: 'y2s3', label: 'Semester 3', modules: [
          makeModule('y2s3-mod1', 'Analysis 3'),
          makeModule('y2s3-mod2', 'Topological & Metric Spaces'),
          makeModule('y2s3-mod3', 'Algebra 3'),
          makeModule('y2s3-mod4', 'Geometry 1'),
          makeModule('y2s3-mod5', 'Numerical Analysis 1', PROJ_TYPES),
          makeModule('y2s3-mod6', 'Probability 2'),
          makeModule('y2s3-mod7', 'English 3'),
      ]},
      { id: 'y2s4', label: 'Semester 4', modules: [
          makeModule('y2s4-mod1', 'Analysis 4'),
          makeModule('y2s4-mod2', 'Measure & Integration'),
          makeModule('y2s4-mod3', 'Geometry 2'),
          makeModule('y2s4-mod4', 'Normed & Topological Vector Spaces'),
          makeModule('y2s4-mod5', 'Tools for Mathematical Programming', PROJ_TYPES),
          makeModule('y2s4-mod6', 'Numerical Analysis 2', LAB_TYPES),
          makeModule('y2s4-mod7', 'Geopolitics & Strategy'),
          makeModule('y2s4-mod8', 'English 4'),
      ]},
  ]},
  { id: 'y3', label: 'Third Year', sublabel: 'Common Core', type: 'split', semesters: [
      { id: 'y3s5', label: 'Semester 1', modules: [
          makeModule('y3s5-mod1', 'Partial Differential Equations', LAB_TYPES),
          makeModule('y3s5-mod2', 'Ordinary Differential Equations'),
          makeModule('y3s5-mod3', 'Functional Analysis'),
          makeModule('y3s5-mod4', 'Complex Analysis'),
          makeModule('y3s5-mod5', 'Object-Oriented Programming', PROJ_TYPES),
          makeModule('y3s5-mod6', 'Stochastic Processes'),
          makeModule('y3s5-mod7', 'Inferential Statistics'),
          makeModule('y3s5-mod8', 'Algebra & Coding'),
      ]},
      { id: 'y3s6', label: 'Semester 2', modules: [
          makeModule('y3s6-mod1', 'Differential Geometry', BASIC_TYPES),
          makeModule('y3s6-mod2', 'Field Extensions & Galois Theory', BASIC_TYPES),
          makeModule('y3s6-mod3', 'Transforms & Integration', BASIC_TYPES),
          makeModule('y3s6-mod4', 'Regression Models', BASIC_TYPES),
          makeModule('y3s6-mod5', 'Continuous Optimization', PROJ_TYPES),
          makeModule('y3s6-mod6', 'Data Mining', PROJ_TYPES),
          makeModule('y3s6-mod7', 'AI', PROJ_TYPES),
          makeModule('y3s6-mod8', 'Numerical Analysis of Differential Equations', LAB_TYPES),
      ]},
  ]},
];

const SPECIALTY_NODES: SpecialtyNode[] = [
  { id: 'ms', label: 'Modeling & Simulation', abbr: 'MS', color: '#10B981', semesters: [
      { id: 'ms-s7', label: 'Semester 1', modules: [makeModule('ms-1', 'Intro Modeling Cont. Env.')] },
      { id: 'ms-s8', label: 'Semester 2', modules: [makeModule('ms-2', 'Non-Variational Methods')] },
      { id: 'ms-s9', label: 'Semester 3', modules: [makeModule('ms-3', 'Image Processing')] },
  ]},
  { id: 'sea', label: 'Statistics & Econometrics', abbr: 'SEA', color: '#3B82F6', semesters: [
      { id: 'sea-s7', label: 'Semester 1', modules: [makeModule('sea-1', 'Stochastic Processes')] },
      { id: 'sea-s8', label: 'Semester 2', modules: [makeModule('sea-2', 'Non-Parametric Estimation')] },
      { id: 'sea-s9', label: 'Semester 3', modules: [makeModule('sea-3', 'Actuarial Science 2')] },
  ]},
  { id: 'ccs', label: 'Cryptology & Security', abbr: 'CCS', color: '#8B5CF6', semesters: [
      { id: 'ccs-s7', label: 'Semester 1', modules: [makeModule('ccs-1', 'Math Tools for Cryptography')] },
      { id: 'ccs-s8', label: 'Semester 2', modules: [makeModule('ccs-2', 'Info Theory & Error Codes')] },
      { id: 'ccs-s9', label: 'Semester 3', modules: [makeModule('ccs-3', 'Cryptanalysis')] },
  ]},
  { id: 'mp', label: 'Mathematical Physics', abbr: 'MP', color: '#F59E0B', semesters: [
      { id: 'mp-s7', label: 'Semester 1', modules: [makeModule('mp-1', 'Quantum Mechanics')] },
      { id: 'mp-s8', label: 'Semester 2', modules: [makeModule('mp-2', 'Solid State Physics')] },
      { id: 'mp-s9', label: 'Semester 3', modules: [makeModule('mp-3', 'Nanophysics')] },
  ]},
  { id: 'imm', label: 'International Masters in Mathematics', abbr: 'IMM', color: '#EF4444', semesters: [
      { id: 'imm-s7', label: 'Semester 1', modules: [makeModule('imm-1', 'Industrial Process Modeling')] },
      { id: 'imm-s8', label: 'Semester 2', modules: [makeModule('imm-2', 'Supply Chain Modeling')] },
      { id: 'imm-s9', label: 'Semester 3', modules: [makeModule('imm-3', 'Digital Twin Modeling')] },
  ]}
];

/* ─── LAYOUT CONSTANTS ─────────────────────────────────────────────────── */
const SVG_W = 900, SVG_H = 640;
const CX = 450;
const TRUNK_BOT = 590, TRUNK_TOP = 410;
const TRUNK_YEAR_Y = [590, 500, 410]; 
const BRANCH_SPLIT_Y = TRUNK_YEAR_Y[2]; 
const SPEC_X: Record<string, number> = { ms: 150, sea: 280, ccs: 450, imm: 620, mp: 750 };
const BRANCH_YEAR_FRACS = [0.45, 0.92]; 
const BRANCH_CP_Y = 300;

function bezierPt(t: number, x0: number, y0: number, cpx: number, cpy: number, x1: number, y1: number) {
  const mt = 1-t;
  return { x: mt*mt*x0+2*mt*t*cpx+t*t*x1, y: mt*mt*y0+2*mt*t*cpy+t*t*y1 };
}
function getBranchYearPos(specId: string, yearFrac: number) {
  const sx = SPEC_X[specId], cpx = (CX+sx)/2;
  return bezierPt(yearFrac, CX, BRANCH_SPLIT_Y, cpx, BRANCH_CP_Y, sx, 130);
}

function runTracer(svgEl: SVGElement, target: any, onSegLit: (k: string)=>void, onDone: ()=>void) {
  const ns = 'http://www.w3.org/2000/svg';
  const tracer = document.createElementNS(ns, 'circle');
  tracer.setAttribute('r', '5');
  tracer.setAttribute('fill', '#ffffff');
  svgEl.appendChild(tracer);

  const { specId, year } = target;
  const trunkLen   = TRUNK_BOT - BRANCH_SPLIT_Y; 
  const branchLen  = 340;
  const usesBranch = year >= 4;
  const sx  = usesBranch ? SPEC_X[specId] : null;
  const cpx = usesBranch ? (CX + sx!) / 2 : null;

  const trunkDist  = usesBranch ? trunkLen : (TRUNK_BOT - TRUNK_YEAR_Y[year - 1]);
  const branchFrac = usesBranch ? BRANCH_YEAR_FRACS[year - 4] : 0;
  const branchDist = branchFrac * branchLen;
  const totalDist  = trunkDist + branchDist;

  const MS_PER_PX = 1400 / (trunkLen + branchLen); 
  const DURATION  = Math.max(totalDist * MS_PER_PX, 320);

  const milestones = [{ dist: 0, key: 'Y1' }];
  if (year >= 2) {
    milestones.push({ dist: (TRUNK_BOT-TRUNK_YEAR_Y[0]) + (TRUNK_YEAR_Y[0]-TRUNK_YEAR_Y[1])*0.5, key: 'Y1-Y2' });
    milestones.push({ dist: TRUNK_BOT - TRUNK_YEAR_Y[1], key: 'Y2' });
  }
  if (year >= 3) {
    milestones.push({ dist: (TRUNK_BOT-TRUNK_YEAR_Y[1]) + (TRUNK_YEAR_Y[1]-TRUNK_YEAR_Y[2])*0.5, key: 'Y2-Y3' });
    milestones.push({ dist: trunkLen, key: 'Y3' });
  }
  if (usesBranch) {
    const y4Dist = trunkLen + BRANCH_YEAR_FRACS[0]*branchLen;
    milestones.push({ dist: trunkLen + (y4Dist-trunkLen)*0.5, key: 'BR-Y4' });
    milestones.push({ dist: y4Dist, key: 'Y4' });
    if (year === 5) {
      const y5Dist = trunkLen + BRANCH_YEAR_FRACS[1]*branchLen;
      milestones.push({ dist: y4Dist + (y5Dist-y4Dist)*0.5, key: 'BR-Y5' });
      milestones.push({ dist: y5Dist, key: 'Y5' });
    }
  }

  const fired = new Set();
  const start = performance.now();

  function frame(now: number) {
    const t = Math.min((now-start)/DURATION, 1);
    const distNow = t * totalDist;
    let px, py;
    if (distNow <= trunkDist) {
      px = CX; py = TRUNK_BOT - distNow;
    } else {
      const p = branchDist > 0 ? (distNow - trunkDist) / branchDist : 1;
      const pt = bezierPt(p*branchFrac, CX, BRANCH_SPLIT_Y, cpx!, BRANCH_CP_Y, sx!, 130);
      px = pt.x; py = pt.y;
    }
    tracer.setAttribute('cx', px.toString());
    tracer.setAttribute('cy', py.toString());

    milestones.forEach(({ dist, key }) => {
      if (!fired.has(key) && distNow >= dist) { fired.add(key); onSegLit(key); }
    });

    if (t < 1) requestAnimationFrame(frame);
    else { svgEl.removeChild(tracer); onDone(); }
  }
  requestAnimationFrame(frame);
}

export default function ResourcesPage() {
  const svgRef  = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const liveZoom   = useRef({ scale:1, tx:0, ty:0 });
  const panRef     = useRef<any>(null); 
  const pinchRef   = useRef<any>(null); 
  const gestureRef = useRef(false);

  const [treeOpened,    setTreeOpened]    = useState(false);
  const [activeTrack,   setActiveTrack]   = useState<string | null>(null);
  const [activeYear,    setActiveYear]    = useState<number | null>(null);
  const [activeSem,     setActiveSem]     = useState<string | null>(null);
  const [activeMod,     setActiveMod]     = useState<string | null>(null);
  const [activeRes,     setActiveRes]     = useState<string | null>(null);

  const [litSegs, setLitSegs] = useState<Set<string>>(new Set());
  const [revealedTrack, setRevealedTrack] = useState<string | null>(null);

  const [semNodes, setSemNodes] = useState<any[]>([]);
  const [modNodes, setModNodes] = useState<any[]>([]);
  const [resNodes, setResNodes] = useState<any[]>([]);

  const [zoom, setZoom] = useState({ scale:1, tx:0, ty:0 });
  const [hint, setHint] = useState('TOUCH THE TRUNK TO BEGIN');

  function getMinScale() {
    const el = wrapRef.current;
    const W = el?.clientWidth  || window.innerWidth;
    const H = el?.clientHeight || window.innerHeight;
    const MARGIN = 80;
    return Math.min((W - MARGIN*2) / SVG_W, (H - MARGIN*2) / SVG_H);
  }
  function clampScale(s: number) {
    return Math.max(getMinScale(), Math.min(s, 14));
  }
  function applyZoom(z: any, animated: boolean) {
    liveZoom.current = z;
    const inner = wrapRef.current?.firstElementChild as HTMLElement;
    if (inner) {
      inner.style.transition = animated
        ? 'transform 0.85s cubic-bezier(0.34,1.1,0.64,1)'
        : 'none';
      inner.style.transform = \`translate(\${z.tx}px,\${z.ty}px) scale(\${z.scale})\`;
    }
    setZoom(z);
  }
  function zoomTo(x: number, y: number, scale: number) {
    const W = wrapRef.current?.clientWidth  || window.innerWidth;
    const H = wrapRef.current?.clientHeight || window.innerHeight;
    const base = Math.min(W/SVG_W, H/SVG_H);
    const s = clampScale(scale * base);
    applyZoom({ scale: s, tx: W/2 - x*s, ty: H/2 - y*s }, true);
  }
  function resetZoom() {
    const W = wrapRef.current?.clientWidth  || window.innerWidth;
    const H = wrapRef.current?.clientHeight || window.innerHeight;
    const s = getMinScale();
    applyZoom({ scale: s, tx: (W - SVG_W*s)/2, ty: (H - SVG_H*s)/2 }, true);
  }
  function zoomBy(factor: number, cx?: number, cy?: number) {
    const W = wrapRef.current?.clientWidth  || window.innerWidth;
    const H = wrapRef.current?.clientHeight || window.innerHeight;
    cx = cx ?? W/2; cy = cy ?? H/2;
    const prev = liveZoom.current;
    const s = clampScale(prev.scale * factor);
    applyZoom({
      scale: s,
      tx: cx - (cx - prev.tx) * (s / prev.scale),
      ty: cy - (cy - prev.ty) * (s / prev.scale),
    }, false);
  }
  useEffect(() => { resetZoom(); }, []);

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    function tdist(a: any,b: any){ const dx=a.clientX-b.clientX,dy=a.clientY-b.clientY; return Math.sqrt(dx*dx+dy*dy); }
    function tmid(a: any,b: any){ return { x:(a.clientX+b.clientX)/2, y:(a.clientY+b.clientY)/2 }; }

    function onStart(e: any) {
      if (e.touches.length === 2) {
        e.preventDefault(); gestureRef.current = true;
        panRef.current = null;
        const [t1,t2] = [e.touches[0], e.touches[1]];
        pinchRef.current = { startDist: tdist(t1,t2), startMid: tmid(t1,t2), startZoom: {...liveZoom.current} };
      } else if (e.touches.length === 1) {
        panRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY,
                           startTx: liveZoom.current.tx, startTy: liveZoom.current.ty };
      }
    }
    function onMove(e: any) {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        const [t1,t2] = [e.touches[0], e.touches[1]];
        const d   = tdist(t1,t2);
        const mid = tmid(t1,t2);
        const p   = pinchRef.current;
        const base = p.startZoom;
        const s = clampScale(base.scale * (d / p.startDist));
        const tx = mid.x - (p.startMid.x - base.tx) * (s / base.scale) - (p.startMid.x - mid.x);
        const ty = mid.y - (p.startMid.y - base.ty) * (s / base.scale) - (p.startMid.y - mid.y);
        applyZoom({ scale:s, tx, ty }, false);
      } else if (e.touches.length === 1 && panRef.current && !pinchRef.current) {
        e.preventDefault();
        const dx = e.touches[0].clientX - panRef.current.startX;
        const dy = e.touches[0].clientY - panRef.current.startY;
        const z  = liveZoom.current;
        applyZoom({ scale: z.scale, tx: panRef.current.startTx + dx, ty: panRef.current.startTy + dy }, false);
      }
    }
    function onEnd(e: any) {
      if (e.touches.length < 2) pinchRef.current = null;
      if (e.touches.length === 0) { panRef.current = null; gestureRef.current = false; }
    }
    el.addEventListener('touchstart',  onStart, { passive:false });
    el.addEventListener('touchmove',   onMove,  { passive:false });
    el.addEventListener('touchend',    onEnd);
    el.addEventListener('touchcancel', onEnd);
    return () => {
      el.removeEventListener('touchstart',  onStart);
      el.removeEventListener('touchmove',   onMove);
      el.removeEventListener('touchend',    onEnd);
      el.removeEventListener('touchcancel', onEnd);
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    let dragging = false, dragStart: any = null;

    function onWheel(e: any) {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? 1.1 : 1/1.1, e.clientX, e.clientY);
    }
    function onMouseDown(e: any) {
      if (e.button !== 0) return;
      dragging = true;
      dragStart = { x: e.clientX, y: e.clientY, tx: liveZoom.current.tx, ty: liveZoom.current.ty };
      el.style.cursor = 'grabbing';
    }
    function onMouseMove(e: any) {
      if (!dragging || !dragStart) return;
      const dx = e.clientX - dragStart.x, dy = e.clientY - dragStart.y;
      const z  = liveZoom.current;
      applyZoom({ scale: z.scale, tx: dragStart.tx + dx, ty: dragStart.ty + dy }, false);
    }
    function onMouseUp() {
      dragging = false; dragStart = null;
      el.style.cursor = '';
    }

    el.addEventListener('wheel',     onWheel, { passive:false });
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      el.removeEventListener('wheel',     onWheel);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, []);

  function bloomNodes(cx: number, cy: number, items: any[], radius: number, setter: any, delay=50) {
    const nodes = items.map((obj,i) => {
      const angle = (2*Math.PI/items.length)*i - Math.PI/2;
      return { id: obj.id, label: obj.label, url: obj.url, x: cx+Math.cos(angle)*radius, y: cy+Math.sin(angle)*radius, cx, cy, visible:false };
    });
    setter(nodes);
    nodes.forEach((_,i) => setTimeout(()=>
      setter((prev: any)=>prev.map((p:any,pi:any)=>pi===i?{...p,visible:true}:p)), i*delay+80));
  }

  function bloomSemNodes(cx: number, cy: number, sems: any[], radius: number, setter: any) {
    const nodes = sems.map((s, i)=>({ id: s.id, label: s.label, x:cx+(i===0?-1:1)*radius, y:cy, cx, cy, visible:false }));
    setter(nodes);
    nodes.forEach((_,i) => setTimeout(()=>
      setter((prev: any)=>prev.map((p:any,pi:any)=>pi===i?{...p,visible:true}:p)), i*120+80));
  }

  function openTree() {
    if (treeOpened) return;
    setTreeOpened(true);
    setHint('CLICK A YEAR OR A SPECIALTY');
  }

  function revealTrack(trackId: string) {
    const track = SPECIALTY_NODES.find(t => t.id === trackId);
    if (!track) return;
    if (!treeOpened) openTree();
    if (revealedTrack === trackId && !activeTrack) {
      setRevealedTrack(null);
      setHint('CLICK A YEAR OR A SPECIALTY');
      return;
    }
    if (activeTrack && activeTrack !== trackId) {
      setActiveTrack(null); setLitSegs(new Set()); setActiveYear(null);
      setActiveSem(null); setActiveMod(null); setActiveRes(null);
      setSemNodes([]); setModNodes([]); setResNodes([]);
    }
    setRevealedTrack(trackId);
    setHint('CLICK Y4 OR Y5 ON THE BRANCH');
  }

  function activateYear(trackId: string, year: number) {
    if (!treeOpened) openTree();
    if (activeYear === year && activeTrack === trackId) { goBack(); return; }

    setSemNodes([]); setModNodes([]); setResNodes([]);
    setActiveSem(null); setActiveMod(null); setActiveRes(null);
    setLitSegs(new Set());
    setActiveTrack(trackId);
    setActiveYear(year);
    setRevealedTrack(trackId);
    setHint('TRACING PATH…');

    if (svgRef.current) {
      runTracer(
        svgRef.current, { specId: trackId, year },
        (key) => setLitSegs(prev => { const n = new Set(prev); n.add(key); return n; }),
        () => {
          const pos  = getBranchYearPos(trackId, BRANCH_YEAR_FRACS[year-4]);
          const track = SPECIALTY_NODES.find(t => t.id === trackId);
          if (track) {
            const semStart = (year - 4) * 2;
            const sems = track.semesters.slice(semStart, semStart + 2);
            bloomSemNodes(pos.x, pos.y, sems, 80, setSemNodes);
          }
          zoomTo(pos.x, pos.y, 2.6);
          setHint('CLICK A SEMESTER NODE');
        }
      );
    }
    zoomTo(SPEC_X[trackId], 350, 1.3);
  }

  function activateCommonYear(year: number) {
    if (!treeOpened) openTree();
    if (activeYear === year && !activeTrack) { goBack(); return; }
    setActiveTrack(null); setRevealedTrack(null); setLitSegs(new Set());
    setActiveYear(year);
    setActiveSem(null); setActiveMod(null); setActiveRes(null);
    setSemNodes([]); setModNodes([]); setResNodes([]);
    setHint('TRACING PATH…');

    if (svgRef.current) {
      runTracer(
        svgRef.current, { specId: null, year },
        (key) => setLitSegs(prev => { const n = new Set(prev); n.add(key); return n; }),
        () => {
          const pos = { x:CX, y:TRUNK_YEAR_Y[year-1] };
          const yearData = YEAR_NODES[year-1];
          if (yearData) {
            bloomSemNodes(pos.x, pos.y, yearData.semesters, 80, setSemNodes);
          }
          zoomTo(pos.x, pos.y, 2.6);
          setHint('CLICK A SEMESTER NODE');
        }
      );
    }
    zoomTo(CX, 500, 1.3);
  }

  function activateSem(semId: string, sx: number, sy: number) {
    if (activeSem === semId) { goBack(); return; }
    setActiveSem(semId); setActiveMod(null); setActiveRes(null);
    setModNodes([]); setResNodes([]);
    
    let yearData = null;
    if (activeTrack) {
        yearData = SPECIALTY_NODES.find(t => t.id === activeTrack)?.semesters;
    } else if (activeYear) {
        yearData = YEAR_NODES[activeYear - 1]?.semesters;
    }
    const sem = yearData?.find((s:any) => s.id === semId);
    if (sem) {
        bloomNodes(sx, sy, sem.modules, 85, setModNodes, 50);
    }
    zoomTo(sx, sy, 3.6);
    setHint('CLICK A MODULE');
  }

  function activateMod(modId: string, mx: number, my: number) {
    if (activeMod === modId) { goBack(); return; }
    setActiveMod(modId); setActiveRes(null); setResNodes([]);
    
    let yearData = null;
    if (activeTrack) {
        yearData = SPECIALTY_NODES.find(t => t.id === activeTrack)?.semesters;
    } else if (activeYear) {
        yearData = YEAR_NODES[activeYear - 1]?.semesters;
    }
    const sem = yearData?.find((s:any) => s.id === activeSem);
    const mod = sem?.modules.find((m:any) => m.id === modId);
    
    if (mod) {
        bloomNodes(mx, my, mod.types, 55, setResNodes, 40);
        zoomTo(mx, my, 4.8);
        setHint('EXPLORING · ' + mod.label.toUpperCase().substring(0,26));
    }
  }

  function activateRes(resId: string, url?: string) {
    setActiveRes(prev => prev===resId ? null : resId);
    if (url) {
      window.open(url, '_blank');
    }
  }

  function goBack() {
    if (activeMod) {
      setActiveMod(null); setActiveRes(null); setResNodes([]);
      const sn = semNodes.find(n=>n.id===activeSem);
      if (sn) zoomTo(sn.x, sn.y, 3.6);
      setHint('CLICK A MODULE');
    } else if (activeSem) {
      setActiveSem(null); setActiveMod(null); setResNodes([]); setModNodes([]);
      const pos = activeTrack
        ? getBranchYearPos(activeTrack, BRANCH_YEAR_FRACS[activeYear!-4])
        : { x:CX, y:TRUNK_YEAR_Y[activeYear!-1] };
      zoomTo(pos.x, pos.y, 2.6);
      setHint('CLICK A SEMESTER NODE');
    } else if (activeYear && activeTrack) {
      setActiveYear(null); setActiveSem(null); setModNodes([]); setResNodes([]); setSemNodes([]);
      setLitSegs(new Set());
      zoomTo(SPEC_X[activeTrack], 350, 1.3);
      setHint('CLICK Y4 OR Y5 ON THE BRANCH');
    } else if (activeYear && !activeTrack) {
      setActiveYear(null); setActiveSem(null); setModNodes([]); setResNodes([]); setSemNodes([]);
      setLitSegs(new Set());
      resetZoom(); setHint('CLICK A YEAR OR A SPECIALTY');
    } else if (revealedTrack) {
      setRevealedTrack(null); setActiveTrack(null); setLitSegs(new Set());
      resetZoom(); setHint('CLICK A YEAR OR A SPECIALTY');
    } else {
      setTreeOpened(false); setLitSegs(new Set());
      setSemNodes([]); setModNodes([]); setResNodes([]);
      resetZoom(); setHint('TOUCH THE TRUNK TO BEGIN');
    }
  }

  const transformStyle = \`translate(\${zoom.tx}px,\${zoom.ty}px) scale(\${zoom.scale})\`;
  const canGoBack = treeOpened;

  return (
    <div style={{width:'100%',height:'100vh',background:'var(--bg-main, #0B0F19)',overflow:'hidden'}}>
      <div ref={wrapRef} style={{width:'100%',height:'100%',position:'relative',overflow:'hidden',cursor:'grab'}}>
        <div style={{position:'absolute',top:0,left:0,transformOrigin:'0 0',
          transition:'transform 0.85s cubic-bezier(0.34,1.1,0.64,1)', transform: transformStyle}}>
          <svg ref={svgRef} viewBox={\`0 0 \${SVG_W} \${SVG_H}\`} width={SVG_W} height={SVG_H}
            style={{display:'block',fontFamily:"'JetBrains Mono',monospace",overflow:'visible'}}>
            <TreeSVG
              treeOpened={treeOpened}
              litSegs={litSegs}
              activeTrack={activeTrack}
              revealedTrack={revealedTrack}
              activeYear={activeYear}
              activeSem={activeSem}
              activeMod={activeMod}
              activeRes={activeRes}
              semNodes={semNodes}
              modNodes={modNodes}
              resNodes={resNodes}
              onTrunkClick={openTree}
              onTrackClick={revealTrack}
              onCommonYearClick={activateCommonYear}
              onYearClick={activateYear}
              onSemClick={activateSem}
              onModClick={activateMod}
              onResClick={activateRes}
            />
          </svg>
        </div>
        <div style={{
          position: 'fixed', bottom: '14px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '8px', letterSpacing: '0.2em', color: 'var(--text-muted, #1E3A4A)',
          textTransform: 'uppercase', pointerEvents: 'none', zIndex: 50, whiteSpace: 'nowrap'
        }}>{hint}</div>

        <div style={{position:'fixed',bottom:40,left:16,display:'flex',flexDirection:'column',gap:6,zIndex:200}}>
          {canGoBack && (
            <button onClick={goBack}
              style={{width:34,height:34,background:'rgba(11,15,25,0.92)',
                border:'1px solid rgba(45,212,191,0.25)',borderRadius:5,
                color:'#2DD4BF',fontSize:15,cursor:'pointer',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontFamily:'inherit',userSelect:'none',transition:'border-color 0.2s,background 0.2s'}}>
              ←
            </button>
          )}
          {[['＋',1.35],['－',1/1.35],['⊡',0]].map(([lbl,f]:any)=>(
            <button key={lbl} onClick={()=>f===0?resetZoom():zoomBy(f)}
              style={{width:34,height:34,background:'rgba(11,15,25,0.92)',
                border:'1px solid rgba(45,212,191,0.25)',borderRadius:5,
                color:'#2DD4BF',fontSize:lbl==='⊡'?13:18,cursor:'pointer',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontFamily:'inherit',userSelect:'none',transition:'border-color 0.2s,background 0.2s'}}>
              {lbl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const DIM = 0.04;

function TreeSVG({
  treeOpened, litSegs, activeTrack, revealedTrack, activeYear,
  activeSem, activeMod, activeRes,
  semNodes, modNodes, resNodes,
  onTrunkClick, onTrackClick, onCommonYearClick, onYearClick,
  onSemClick, onModClick, onResClick
}: any) {
  const YEAR_LABELS = ['1ST YEAR','2ND YEAR','3RD YEAR'];

  const segLit = (key: string) => litSegs.has(key);

  const yearNodeLit   = [segLit('Y1'), segLit('Y2'), segLit('Y3')];
  const trunkSegLit   = [segLit('Y1-Y2'), segLit('Y2-Y3')];
  const branchSegLit  = [segLit('BR-Y4'), segLit('BR-Y5')];
  const branchNodeLit = [segLit('Y4'), segLit('Y5')];

  const anyTrackContext = !!(activeTrack || revealedTrack);
  const anyYearContext  = !!activeYear;

  const yearInFocus = (i: number) => {
    if (!anyTrackContext && !anyYearContext) return true;
    if (activeYear === i+1 && !activeTrack) return true;
    if (anyTrackContext && yearNodeLit[i]) return true;
    return false;
  };
  const trackInFocus = (id: string) => {
    if (!anyTrackContext && !anyYearContext) return true;
    return revealedTrack===id || activeTrack===id;
  };

  return <>
    {treeOpened ? (
      <line x1={CX} y1={TRUNK_BOT} x2={CX} y2={TRUNK_TOP}
        stroke="#1E293B" strokeWidth="10" strokeLinecap="round"/>
    ) : (
      <line x1={CX} y1={TRUNK_BOT} x2={CX} y2={TRUNK_BOT-60}
        stroke="#1E293B" strokeWidth="10" strokeLinecap="round"
        style={{cursor: 'pointer'}} onClick={onTrunkClick}/>
    )}

    {!treeOpened && (
      <g style={{cursor: 'pointer'}} onClick={onTrunkClick}>
        <circle cx={CX} cy={TRUNK_BOT-60} r="11" fill="#0B0F19" stroke="#2DD4BF" strokeWidth="1.5">
          <animate attributeName="r" values="11;14;11" dur="1.8s" repeatCount="indefinite"/>
        </circle>
      </g>
    )}

    {treeOpened && <>
      {trunkSegLit[0] && (
        <line x1={CX} y1={TRUNK_YEAR_Y[0]} x2={CX} y2={TRUNK_YEAR_Y[1]}
          stroke="#2DD4BF" strokeWidth="3" strokeLinecap="round" opacity="0.5"
          style={{transition:'opacity 0.4s'}}/>
      )}
      {trunkSegLit[1] && (
        <line x1={CX} y1={TRUNK_YEAR_Y[1]} x2={CX} y2={TRUNK_YEAR_Y[2]}
          stroke="#2DD4BF" strokeWidth="3" strokeLinecap="round" opacity="0.5"
          style={{transition:'opacity 0.4s'}}/>
      )}

      {TRUNK_YEAR_Y.map((y,i)=>{
        const lit  = yearNodeLit[i];
        const isActiveCommonYear = activeYear===i+1 && !activeTrack;
        const focus = yearInFocus(i);
        return (
          <g key={i} style={{cursor: 'pointer', opacity:focus?1:DIM, transition:'opacity 0.4s'}}
            onClick={()=>onCommonYearClick(i+1)}>
            {(lit||isActiveCommonYear) && <circle cx={CX} cy={y} r="18" fill="#2DD4BF" opacity="0.08"/>}
            <circle cx={CX} cy={y} r="10"
              fill={(lit||isActiveCommonYear)?'#2DD4BF':'#1E293B'}
              stroke={(lit||isActiveCommonYear)?'rgba(45,212,191,0.4)':'#2DD4BF'}
              strokeWidth={(lit||isActiveCommonYear)?0:1}
              style={{transition:'fill 0.5s'}}/>
            <text x={CX+22} y={y} fontSize="8"
              fill={(lit||isActiveCommonYear)?'#2DD4BF':'#334155'}
              dominantBaseline="central" textAnchor="start"
              style={{transition:'fill 0.5s'}}>
              {YEAR_LABELS[i]} · CORE
            </text>
          </g>
        );
      })}

      {Object.keys(SPEC_X).map(id=>{
        const sx=SPEC_X[id], cpx=(CX+sx)/2;
        const isRevealed = revealedTrack===id || activeTrack===id;
        const focus = trackInFocus(id);
        if (!isRevealed && anyTrackContext) return null; 
        const isActive = activeTrack===id;
        return (
          <path key={id}
            d={\`M\${CX},\${BRANCH_SPLIT_Y} Q\${cpx},\${BRANCH_CP_Y} \${sx},130\`}
            stroke={isActive ? '#2DD4BF' : '#1E293B'}
            strokeWidth={isRevealed ? 4 : 3}
            fill="none"
            opacity={focus ? 1 : DIM}
            style={{transition:'stroke 0.4s, stroke-width 0.3s, opacity 0.4s'}}
          />
        );
      })}

      {activeTrack && (() => {
        const sx=SPEC_X[activeTrack], cpx=(CX+sx)/2;
        const segs = [
          { lit: branchSegLit[0],
            d: \`M\${CX},\${BRANCH_SPLIT_Y} Q\${cpx},\${BRANCH_CP_Y} \${getBranchYearPos(activeTrack,BRANCH_YEAR_FRACS[0]).x},\${getBranchYearPos(activeTrack,BRANCH_YEAR_FRACS[0]).y}\` },
          { lit: branchSegLit[1],
            d: (() => {
              const p4 = getBranchYearPos(activeTrack, BRANCH_YEAR_FRACS[0]);
              const p5 = getBranchYearPos(activeTrack, BRANCH_YEAR_FRACS[1]);
              const pm = getBranchYearPos(activeTrack, (BRANCH_YEAR_FRACS[0]+BRANCH_YEAR_FRACS[1])/2);
              return \`M\${p4.x},\${p4.y} Q\${pm.x},\${pm.y} \${p5.x},\${p5.y}\`;
            })()
          }
        ];
        return segs.map((seg,i)=>seg.lit && (
          <path key={i} d={seg.d}
            stroke="#2DD4BF" strokeWidth="3" fill="none"
            opacity="0.5" strokeLinecap="round"
            style={{transition:'opacity 0.4s'}}/>
        ));
      })()}

      {Object.keys(SPEC_X).map(id=>{
        const sx=SPEC_X[id];
        const isRevealed = revealedTrack===id || activeTrack===id;
        const focus = trackInFocus(id);
        if (!isRevealed && anyTrackContext) return null;
        const isActive = activeTrack===id;
        const trackObj = SPECIALTY_NODES.find((s:any) => s.id === id);
        return (
          <g key={id} style={{cursor: 'pointer', opacity:focus?1:DIM, transition:'opacity 0.4s'}} onClick={()=>onTrackClick(id)}>
            <circle cx={sx} cy={130} r="9"
              fill={isActive?'#2DD4BF':'#0B0F19'}
              stroke={isActive?'#fff':'#2DD4BF'}
              strokeWidth={isActive?2:1.5}
              style={{transition:'fill 0.35s'}}/>
            <text x={sx} y={110} fontSize="7.5" fill={isActive?'#2DD4BF':'#475569'} textAnchor="middle">{id.toUpperCase()}</text>
            <text x={sx} y={148} fontSize="6.5" fill="#1a2a40" textAnchor="middle">
              {trackObj?.label?.substring(0,18)||id}
            </text>
          </g>
        );
      })}

      {(revealedTrack||activeTrack) && [4,5].map((year,i)=>{
        const tid  = activeTrack || revealedTrack;
        const pos  = getBranchYearPos(tid, BRANCH_YEAR_FRACS[i]);
        const isActiveYear = activeYear===year;
        const lit  = branchNodeLit[i];
        const focus = !activeSem || isActiveYear;
        return (
          <g key={year} style={{cursor: 'pointer', opacity:focus?1:DIM, transition:'opacity 0.4s'}}
            onClick={()=>onYearClick(tid, year)}>
            {(lit||isActiveYear) && <circle cx={pos.x} cy={pos.y} r="18" fill="#2DD4BF" opacity="0.08"/>}
            <circle cx={pos.x} cy={pos.y} r="10"
              fill={isActiveYear?'#2DD4BF':lit?'#0d3d36':'#0B0F19'}
              stroke={isActiveYear?'#fff':'#2DD4BF'}
              strokeWidth={isActiveYear?2:1.5}
              style={{transition:'fill 0.4s'}}/>
            <text x={pos.x} y={pos.y+20} fontSize="8"
              fill={isActiveYear?'#2DD4BF':lit?'#2DD4BF':'#334155'}
              textAnchor="middle" style={{transition:'fill 0.4s'}}>
              Y{year}
            </text>
          </g>
        );
      })}

      {semNodes.map((n:any)=>{
        const isActive = activeSem===n.id;
        const yearPos = (activeTrack && activeYear)
          ? getBranchYearPos(activeTrack, BRANCH_YEAR_FRACS[activeYear-4])
          : (activeYear ? {x:CX, y:TRUNK_YEAR_Y[activeYear-1]} : {x:CX,y:CX});
        const focus = !activeMod && (!activeSem||isActive) ? true : isActive;
        const isLeft = n.x < yearPos.x + 1;
        return (
          <g key={n.id} style={{cursor: 'pointer', opacity:n.visible?(focus?1:DIM):0, transition:'opacity 0.3s'}}
            onClick={()=>onSemClick(n.id, n.x, n.y)}>
            <line x1={yearPos.x} y1={yearPos.y} x2={n.x} y2={n.y} stroke="#0f3a30" strokeWidth="1.5" pointerEvents="none"/>
            <circle cx={n.x} cy={n.y} r="9"
              fill={isActive?'#2DD4BF':'#0B0F19'} stroke="#2DD4BF" strokeWidth="1.5"
              style={{transition:'fill 0.3s'}}/>
            <text x={isLeft?n.x-15:n.x+15} y={n.y} fontSize="8"
              fill={isActive?'#2DD4BF':'#475569'}
              textAnchor={isLeft?'end':'start'} dominantBaseline="central">
              {n.label}
            </text>
          </g>
        );
      })}

      {modNodes.map((n:any)=>{
        const isActive = activeMod===n.id;
        const short = n.label.length>14 ? n.label.substring(0,12)+'…' : n.label;
        const above = n.y < n.cy;
        const focus = !activeMod || isActive;
        return (
          <g key={n.id} style={{cursor: 'pointer', opacity:n.visible?(focus?1:DIM):0, transition:'opacity 0.35s'}}
            onClick={()=>onModClick(n.id, n.x, n.y)}>
            <line x1={n.cx} y1={n.cy} x2={n.x} y2={n.y} stroke="#0f3530" strokeWidth="1" pointerEvents="none"/>
            <circle cx={n.x} cy={n.y} r="7"
              fill={isActive?'#16a392':'#0B0F19'} stroke="#16a392" strokeWidth="1.5"
              style={{transition:'fill 0.3s'}}/>
            <text x={n.x} y={n.y+(above?-14:16)} fontSize="7"
              fill={isActive?'#2DD4BF':'#334155'} textAnchor="middle"
              style={{transition:'fill 0.3s'}}>{short}</text>
          </g>
        );
      })}

      {resNodes.map((n:any)=>{
        const isActive = activeRes===n.id;
        const above = n.y < n.cy;
        const hasUrl = !!n.url;
        return (
          <g key={n.id} style={{cursor: hasUrl ? 'pointer' : 'not-allowed', opacity:n.visible?(hasUrl ? 1 : 0.4):0, transition:'opacity 0.3s'}}
            onClick={()=> { if(hasUrl) onResClick(n.id, n.url); }}>
            <line x1={n.cx} y1={n.cy} x2={n.x} y2={n.y} stroke="#0a2520" strokeWidth="1" pointerEvents="none"/>
            <circle cx={n.x} cy={n.y} r="5"
              fill={isActive?'#0f766e':'#060e0c'} stroke="#0f766e" strokeWidth="1"
              style={{transition:'fill 0.3s'}}/>
            <text x={n.x} y={n.y+(above?-11:13)} fontSize="6.5"
              fill={isActive?'#2DD4BF':'#0f766e'} textAnchor="middle">{n.label}</text>
          </g>
        );
      })}
    </>}

    <text x="24" y="22" fontSize="8" fill="#2DD4BF" letterSpacing="2">
      NHSM · TREE OF KNOWLEDGE
    </text>
  </>;
}
\`;

fs.writeFileSync('src/app/resources/page.tsx', pageContent);
console.log("Successfully rebuilt the SVG interactive tree from tree_animation.html and injected NHSMers repository data!");
