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
  "Analysis 1": {
    "exams": "https://drive.google.com/drive/folders/14LK9xCkMeKzq8uGNGc2llMaplDX35oUX?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1e8yd2kruxW4RHgv5rrWkfSNbVHfnoilr?usp=drive_link",
    "lectures": "https://drive.google.com/drive/folders/1uCT4SWp5xJUWe9geMKoverFgwmqve_pw?usp=drive_link"
  },
  "Algebra 1": {
    "lectures": "https://drive.google.com/drive/folders/1w-oKTToIQkcWyzeQJOBZuX8TBdQHKSth?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1uZ6tUu6Qjg5ewgWr0G18ARctRb-X9Ide?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/13fcKCqZfMcCVZQnHWhwzOiA5pI5Ug099?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/17Iz7y5rXlZZU4H_kzrMI1f13LL5RRn_V?usp=drive_link"
  },
  "Descriptive Statistics & Intro to Probability": {
    "lectures": "https://drive.google.com/drive/folders/1aiw5gqVxpsHGBQ7AFyroNWaoUcOmXCyr?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1ut2zPLb9d6k4SEI27WhNi-o6zxdVYXYs?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1J2zO5ZNbCBWck22YwUK2VAI_SzojBzlr?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1uFj5WUBshehRIRmC_Pe3hX9sm1JYu3QK?usp=drive_link"
  },
  "Discrete Mathematics 1": {
    "lectures": "https://drive.google.com/drive/folders/1a-bjMG1Q12hZeAKAuTwKKL3kTUQ3sH-P?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1unsWyb2bmK5mWBFkmtfUP4Xq6Su2KvCS?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/151yOKpHbNSHAvL2PH2kVVdJItYuutdyW?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1D8q_eXYPI0yF5TEvUIKMIErLX8ybSrTc?usp=drive_link"
  },
  "Algorithms & Data Structures 1": {
    "lectures": "https://drive.google.com/drive/folders/1wPrxJIugHoSPQyhT1mkA9qwFJ1A1Bi1A?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1vGcdSDWLHekc7hC1G7NASxEvUvBDNWsK?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1a2-Agc2gdLHWP3-Bw6NwpLEZpSgLvsbz?usp=drive_link"
  },
  "Physics 1": {
    "lectures": "https://drive.google.com/drive/folders/1Ep9dstabvB-aTqaNwqiJjQzf0b9nFTAQ?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1vdU07GpPbl8D9tWrPZf8fVaapqHKRJa4?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/14jbPNKYQ62SHBajACy-m4DxVlqUoy7ei?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1vi1rpkFDmZyhsFAsS1rno6VMPVJ7x6FR?usp=drive_link"
  },
  "English 1": {
    "lectures": "https://drive.google.com/drive/folders/1N-EGCV6_nxWgChSwFNWHbPTcP5bj0Rio?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1tYW2Bwj7_KXVJhKVdjFBsh7UOc5HeS4_?usp=drive_link"
  },
  "History of Mathematics": {
    "lectures": "https://drive.google.com/drive/folders/1ApmfCFsDKunfidx3s-eskNLlU2ccjD6j?usp=drive_link"
  },
  "Analysis 2": {
    "lectures": "https://drive.google.com/drive/folders/1PRBtv45Zr0_kQkPnwwjqtaTtWC5K5lZX?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1PTL9hdKxDUBveRcH_hf1T-gBLUiCB-Qf?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1Axs6R-hxVi2E3cNGSJ7Dv0BKu6k8L3E5?usp=drive_link"
  },
  "Algebra 2": {
    "lectures": "https://drive.google.com/drive/folders/1PKMQHrUNEFtINnEpqjle14JMON_tnAHI?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1PN9qGaGc4u6nZpU_BDPr-ExaDxj0OSj8?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/19awwYv0ZS6JwTPFhAGOeg0vXocgm3U9f?usp=drive_link"
  },
  "Discrete Mathematics 2": {
    "lectures": "https://drive.google.com/drive/folders/1QXxkeVgmcav3X2yqt4wlcq9b3ipGmK1T?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1Pe8pWGbPKVowKPu24bwSmNsJKSMDDyE1?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1PcgjAmXMQ7wFYUAeYJNCzdX_X-IOrdqT?usp=drive_link"
  },
  "Probability 1": {
    "lectures": "https://drive.google.com/drive/folders/1Plp5iM8njmhYU27Kf4V5b7P-O8xj47qC?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1Pw8FV4IlZUDX-o4hEKUpu2GjO8nZFsQU?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1EVDOy73Ol_qhfMdACpVEn5B7hyL5MLgP?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1KBl6oGxy-avG4ZKuoOImkkDxwcxSzXwZ?usp=drive_link"
  },
  "Physics 2": {
    "lectures": "https://drive.google.com/drive/folders/1Ph68sCfQbrjSreIS9ZgSxdYrVW6OwGJl?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1PlNZ87bmmiuQniIGtWS2sOzsO9phAvDT?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1DJaONLowPWgXcnWtQhDSgYrF_W7aTJ6U?usp=drive_link"
  },
  "Algorithms & Data Structures 2": {
    "lectures": "https://drive.google.com/drive/folders/1PVebudbi3qQZ2LqfsAo-RWCpNdc6IdKT?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1BZVFhQt6Nh_U8F5n0lthmHlUvsYONzRz?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1C3xo712_q5i8xJYzZEU6j98iq-0yu_iM?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1BYFcKKWoKuUczf7P_tEhpDGLSefytahN?usp=drive_link"
  },
  "English 2": {
    "lectures": "https://drive.google.com/drive/folders/1PEOZSzlQF_XBagSaJPZ-KNSn0QM-_y_C?usp=drive_link"
  },
  "Mathematical Logic": {
    "lectures": "https://drive.google.com/drive/folders/1CYPRY78cE-4rzSY97FdrSaQaAVrJyb44?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1CRjeNZhn3tZyCJmfTZyw7gNVEL4ei_wI?usp=drive_link"
  },
  "Analysis 3": {
    "lectures": "https://drive.google.com/drive/folders/1XBCy0mDP_vnFqijZJozSvoFgVmJU6sMh?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1X4dNe5l32xZblUiwTZSuVz9LiDks-C2B?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1vXgZOiSl58gr-MhQWwuWZUc__sqM3Fo3?usp=drive_link"
  },
  "Algebra 3": {
    "lectures": "https://drive.google.com/drive/folders/168qTn2Ar58PutkQv_3Z-qO1uy6d-PyOl?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1VruApy2Sq4tirK4gbP05xCkkgks36_j6?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1AbdjtQiVgiDFi1lpEx0yTPwJBnBns6uv?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1El9E4N7U5k6AGArur-JKJyz-MU0_ALPT?usp=drive_link"
  },
  "Topological & Metric Spaces": {
    "lectures": "https://drive.google.com/drive/folders/1hcZ8URO5P8DyYN4-Y6VssuQUC07c1H6K?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1S8DExB0Um7MqvUtOAx3dBGHV_9IU85o6?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1LR-uKUDRiLl_TY1GSSIGYlOF7Ef6T3h6?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1Y-enNkfDwjoEcVikG2jg-6IXjeCO2k-7?usp=drive_link"
  },
  "Geometry 1": {
    "lectures": "https://drive.google.com/drive/folders/1SnSDcYglYxau35myMozAwb-B33ozudj6?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1UzRIJqa887t4XwMpziuaMP03fb6iJvzm?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1UwI6gymLTSuYJD-e5Y6pihXeoBvH39Rf?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1PFuIRFahdE23weBmY2s7rkQOwwrBJuqr?usp=drive_link"
  },
  "Probability 2": {
    "lectures": "https://drive.google.com/drive/folders/12wkkWNp08PtJHcEwzQQTcntsIlHMm_g4?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1wCErjQ0ysLUE3SamcL3sUqlkE3Ruzt4u?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1Igefcrwkk4Sf2_bT05uJoUiOIiWoo6nA?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1sL9HCZOqAkfgCl0NGY0seeB-gxoCvo1o?usp=drive_link"
  },
  "Numerical Analysis 1": {
    "lectures": "https://drive.google.com/drive/folders/1GD_UUMucSZ61UCJo07MoJ89Tq3CXaFBA?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1_MjlObTI0tA4Zf4BBHW2A8HJzkQ-i1QE?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/15_OSknC_JddNz9i-UUVk_Zu3ZCQhL0Jd?usp=drive_link"
  },
  "English 3": {
    "lectures": "https://drive.google.com/drive/folders/1Zn5G3YE5k6tarFW03nGn3hmYjPxsGAR7?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1P_VHpq_yRLL16Y4ar4crA_SC-70bCUyM?usp=drive_link"
  },
  "Analysis 4": {
    "lectures": "https://drive.google.com/drive/folders/17G55A5muXBXwzzfcnLBc-DibbYMF8zZ_?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1GX6WV-3wbv4U0qFsRIip-GvZaTCqm7-M?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1skVl8StJOt7SEhWhEKAxFexpA3EJHfeW?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1pmXlqgn4HUk97z6HnXU241lscgx1mO_3?usp=drive_link"
  },
  "Normed & Topological Vector Spaces": {
    "lectures": "https://drive.google.com/drive/folders/19l5ucKpoCvJmouX4Md_EiT6zFr_p9rnE?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1T6mKdA1JR84Xo3ksi7Ri5HDn2DxVdRLN?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/12vGiW274gqZYeLYYmu617np9iMdgleft?usp=drive_link"
  },
  "Measure & Integration": {
    "lectures": "https://drive.google.com/drive/folders/14-rP1LDW3KHmXHeUA3RSZ03r5gPfmAiD?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1WTozA4Jzz20dFqqK8-WvJMVQC1ISON5s?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1DCWMSsK3gZgiNa84GdoURcI8XDa5amx7?usp=drive_link"
  },
  "Geometry 2": {
    "lectures": "https://drive.google.com/drive/folders/1OJV07Xvy1Ad3FgcjmZDVQYKeulRDWRO1?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/10po7STG2_v2NzwOlXrRZmURxC7VHMte8?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/14Ln0vJMlYccRWmiXAZ0gd3Ueqsa0r_kt?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1U-Mj99LLHque3kw2SlucTZvTB4i3nG4j?usp=drive_link"
  },
  "Numerical Analysis 2": {
    "lectures": "https://drive.google.com/drive/folders/16GqnF3BaemNps-viP4mB8m_qwPlmUg-w?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1hbM6pNy2aCfI1z0YfluxaTtR4jU3stAv?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1HmYL_56ChF9FyUQ8fhs9ffugiZ70uHBC?usp=drive_link"
  },
  "Computer Tools for Mathematics": {
    "lectures": "https://drive.google.com/drive/folders/11zcZ87t62pSuNBQkwOYqaeTdfWpRBv2k?usp=drive_link",
    "tp": "https://drive.google.com/drive/folders/1Qm31Oa3APwo_wlvyaLkObErZS-fd5_62?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1Boi9nF1rhGtwGVnQCMIW-g-OCAJAvtD8?usp=drive_link",
    "projects": "https://drive.google.com/drive/folders/14bJ38OM3oB6BJFhXObq434sfXl8pg_9D?usp=drive_link"
  },
  "English 4": {
    "lectures": "https://drive.google.com/drive/folders/1ajR0XL7iewPaW13hDaHGEogkcMwoDF2b?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1aynlvHRZFZQsoyOV1L_2yb5_1VKdfH_J?usp=drive_link"
  },
  "Geopolitics & Strategy": {
    "lectures": "https://drive.google.com/drive/folders/1rdIVTBCPEWbEWmnaB1gQgfo0b0oKSyYL?usp=drive_link"
  },
  "Ordinary Differential Equations": {
    "lectures": "https://drive.google.com/drive/folders/1X4RPty3AP0fDZKDcCOvrNSovt5f2vIa4?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1T0QkSb4yWR79nrGpdPfcBWpEELvS2Dt3?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1fBkyaGQwKRh6hzPLGcwVOQ_b6luibrLR?usp=drive_link"
  },
  "Partial Differential Equations": {
    "lectures": "https://drive.google.com/drive/folders/1HB2KulvX8CzlfU1-yJlXwA9m050dkSa4?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1fgi28AfZuSrvVZBmmRp8igFUAbePZqAy?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/12Paq8JGOlz4oBegyWaGelq38F-Lb1rTD?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/18oQA9-udQ1szBlh6pWt65b5to3yL9dIk?usp=drive_link"
  },
  "Functional Analysis": {
    "lectures": "https://drive.google.com/drive/folders/1NO30Pc8N0NUyo0pr-ugqmpQGkwoqFfE0?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1NDus_F8-k3f_8ypbqFg2p6US_Mo4fqge?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1aX9yXL1sOIdxuSoY93cKC9IP_JowXl9V?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1NQ1HUubeWXT5Da-418I-ECYYOTKFbkce?usp=drive_link"
  },
  "Complex Analysis": {
    "lectures": "https://drive.google.com/drive/folders/1MTBHw5xQFOPNYu7FMqoN6ZlgKvEoA5nP?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1i9kpDOVmR1aAK2xjktt9fOPvf0LWJo8C?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1-pfaaP0YRUcB4p27LjfhLny3olXxeyVU?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1Bm99MH8XxR0uPvOijTmzOvB7tNf04elR?usp=drive_link"
  },
  "Inferential Statistics": {
    "lectures": "https://drive.google.com/drive/folders/1-mNSPeYiVVx_8gUDilwmAnAARyJVpCWQ?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1u4qL8LPSYtQS7Iz7LfnFTCyjPAYw3opC?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1pjKrMxG3G6SNe1wj8Qk9bBpygGN0-0YS?usp=drive_link",
    "tp": "https://drive.google.com/drive/folders/1g0ihY-lt0ja_GqMdcEwpj3Z3SA57B8n4?usp=drive_link"
  },
  "Stochastic Processes": {
    "lectures": "https://drive.google.com/drive/folders/12urq27-zebs1itqomniJjI5XlFSQhEdb?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/11dMHmZXhUWrbz2nJ02WUUIGEaKRDdndh?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1m8VwdkuETK04H3RVu9eQRXyBeNpjgw77?usp=drive_link"
  },
  "Algebra & Coding": {
    "lectures": "https://drive.google.com/drive/folders/1Zfljv4t96Rqa19aM5T9S1iHG2_-lqbEv?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/190iSubLfZ_6-V5o0EzHitlQA4TnjC-eB?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/16s2lzp5zxviYaaCs_cmBknPdpWuhx-Kl?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1cunzt2-ri6_5VBT2CJvUK75UkORJuWEI?usp=drive_link"
  },
  "Object-Oriented Programming": {
    "lectures": "https://drive.google.com/drive/folders/1hUMPkoUoMrJkMj4i9CGoAs4AF0GkcEML?usp=drive_link",
    "tp": "https://drive.google.com/drive/folders/1aaKTl22igp84dl7F4_rC2Wnc-gN5CbtP?usp=drive_link"
  },
  "Numerical Analysis of Differential Equations": {
    "lectures": "https://drive.google.com/drive/folders/1fFq0RC34ySfHZN58GQVejeDULvrqKTy_?usp=drive_link",
    "tp": "https://drive.google.com/drive/folders/1nxGULCxCLcFKBGRb0yXPHgMgTOURP-rs?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1q27NvFrPSoAuMLKLVUIurFU1KihcPio4?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1JCKBiqFqtDFQYEaZAPdWOvjEgBNHasfJ?usp=drive_link"
  },
  "Differential Geometry": {
    "lectures": "https://drive.google.com/drive/folders/1yQ8GZ1swj1Kmqn3XGI96vjYQfsvJ9rvQ?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1xXD4y8WHH0xyrUo3-Hz3YrpYQit3bThH?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1exgscuX-v5fkNY_O3RKKar_e-rptxEFO?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1Ve5D5WA-kE6fOGJyOZphWT2-7ZTHNh-n?usp=drive_link"
  },
  "Field Extensions & Galois Theory": {
    "lectures": "https://drive.google.com/drive/folders/1uectllK_Ilr759f3BIpqI1OI7NVcyJLb?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1XDeKyULGrHAdQD0CRtWriFkxR-HMi60X?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1uejhZKzd1fLDHeRJuAA1DqE-EUhfn-l4?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1Ia2jAcWT9odPjC-kPBdt2M87iAVoqtc6?usp=drive_link"
  },
  "Transforms & Integration": {
    "lectures": "https://drive.google.com/drive/folders/1CZXIl5WAUH-fh5n0YjtqhYGK3HR13eK1?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1R1hD7yfXmo9u8r8ehvviGHzqxVQrlec4?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1hV6eHIHr2wTeFOGr7tkNPzMDrb8br2W5?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1wYxGSrHfJqx2m2yu5HRm9jeFK0SP-VM2?usp=drive_link"
  },
  "Regression Models": {
    "lectures": "https://drive.google.com/drive/folders/1LGmM-njfQUvWHQBeLnmXAL2AsQwGOriL?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1oXMCspc_psnfpMqdbOPklw2NkpsFQpL9?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1qdHaCYNa1aiCGF8XqKFG-q-0j2M6VZwk?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/132zTrdW3R8JAthyXrBEfO_gEdk6eoOvD?usp=drive_link"
  },
  "Continuous Optimization": {
    "lectures": "https://drive.google.com/drive/folders/17KSN3zS8ENll6vZd1DEf4ryGQ7Iib9Zq?usp=drive_link",
    "td": "https://drive.google.com/drive/folders/1hhbRa_jm1_fftdulHv6gutPxeyaTjcbB?usp=drive_link",
    "tp": "https://drive.google.com/drive/folders/1VYMuVnTb_w7lAJ-M-mBn5nJuA_X0wM67?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/1Sqe8F1nWLzHToYgs2a4ZW7PDOBokL2hi?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1Xz0oyMWNEYPQWxxpd6XPR-fmqhnPQXvs?usp=drive_link"
  },
  "Data Mining": {
    "lectures": "https://drive.google.com/drive/folders/1XdXAlHqxYQMAmIRGREaqrAwpSjOzJe6a?usp=drive_link",
    "tp": "https://drive.google.com/drive/folders/1IylsxKqvpztZFAJsWD5u8EJkVs8hzjPL?usp=drive_link",
    "exams": "https://drive.google.com/drive/folders/10dG6xpyjYBoF8-5mnPzNJCkMIZKln-MG?usp=drive_link",
    "projects": "https://drive.google.com/drive/folders/1Xx53UNGZ8phJIHE_xcWXGySKy6G-qRth?usp=drive_link",
    "resources": "https://drive.google.com/drive/folders/1duGuvI5o24MeN4QtNP7k6DjS7CQy8MhJ?usp=drive_link"
  },
  "AI": {
    "lectures": "https://drive.google.com/drive/folders/1NIXdnuj-ajfyHJr7hWsmsyodwUkEKGJb?usp=drive_link",
    "tp": "https://drive.google.com/drive/folders/1eavm3Iqsq8B54R0QHQPwSpUU_CFfSRm_?usp=drive_link",
    "projects": "https://drive.google.com/drive/folders/12GqRDM1OXdc79VJL_4SA605H4GwcSMLX?usp=drive_link"
  }
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
  { id: 'ms', label: 'Modeling & Simulation', abbr: 'MS', color: '#00d4ff', semesters: [
      { id: 'ms-s7', label: 'Semester 1', modules: [
          makeModule('ms-s7-1', 'Control of Differential Eq'),
          makeModule('ms-s7-2', 'Digital Image Processing'),
          makeModule('ms-s7-3', 'Matrix Numerical Analysis'),
          makeModule('ms-s7-4', 'Distributions and Application'),
          makeModule('ms-s7-5', 'Stochastic Simulations'),
          makeModule('ms-s7-6', 'Modeling Workshop')
      ]},
      { id: 'ms-s8', label: 'Semester 2', modules: [
          makeModule('ms-s8-1', 'Non-Variational Methods'),
          makeModule('ms-s8-2', 'Stochastic Differential Eq.'),
          makeModule('ms-s8-3', 'Intro. Biological Modeling'),
          makeModule('ms-s8-4', 'Fluid Mechanics'),
          makeModule('ms-s8-5', 'Computer Vision'),
          makeModule('ms-s8-6', 'Fractional Differential Eq.'),
          makeModule('ms-s8-7', 'Convex Optimization')
      ]},
      { id: 'ms-s9', label: 'Semester 3', modules: [
          makeModule('ms-s9-1', 'Image Processing'),
          makeModule('ms-s9-2', 'Numerical Fluid Mechanics'),
          makeModule('ms-s9-3', 'Epidemiological Modeling'),
          makeModule('ms-s9-4', 'Bayesian Inference'),
          makeModule('ms-s9-5', 'Modeling Workshop 2')
      ]},
  ]},
  { id: 'sea', label: 'Statistics & Econometrics', abbr: 'SEA', color: '#a855f7', semesters: [
      { id: 'sea-s7', label: 'Semester 1', modules: [
          makeModule('sea-s7-1', 'Stochastic Processes'),
          makeModule('sea-s7-2', 'Time Series 1'),
          makeModule('sea-s7-3', 'Data Mining 2'),
          makeModule('sea-s7-4', 'Advanced Optimization & Graph Theory'),
          makeModule('sea-s7-5', 'Information Systems & Databases'),
          makeModule('sea-s7-6', 'Stochastic Simulation'),
          makeModule('sea-s7-7', 'Introduction to Finance')
      ]},
      { id: 'sea-s8', label: 'Semester 2', modules: [
          makeModule('sea-s8-1', 'Non-parametric Estimation'),
          makeModule('sea-s8-2', 'Time Series 2'),
          makeModule('sea-s8-3', 'Stochastic Differential Calculus'),
          makeModule('sea-s8-4', 'Extreme Value Statistics'),
          makeModule('sea-s8-5', 'Actuarial Science 1'),
          makeModule('sea-s8-6', 'Optimization in Economics & Finance'),
          makeModule('sea-s8-7', 'Insurance Law'),
          makeModule('sea-s8-8', 'Entrepreneurship')
      ]},
      { id: 'sea-s9', label: 'Semester 3', modules: [
          makeModule('sea-s9-1', 'Actuarial Science 2'),
          makeModule('sea-s9-2', 'Diffusion Models in Finance'),
          makeModule('sea-s9-3', 'Machine Learning'),
          makeModule('sea-s9-4', 'Introduction to Islamic Finance'),
          makeModule('sea-s9-5', 'Bayesian Inference'),
          makeModule('sea-s9-6', 'Modeling Workshop'),
          makeModule('sea-s9-7', 'Academic Communication')
      ]},
  ]},
  { id: 'ccs', label: 'Cryptology & Security', abbr: 'CCS', color: '#10b981', semesters: [
      { id: 'ccs-s7', label: 'Semester 1', modules: [
          makeModule('ccs-s7-1', 'Math Tools for Cryptography'),
          makeModule('ccs-s7-2', 'Cryptography'),
          makeModule('ccs-s7-3', 'Operating Systems'),
          makeModule('ccs-s7-4', 'Complexity Theory'),
          makeModule('ccs-s7-5', 'Formal Calculus'),
          makeModule('ccs-s7-6', 'Combinatorial Optimization'),
          makeModule('ccs-s7-7', 'Chipsets Programming')
      ]},
      { id: 'ccs-s8', label: 'Semester 2', modules: [
          makeModule('ccs-s8-1', 'Info Theory & Error-Correcting Codes'),
          makeModule('ccs-s8-2', 'Networks and Protocols'),
          makeModule('ccs-s8-3', 'Signal Processing'),
          makeModule('ccs-s8-4', 'Number Theory and Cryptography'),
          makeModule('ccs-s8-5', 'Arithmetic Algorithms'),
          makeModule('ccs-s8-6', 'Advanced Graph Theory'),
          makeModule('ccs-s8-7', 'Random Number Generators'),
          makeModule('ccs-s8-8', 'Entrepreneurship')
      ]},
      { id: 'ccs-s9', label: 'Semester 3', modules: [
          makeModule('ccs-s9-1', 'Cryptanalysis'),
          makeModule('ccs-s9-2', 'Advanced Cryptography'),
          makeModule('ccs-s9-3', 'System Security'),
          makeModule('ccs-s9-4', 'Network Security'),
          makeModule('ccs-s9-5', 'Dynamical Systems and Chaos'),
          makeModule('ccs-s9-6', 'Elliptic Curves'),
          makeModule('ccs-s9-7', 'Audio, Images, and Security')
      ]},
  ]},
  { id: 'mp', label: 'Mathematical Physics', abbr: 'MP', color: '#f59e0b', semesters: [
      { id: 'mp-s7', label: 'Semester 1', modules: [] },
      { id: 'mp-s8', label: 'Semester 2', modules: [] },
      { id: 'mp-s9', label: 'Semester 3', modules: [] },
  ]},
  { id: 'imm', label: 'International Masters in Mathematics', abbr: 'IMM', color: '#ef4444', semesters: [
      { id: 'imm-s7', label: 'Semester 1', modules: [] },
      { id: 'imm-s8', label: 'Semester 2', modules: [] },
      { id: 'imm-s9', label: 'Semester 3', modules: [] },
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

  const [treeOpened,    setTreeOpened]    = useState(true);
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
  const [hint, setHint] = useState('CLICK A YEAR OR A SPECIALTY');

  function getMinScale() {
    const el = wrapRef.current;
    const W = el?.clientWidth  || window.innerWidth;
    const H = el?.clientHeight || window.innerHeight;
    const treeW = 800;
    const treeH = 560;
    const PADDING = 40;
    return Math.min((W - PADDING*2) / treeW, (H - PADDING*2) / treeH);
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
      inner.style.transform = `translate(${z.tx}px,${z.ty}px) scale(${z.scale})`;
    }
    setZoom(z);
  }
  function zoomTo(x: number, y: number, r: number) {
    const W = wrapRef.current?.clientWidth  || window.innerWidth;
    const H = wrapRef.current?.clientHeight || window.innerHeight;
    const available = Math.min(W, H) / 2;
    const s = clampScale(available / r);
    applyZoom({ scale: s, tx: W/2 - x*s, ty: H/2 - y*s }, true);
  }
  function resetZoom() {
    const W = wrapRef.current?.clientWidth  || window.innerWidth;
    const H = wrapRef.current?.clientHeight || window.innerHeight;
    const s = getMinScale();
    const treeCX = 450;
    const treeCY = 340;
    applyZoom({ scale: s, tx: W/2 - treeCX*s, ty: H/2 - treeCY*s }, true);
  }
  useEffect(() => { resetZoom(); }, []);

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
    
    if (revealedTrack === trackId || activeTrack === trackId) {
      setRevealedTrack(null);
      setActiveTrack(null);
      setActiveYear(null);
      setActiveSem(null);
      setActiveMod(null);
      setActiveRes(null);
      setLitSegs(new Set());
      setSemNodes([]); setModNodes([]); setResNodes([]);
      resetZoom();
      setHint('CLICK A YEAR OR A SPECIALTY');
      return;
    }

    if (activeTrack && activeTrack !== trackId) {
      setActiveTrack(null); setLitSegs(new Set()); setActiveYear(null);
      setActiveSem(null); setActiveMod(null); setActiveRes(null);
      setSemNodes([]); setModNodes([]); setResNodes([]);
    }
    setRevealedTrack(trackId);
    zoomTo(SPEC_X[trackId], 350, 180);
    setHint('CLICK Y4 OR Y5 ON THE BRANCH');
  }

  function activateYear(trackId: string, year: number) {
    if (!treeOpened) openTree();
    if (activeYear === year && activeTrack === trackId) { stepBack(); return; }

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
          zoomTo(pos.x, pos.y, 155);
          setHint('CLICK A SEMESTER NODE');
        }
      );
    }
    zoomTo(SPEC_X[trackId], 350, 250);
  }

  function activateCommonYear(year: number) {
    if (!treeOpened) openTree();
    if (activeYear === year && !activeTrack) { stepBack(); return; }
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
          zoomTo(pos.x, pos.y, 155);
          setHint('CLICK A SEMESTER NODE');
        }
      );
    }
    zoomTo(CX, 500, 250);
  }

  function activateSem(semId: string, sx: number, sy: number) {
    if (activeSem === semId) { stepBack(); return; }
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
    zoomTo(sx, sy, 175);
    setHint('CLICK A MODULE');
  }

  function activateMod(modId: string, mx: number, my: number) {
    if (activeMod === modId) { stepBack(); return; }
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
        zoomTo(mx, my, 125);
        setHint('EXPLORING · ' + mod.label.toUpperCase().substring(0,26));
    }
  }

  function activateRes(resId: string, url?: string) {
    setActiveRes(prev => prev===resId ? null : resId);
    if (url) {
      window.open(url, '_blank');
    }
  }

  function stepBack() {
    if (activeMod) {
      setActiveMod(null); setActiveRes(null); setResNodes([]);
      const sn = semNodes.find(n=>n.id===activeSem);
      if (sn) zoomTo(sn.x, sn.y, 175);
      setHint('CLICK A MODULE');
    } else if (activeSem) {
      setActiveSem(null); setActiveMod(null); setResNodes([]); setModNodes([]);
      const pos = activeTrack
        ? getBranchYearPos(activeTrack, BRANCH_YEAR_FRACS[activeYear!-4])
        : { x:CX, y:TRUNK_YEAR_Y[activeYear!-1] };
      zoomTo(pos.x, pos.y, 155);
      setHint('CLICK A SEMESTER NODE');
    } else if (activeYear && activeTrack) {
      setActiveYear(null); setActiveSem(null); setModNodes([]); setResNodes([]); setSemNodes([]);
      setLitSegs(new Set());
      zoomTo(SPEC_X[activeTrack], 350, 250);
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

  function goBack() {
    setRevealedTrack(null); setActiveTrack(null); setLitSegs(new Set());
    setActiveYear(null); setActiveSem(null); setActiveMod(null); setActiveRes(null);
    setSemNodes([]); setModNodes([]); setResNodes([]);
    setTreeOpened(true);
    resetZoom(); setHint('CLICK A YEAR OR A SPECIALTY');
  }

  const transformStyle = `translate(${zoom.tx}px,${zoom.ty}px) scale(${zoom.scale})`;
  const canGoBack = !!(activeYear || revealedTrack || activeSem || activeMod);

  return (
    <div style={{width:'100%',height:'100vh',background:'var(--bg-main, #0B0F19)',overflow:'hidden'}}>
      <div ref={wrapRef} style={{width:'100%',height:'100%',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,transformOrigin:'0 0',
          transition:'transform 0.85s cubic-bezier(0.34,1.1,0.64,1)', transform: transformStyle}}>
          <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${SVG_H}`} width={SVG_W} height={SVG_H}
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
        </div>
      </div>
    </div>
  );
}

const DIM = 0.04;
const ANCESTOR_DIM = 0.15;

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
        stroke="var(--border-light)" strokeWidth="10" strokeLinecap="round"/>
    ) : (
      <line x1={CX} y1={TRUNK_BOT} x2={CX} y2={TRUNK_BOT-60}
        stroke="var(--border-light)" strokeWidth="10" strokeLinecap="round"
        style={{cursor: 'pointer'}} onClick={onTrunkClick}/>
    )}

    {!treeOpened && (
      <g style={{cursor: 'pointer'}} onClick={onTrunkClick}>
        <circle cx={CX} cy={TRUNK_BOT-60} r="11" fill="var(--bg-main)" stroke="#2DD4BF" strokeWidth="1.5">
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
          <g key={i} style={{cursor: 'pointer', opacity:focus?(isActiveCommonYear && activeSem ? ANCESTOR_DIM : 1):DIM, transition:'opacity 0.4s'}}
            onClick={()=>onCommonYearClick(i+1)}>
            {(lit||isActiveCommonYear) && <circle cx={CX} cy={y} r="18" fill="#2DD4BF" opacity="0.08"/>}
            <circle cx={CX} cy={y} r="10"
              fill={(lit||isActiveCommonYear)?'#2DD4BF':'var(--bg-main)'}
              stroke={(lit||isActiveCommonYear)?'rgba(45,212,191,0.4)':'#2DD4BF'}
              strokeWidth={(lit||isActiveCommonYear)?0:1}
              style={{transition:'fill 0.5s'}}/>
            <text x={CX+24} y={y} fontSize="10" fill={isActiveCommonYear?'#2DD4BF':'var(--text-main)'}
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
        const trackObj = SPECIALTY_NODES.find((s:any) => s.id === id);
        return (
          <path key={id}
            d={`M${CX},${BRANCH_SPLIT_Y} Q${cpx},${BRANCH_CP_Y} ${sx},130`}
            stroke={isActive ? trackObj?.color : 'var(--border-light)'}
            strokeWidth={isRevealed ? 4 : 3}
            fill="none"
            opacity={focus ? (isActive && activeYear ? ANCESTOR_DIM : 1) : DIM}
            style={{transition:'stroke 0.4s, stroke-width 0.3s, opacity 0.4s'}}
          />
        );
      })}

      {activeTrack && (() => {
        const sx=SPEC_X[activeTrack], cpx=(CX+sx)/2;
        const trackObj = SPECIALTY_NODES.find(t => t.id === activeTrack);
        const segs = [
          { lit: branchSegLit[0],
            d: `M${CX},${BRANCH_SPLIT_Y} Q${cpx},${BRANCH_CP_Y} ${getBranchYearPos(activeTrack,BRANCH_YEAR_FRACS[0]).x},${getBranchYearPos(activeTrack,BRANCH_YEAR_FRACS[0]).y}` },
          { lit: branchSegLit[1],
            d: (() => {
              const p4 = getBranchYearPos(activeTrack, BRANCH_YEAR_FRACS[0]);
              const p5 = getBranchYearPos(activeTrack, BRANCH_YEAR_FRACS[1]);
              const pm = getBranchYearPos(activeTrack, (BRANCH_YEAR_FRACS[0]+BRANCH_YEAR_FRACS[1])/2);
              return `M${p4.x},${p4.y} Q${pm.x},${pm.y} ${p5.x},${p5.y}`;
            })()
          }
        ];
        return segs.map((seg,i)=>seg.lit && (
          <path key={i} d={seg.d}
            stroke={trackObj?.color || '#2DD4BF'} strokeWidth="3" fill="none"
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
          <g key={id} style={{cursor: 'pointer', opacity:focus?(isActive && activeYear ? ANCESTOR_DIM : 1):DIM, transition:'opacity 0.4s'}} onClick={()=>onTrackClick(id)}>
            <circle cx={sx} cy={130} r="9"
              fill={isActive ? trackObj?.color : 'var(--bg-main)'}
              stroke={isActive ? 'var(--bg-main)' : trackObj?.color}
              strokeWidth={isActive?2:1.5}
              style={{transition:'fill 0.35s'}}/>
            <text x={sx} y={110} fontSize="9.5" fill={isActive ? trackObj?.color : 'var(--text-muted)'} textAnchor="middle">{id.toUpperCase()}</text>
            <text x={sx} y={148} fontSize="8" fill="var(--text-main)" textAnchor="middle">
              {trackObj?.label?.substring(0,18)||id}
            </text>
          </g>
        );
      })}

      {(revealedTrack||activeTrack) && [4,5].map((year,i)=>{
        const tid  = activeTrack || revealedTrack;
        const pos  = getBranchYearPos(tid!, BRANCH_YEAR_FRACS[i]);
        const isActiveYear = activeYear===year;
        const lit  = branchNodeLit[i];
        const focus = !activeSem || isActiveYear;
        const trk = SPECIALTY_NODES.find((s:any) => s.id === tid);
        return (
          <g key={year} style={{cursor: 'pointer', opacity:focus?(isActiveYear && activeSem ? ANCESTOR_DIM : 1):DIM, transition:'opacity 0.4s'}}
            onClick={()=>onYearClick(tid, year)}>
            {(lit||isActiveYear) && <circle cx={pos.x} cy={pos.y} r="18" fill="#2DD4BF" opacity="0.08"/>}
            <circle cx={pos.x} cy={pos.y} r="10"
              fill={isActiveYear? (activeTrack ? trk?.color : '#2DD4BF') : lit ? 'var(--bg-overlay)' : 'var(--bg-main)'}
              stroke={isActiveYear? 'var(--bg-main)' : (activeTrack ? trk?.color : '#2DD4BF')}
              strokeWidth={isActiveYear?2:1.5}
              style={{transition:'fill 0.4s'}}/>
            <text x={pos.x} y={pos.y+22} fontSize="10" fill={isActiveYear?'#2DD4BF':lit?'#2DD4BF':'var(--text-muted)'}
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
          <g key={n.id} style={{cursor: 'pointer', opacity:n.visible?(focus?(isActive && activeMod ? ANCESTOR_DIM : 1):DIM):0, transition:'opacity 0.3s'}}
            onClick={()=>onSemClick(n.id, n.x, n.y)}>
            <line x1={yearPos.x} y1={yearPos.y} x2={n.x} y2={n.y} stroke="var(--border-light)" strokeWidth="1.5" pointerEvents="none"/>
            <circle cx={n.x} cy={n.y} r="9"
              fill={isActive?'#2DD4BF':'var(--bg-main)'} stroke="#2DD4BF" strokeWidth="1.5"
              style={{transition:'fill 0.3s'}}/>
            <text x={isLeft?n.x-15:n.x+15} y={n.y} fontSize="8"
              fill={isActive?'#2DD4BF':'var(--text-muted)'}
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
          <g key={n.id} style={{cursor: 'pointer', opacity:n.visible?(focus?(isActive && activeRes ? ANCESTOR_DIM : 1):DIM):0, transition:'opacity 0.35s'}}
            onClick={()=>onModClick(n.id, n.x, n.y)}>
            <line x1={n.cx} y1={n.cy} x2={n.x} y2={n.y} stroke="var(--border-light)" strokeWidth="1" pointerEvents="none"/>
            <circle cx={n.x} cy={n.y} r="7"
              fill={isActive?'#16a392':'var(--bg-main)'} stroke="#16a392" strokeWidth="1.5"
              style={{transition:'fill 0.4s'}}/>
            <text x={n.x} y={n.y+(above?-14:16)} fontSize="7"
              fill={isActive?'#2DD4BF':'var(--text-muted)'} textAnchor="middle"
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
            <line x1={n.cx} y1={n.cy} x2={n.x} y2={n.y} stroke="var(--border-subtle)" strokeWidth="1" pointerEvents="none"/>
            <circle cx={n.x} cy={n.y} r="5"
              fill={isActive?'#0f766e':'var(--bg-main)'} stroke="#0f766e" strokeWidth="1"
              style={{transition:'fill 0.4s'}}/>
            <text x={n.x} y={n.y+(above?-11:13)} fontSize="6.5"
              fill={isActive?'#2DD4BF':'var(--text-muted)'} textAnchor="middle">{n.label}</text>
          </g>
        );
      })}
    </>}

    <text x="24" y="22" fontSize="8" fill="#2DD4BF" letterSpacing="2">
      NHSM · TREE OF KNOWLEDGE
    </text>
  </>;
}
