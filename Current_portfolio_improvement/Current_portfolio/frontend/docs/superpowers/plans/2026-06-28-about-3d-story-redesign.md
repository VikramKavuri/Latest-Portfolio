# About 3D Story Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3 weak About 3D icons (laptop / database / lightbulb) with a 6-model cinematic sequence that conveys the full story with zero reading, and re-split the chapter text to match.

**Architecture:** Pure additions to the existing `src/components/about/` pattern. `about.js` grows from 3 to 6 chapters with proof stats distributed across beats 4–5. `AboutScene3D.jsx` replaces its 3 procedural model components with 6 and wires 6 `ModelSlot`s (the persistent-canvas / `useSwap` cross-fade / `.glb` auto-upgrade machinery is unchanged). `AboutStory.jsx` extends its `CAPTIONS` and `DISC_CLASS` arrays to 6 entries; its IntersectionObserver already keys off `data-chapter` index, so 6 chapters drive `active` 0..5 automatically.

**Tech Stack:** React, @react-three/fiber, @react-three/drei, three, framer-motion. CRA + craco. No new dependencies.

## Global Constraints

- Source-of-truth tree (edit here): `D:\new\Latest-Portfolio\Current_portfolio_improvement\Current_portfolio\frontend`. Do NOT touch the git-tracked reference tree at `D:\new\Latest-Portfolio\Current_portfolio\frontend`.
- Theme colors (exact): GOLD `#B8860B`, GOLD_LIGHT `#D4A843`, NAVY `#2C4A72`, INK `#1B2336`. These constants already exist at the top of `AboutScene3D.jsx`.
- All animation gates on the existing module-level `prefersReduced` flag — reduced motion must disable spin / jitter / pulse / travel.
- Transform/opacity-driven only. No new libraries.
- Each model keeps a `.glb` auto-upgrade slot via `ModelSlot` (urls `/models/{journey,chaos,convergence,speed,trust,insight}.glb`). No `.glb` assets are authored in this plan.
- Verification is compile (dev server / `npm run build`) + browser visual QA. There is no component test runner; do not invent one.

---

## File Structure

- **Modify** `src/data/about.js` — replace the 3-item `chapters` array with 6; redistribute the 5 proof stats into inline `proof` arrays on beats 4 and 5; remove the now-unused top-level `proof` array.
- **Modify** `src/components/about/AboutScene3D.jsx` — replace `Laptop`/`Database`/`Lightbulb` with `Globe`/`ClashingSystems`/`Convergence`/`Speed`/`Shield`/`InsightGem`; update the drei import; wire 6 `ModelSlot`s in `Scene`. Keep `useSwap`, `ModelSlot`, `ModelErrorBoundary`, `LoadedModel`, `AboutScene3D` unchanged.
- **Modify** `src/components/about/AboutStory.jsx` — extend `CAPTIONS` and `DISC_CLASS` to 6 entries. Nothing else changes.
- **No change** `src/components/about/Chapter.jsx` — already renders kicker/headline/body/quote/proof generically; `chapter.proof` array support already present.
- **No change** `src/index.css` — reuses existing `.disc-gold` / `.disc-navy`.

---

## Task 1: Re-split the story data (`about.js`)

**Files:**
- Modify: `src/data/about.js`

**Interfaces:**
- Produces: `about.chapters` — array of 6 objects, each `{ id, kicker, visual, headline, body: string[], quote?, proof? }`. `id` order: `journey, chaos, convergence, speed, trust, insight` (drives `active` 0..5). `about.opening`, `about.close`, `about.closeHint`, `about.portrait`, `about.portraitInitials` unchanged.
- Consumes: nothing.

- [ ] **Step 1: Replace the file contents**

Overwrite `src/data/about.js` with exactly:

```js
// Story content for the About section.
// Voice: conversational, a little personality, crisp — like I'm talking to you,
// not narrating an article. Each beat's 3D visual on the left matches the words.

export const about = {
  opening: "Look — there are thousands of data engineers. I'm the one you actually want when the decision matters.",

  portrait: '/portrait/vikram.webp',
  portraitInitials: 'VK',

  chapters: [
    {
      id: 'journey',
      kicker: 'The person',
      visual: 'globe',
      headline: "Hi, I'm Vikram.",
      body: [
        'Started as a business analyst in Bangalore, now a data engineer in Buffalo. Same instinct the whole way: get the decision right first, then build what makes it possible.',
        "I'm the quiet one on the call — right up until the number has to be right.",
      ],
      quote: {
        text: 'This guy must be senior level — even though he was a fresher.',
        source: 'Technical Lead, The Arc Erie County',
      },
    },
    {
      id: 'chaos',
      kicker: 'The problem',
      visual: 'chaos',
      headline: 'Most data is a mess.',
      body: [
        'An EHR here, an ERP there, an HR tool that argues with both. Three systems, three versions of the truth — and a business trying to decide with all of them at once.',
      ],
    },
    {
      id: 'convergence',
      kicker: 'What I do best',
      visual: 'convergence',
      headline: 'I make them tell one story.',
      body: [
        'I pull them into one source you can actually trust — one place the whole business can point to and stop arguing about whose number is right.',
      ],
    },
    {
      id: 'speed',
      kicker: 'Fast',
      visual: 'speed',
      headline: 'Then I make it fast.',
      body: [
        'Reports that took four hours now take forty-five minutes. Queries that used to crawl run 85% faster.',
      ],
      proof: [
        { value: '85%', label: 'Faster queries' },
        { value: '4h→45m', label: 'Report runtime' },
      ],
    },
    {
      id: 'trust',
      kicker: 'Bet-the-business reliable',
      visual: 'trust',
      headline: "Fast isn't enough — it has to hold up.",
      body: [
        'Accurate, audit-proof, the kind of number you can stake a decision on. When the auditors came, they found nothing.',
      ],
      proof: [
        { value: '87%', label: 'ML accuracy, in production' },
        { value: '0', label: 'Audit findings' },
        { value: '40%', label: 'Billing backlog cut' },
      ],
    },
    {
      id: 'insight',
      kicker: 'Why me',
      visual: 'gem',
      headline: "Tools are cheap. Judgment isn't.",
      body: [
        'Anyone can stand up a pipeline. I find the insight that actually moves the needle —',
        "and I won't settle for “it works” when “optimal” is still on the table.",
      ],
    },
  ],

  close: 'Optimal insights. Nothing less.',
  closeHint: 'Keep scrolling — the work speaks next.',
};
```

- [ ] **Step 2: Verify it compiles in the running dev server**

If the dev server is running (`npm start` → localhost:3000), it recompiles on save. Otherwise run a one-off lint check:

Run: `npx eslint src/data/about.js`
Expected: no errors.

- [ ] **Step 3: Verify the shape with a grep sanity check**

Run: `grep -c "id:" src/data/about.js`
Expected: `6`

Run: `grep -o "value: '[^']*'" src/data/about.js`
Expected: 5 lines — `85%`, `4h→45m`, `87%`, `0`, `40%` (all 5 original proof stats preserved, now on beats 4–5).

- [ ] **Step 4: Commit**

```bash
git add src/data/about.js
git commit -m "feat(about): re-split story into 6 beats with distributed proof stats"
```

---

## Task 2: Six story models (`AboutScene3D.jsx`)

**Files:**
- Modify: `src/components/about/AboutScene3D.jsx`

**Interfaces:**
- Consumes: `about.chapters` indices (0..5) via the `active` prop already passed from `AboutStory`.
- Produces: `<AboutScene3D active={number} />` (signature unchanged). Internally exposes 6 model components (`Globe`, `ClashingSystems`, `Convergence`, `Speed`, `Shield`, `InsightGem`) wired into `Scene`.
- Unchanged exports/helpers: `useSwap`, `LoadedModel`, `ModelErrorBoundary`, `ModelSlot`, default `AboutScene3D`. The `prefersReduced` flag and color constants stay as-is.

- [ ] **Step 1: Update the drei import line**

Replace line 3:

```jsx
import { useGLTF, Center, RoundedBox, Cylinder, Torus, Sphere, Float } from '@react-three/drei';
```

with (drop unused `Cylinder`, `Torus`, `Float`; add `Line` for the globe arc):

```jsx
import { useGLTF, Center, RoundedBox, Sphere, Line } from '@react-three/drei';
```

- [ ] **Step 2: Replace the three model components with six**

Delete the entire block from the comment `/* The person → a laptop / workspace */` through the end of the `Lightbulb` function (the three functions `Laptop`, `Database`, `Lightbulb` and their comments). Replace with:

```jsx
/* =========================================================
   Story models — one unambiguous idea per beat.
   ========================================================= */

/* 1. Journey → a globe with a flight arc (Bangalore → Buffalo). */
function Globe() {
  const dotRef = useRef();
  const R = 1.02;
  const { pinA, pinB, curve, points } = useMemo(() => {
    const a = new THREE.Vector3().setFromSphericalCoords(R, Math.PI * 0.40, Math.PI * 0.18);
    const b = new THREE.Vector3().setFromSphericalCoords(R, Math.PI * 0.30, -Math.PI * 0.78);
    const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.55);
    const c = new THREE.QuadraticBezierCurve3(a, mid, b);
    return { pinA: a, pinB: b, curve: c, points: c.getPoints(48) };
  }, []);

  useFrame((state) => {
    if (!prefersReduced && dotRef.current) {
      const t = (state.clock.elapsedTime * 0.25) % 1;
      dotRef.current.position.copy(curve.getPoint(t));
    }
  });

  return (
    <group>
      {/* wireframe shell */}
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial color={NAVY} roughness={0.4} metalness={0.3} wireframe transparent opacity={0.55} />
      </Sphere>
      {/* solid inner globe */}
      <Sphere args={[0.97, 32, 32]}>
        <meshStandardMaterial color={INK} roughness={0.6} metalness={0.2} />
      </Sphere>
      {/* origin + destination pins */}
      <mesh position={pinA}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={GOLD_LIGHT} />
      </mesh>
      <mesh position={pinB}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={GOLD_LIGHT} />
      </mesh>
      {/* flight arc */}
      <Line points={points} color={GOLD} lineWidth={1.5} transparent opacity={0.9} />
      {/* travelling dot */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#FFE9A8" />
      </mesh>
    </group>
  );
}

/* 2. Chaos → three mismatched systems that don't talk (EHR / ERP / HR). */
function ClashingSystems() {
  const refs = [useRef(), useRef(), useRef()];
  useFrame((state) => {
    if (prefersReduced) return;
    const t = state.clock.elapsedTime;
    refs.forEach((r, i) => {
      if (!r.current) return;
      r.current.position.x = (i - 1) * 1.0 + Math.sin(t * 3 + i) * 0.08;
      r.current.position.y = (i - 1) * 0.15 + Math.cos(t * 2.5 + i * 2) * 0.12;
      r.current.rotation.z = Math.sin(t * 2 + i) * 0.15;
    });
  });
  const panelMat = <meshStandardMaterial color={NAVY} roughness={0.4} metalness={0.3} />;
  return (
    <group>
      {/* EHR — health cross */}
      <group ref={refs[0]} position={[-1, 0.15, 0]}>
        <RoundedBox args={[0.55, 0.55, 0.3]} radius={0.05}>{panelMat}</RoundedBox>
        <mesh position={[0, 0, 0.16]}><boxGeometry args={[0.34, 0.1, 0.04]} /><meshBasicMaterial color={GOLD_LIGHT} /></mesh>
        <mesh position={[0, 0, 0.16]}><boxGeometry args={[0.1, 0.34, 0.04]} /><meshBasicMaterial color={GOLD_LIGHT} /></mesh>
      </group>
      {/* ERP — module grid */}
      <group ref={refs[1]} position={[0, 0, 0]}>
        <RoundedBox args={[0.55, 0.55, 0.3]} radius={0.05}>{panelMat}</RoundedBox>
        {[[-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12], [0.12, 0.12]].map((p, i) => (
          <mesh key={i} position={[p[0], p[1], 0.16]}><boxGeometry args={[0.14, 0.14, 0.04]} /><meshBasicMaterial color={GOLD_LIGHT} /></mesh>
        ))}
      </group>
      {/* HR — person badge */}
      <group ref={refs[2]} position={[1, -0.15, 0]}>
        <RoundedBox args={[0.55, 0.55, 0.3]} radius={0.05}>{panelMat}</RoundedBox>
        <mesh position={[0, 0.08, 0.16]}><sphereGeometry args={[0.09, 16, 16]} /><meshBasicMaterial color={GOLD_LIGHT} /></mesh>
        <mesh position={[0, -0.12, 0.16]}><cylinderGeometry args={[0.14, 0.14, 0.12, 16, 1, false, 0, Math.PI]} /><meshBasicMaterial color={GOLD_LIGHT} /></mesh>
      </group>
      {/* broken (red) connectors between them */}
      {[[-0.5, 0.07, 0.3], [0.5, -0.07, -0.3]].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], 0]} rotation={[0, 0, p[2]]}>
          <boxGeometry args={[0.4, 0.03, 0.03]} />
          <meshBasicMaterial color="#B4434B" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* 3. Convergence → many sources stream into one unified, pulsing core. */
function Convergence() {
  const coreRef = useRef();
  const particlesRef = useRef();
  const N = 60;
  const seeds = useMemo(
    () => Array.from({ length: N }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 1.4 + Math.random() * 0.6,
      y: (Math.random() - 0.5) * 1.6,
      speed: 0.3 + Math.random() * 0.4,
      off: Math.random(),
    })),
    []
  );
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current && !prefersReduced) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 2.4) * 0.08);
    }
    if (particlesRef.current) {
      particlesRef.current.children.forEach((m, i) => {
        const sd = seeds[i];
        const phase = prefersReduced ? 0.5 : ((t * sd.speed + sd.off) % 1);
        const rr = sd.r * (1 - phase);
        m.position.set(Math.cos(sd.a) * rr, sd.y * (1 - phase), Math.sin(sd.a) * rr);
        m.scale.setScalar(0.04 * (0.4 + (1 - phase)));
      });
    }
  });
  return (
    <group>
      {/* three source nodes */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 1.5, 0, Math.sin(a) * 1.5]}>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshStandardMaterial color={NAVY} roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
      {/* inbound particles */}
      <group ref={particlesRef}>
        {seeds.map((_, i) => (
          <mesh key={i}><sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color={GOLD_LIGHT} /></mesh>
        ))}
      </group>
      {/* unified core */}
      <Sphere ref={coreRef} args={[0.5, 48, 48]}>
        <meshStandardMaterial color={GOLD_LIGHT} emissive={GOLD} emissiveIntensity={0.6} roughness={0.2} metalness={0.3} />
      </Sphere>
    </group>
  );
}

/* 4. Speed → data packets racing through a conduit into the core. */
function Speed() {
  const packetsRef = useRef();
  const M = 10;
  useFrame((state) => {
    if (!packetsRef.current) return;
    const t = state.clock.elapsedTime;
    packetsRef.current.children.forEach((m, i) => {
      const phase = prefersReduced ? i / M : (((t * 1.2) + i / M) % 1);
      m.position.x = -1.6 + phase * 3.2;
      m.scale.setScalar(0.08 + Math.sin(phase * Math.PI) * 0.06);
    });
  });
  return (
    <group rotation={[0.1, 0, 0]}>
      {/* conduit */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 3.2, 32, 1, true]} />
        <meshStandardMaterial color={NAVY} roughness={0.4} metalness={0.4} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* racing packets */}
      <group ref={packetsRef}>
        {Array.from({ length: M }).map((_, i) => (
          <mesh key={i}><boxGeometry args={[0.5, 0.16, 0.16]} /><meshBasicMaterial color={GOLD_LIGHT} /></mesh>
        ))}
      </group>
      {/* destination core */}
      <Sphere args={[0.4, 32, 32]} position={[1.6, 0, 0]}>
        <meshStandardMaterial color={GOLD_LIGHT} emissive={GOLD} emissiveIntensity={0.5} roughness={0.2} metalness={0.3} />
      </Sphere>
    </group>
  );
}

/* 5. Trust → a steady gold shield with a check (accurate, audit-proof). */
function Shield() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1);
    s.quadraticCurveTo(0.95, 0.7, 0.95, 0.1);
    s.quadraticCurveTo(0.95, -0.7, 0, -1.05);
    s.quadraticCurveTo(-0.95, -0.7, -0.95, 0.1);
    s.quadraticCurveTo(-0.95, 0.7, 0, 1);
    return s;
  }, []);
  return (
    <group>
      <mesh>
        <extrudeGeometry args={[shape, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3 }]} />
        <meshStandardMaterial color={GOLD_LIGHT} emissive={GOLD} emissiveIntensity={0.25} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* check mark */}
      <group position={[0, 0, 0.24]}>
        <mesh position={[-0.18, -0.05, 0]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.12, 0.34, 0.06]} /><meshBasicMaterial color={INK} /></mesh>
        <mesh position={[0.12, 0.05, 0]} rotation={[0, 0, -Math.PI / 4]}><boxGeometry args={[0.12, 0.6, 0.06]} /><meshBasicMaterial color={INK} /></mesh>
      </group>
    </group>
  );
}

/* 6. Insight → one gold gem rises and lights up out of dull raw data. */
function InsightGem() {
  const gemRef = useRef();
  const matRef = useRef();
  const rawPoints = useMemo(
    () => Array.from({ length: 24 }, () => [
      (Math.random() - 0.5) * 2.4,
      -0.9 + Math.random() * 0.15,
      (Math.random() - 0.5) * 1.6,
    ]),
    []
  );
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (gemRef.current) {
      gemRef.current.position.y = prefersReduced ? 0.4 : 0.2 + Math.abs(Math.sin(t * 0.8)) * 0.5;
      if (!prefersReduced) gemRef.current.rotation.y += 0.02;
    }
    if (matRef.current && !prefersReduced) {
      matRef.current.emissiveIntensity = 0.5 + Math.sin(t * 2.2) * 0.3;
    }
  });
  return (
    <group>
      {/* dull raw data field */}
      {rawPoints.map((p, i) => (
        <mesh key={i} position={p}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color={NAVY} roughness={0.8} metalness={0.1} /></mesh>
      ))}
      {/* the one insight */}
      <mesh ref={gemRef} position={[0, 0.4, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial ref={matRef} color={GOLD_LIGHT} emissive={GOLD} emissiveIntensity={0.7} metalness={0.7} roughness={0.15} flatShading />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 3: Wire the six models into `Scene`**

Replace the three `ModelSlot` blocks inside the `Scene` function:

```jsx
      <ModelSlot url="/models/person.glb" active={active === 0} spin={0.25}>
        <Laptop />
      </ModelSlot>
      <ModelSlot url="/models/craft.glb" active={active === 1} spin={0.25}>
        <Database />
      </ModelSlot>
      <ModelSlot url="/models/difference.glb" active={active === 2} spin={0.3}>
        <Lightbulb />
      </ModelSlot>
```

with:

```jsx
      <ModelSlot url="/models/journey.glb" active={active === 0} spin={0.18}>
        <Globe />
      </ModelSlot>
      <ModelSlot url="/models/chaos.glb" active={active === 1} spin={0.15}>
        <ClashingSystems />
      </ModelSlot>
      <ModelSlot url="/models/convergence.glb" active={active === 2} spin={0.2}>
        <Convergence />
      </ModelSlot>
      <ModelSlot url="/models/speed.glb" active={active === 3} spin={0.12}>
        <Speed />
      </ModelSlot>
      <ModelSlot url="/models/trust.glb" active={active === 4} spin={0}>
        <Shield />
      </ModelSlot>
      <ModelSlot url="/models/insight.glb" active={active === 5} spin={0.25}>
        <InsightGem />
      </ModelSlot>
```

- [ ] **Step 4: Verify it compiles**

Run: `npx eslint src/components/about/AboutScene3D.jsx`
Expected: no errors (in particular, no "defined but never used" for `Cylinder`/`Torus`/`Float`/`Laptop`/`Database`/`Lightbulb` — they should all be gone).

If the dev server is running, confirm it recompiles with no overlay error.

- [ ] **Step 5: Commit**

```bash
git add src/components/about/AboutScene3D.jsx
git commit -m "feat(about): replace 3 icons with 6 story models (globe→chaos→convergence→speed→shield→gem)"
```

---

## Task 3: Captions and discs for six beats (`AboutStory.jsx`)

**Files:**
- Modify: `src/components/about/AboutStory.jsx`

**Interfaces:**
- Consumes: `about.chapters` (6 items) from Task 1; `AboutScene3D` `active` prop from Task 2.
- Produces: 6-entry `CAPTIONS` and `DISC_CLASS` arrays indexed by `active` (0..5). `about-disc` uses existing CSS classes `disc-gold` / `disc-navy`.

- [ ] **Step 1: Replace the `CAPTIONS` and `DISC_CLASS` constants**

Replace lines 8–13:

```jsx
const CAPTIONS = [
  'where the work happens',
  'many systems → one source of truth',
  'the insight, lit up',
];
const DISC_CLASS = ['disc-gold', 'disc-gold', 'disc-navy'];
```

with:

```jsx
const CAPTIONS = [
  'across the world, into the work',
  'three systems, three truths',
  'many sources → one source of truth',
  'four hours → forty-five minutes',
  'accurate. audit-proof.',
  'the one insight that moves the needle',
];
const DISC_CLASS = ['disc-gold', 'disc-navy', 'disc-gold', 'disc-navy', 'disc-navy', 'disc-gold'];
```

- [ ] **Step 2: Verify it compiles**

Run: `npx eslint src/components/about/AboutStory.jsx`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/about/AboutStory.jsx
git commit -m "feat(about): 6-beat captions and disc colors"
```

---

## Task 4: Full build + visual QA

**Files:**
- None modified. Verification only; fix-forward into the relevant file from Task 1–3 if a beat is wrong, then re-commit.

- [ ] **Step 1: Production build (catches any remaining compile/lint error)**

Run: `npm run build`
Expected: "Compiled successfully" (warnings tolerated; no errors). If it fails, fix in the offending file and re-commit before continuing.

- [ ] **Step 2: Visual QA each beat in the browser**

Start the dev server if not running (`npm start`), open `localhost:3000`, navigate to the About section, and scroll through all 6 beats. For each, confirm:

1. **Beat 1 journey** — wireframe globe with two gold pins, a gold arc, and a bright dot travelling the arc; gold disc behind. Caption "across the world, into the work".
2. **Beat 2 chaos** — three distinct panels (cross / grid / person badge) drifting apart with red connectors; navy disc. Caption "three systems, three truths".
3. **Beat 3 convergence** — gold particles streaming inward into a pulsing gold core; gold disc. Caption "many sources → one source of truth".
4. **Beat 4 speed** — gold packets racing left→right through a translucent conduit into a core; navy disc. Proof shows `85%` and `4h→45m`.
5. **Beat 5 trust** — steady gold shield with a dark check; navy disc. Proof shows `87%`, `0`, `40%`.
6. **Beat 6 insight** — dull navy points with one gold octahedron gem rising/pulsing; gold disc. Caption "the one insight that moves the needle".

Confirm each model cross-fades in as its chapter scrolls into the middle band, and the previous one fades out (only one visible at a time).

Use the browser/screenshot tooling (gstack/browse) to capture each beat if available.

- [ ] **Step 3: Reduced-motion check**

In the browser/OS, enable "reduce motion" (or emulate `prefers-reduced-motion: reduce` in devtools rendering panel), reload, and scroll the About section. Confirm: globe dot is static, chaos panels don't jitter, convergence particles/core are frozen mid-state, speed packets are static, gem doesn't rise/pulse, and models don't auto-spin.

- [ ] **Step 4: Mobile layout check**

Resize to a narrow viewport (~390px). Confirm the sticky stage and chapter text still lay out without overlap or clipping, and the canvas stays within its disc.

- [ ] **Step 5: Final commit (only if any fixes were made in Steps 1–4)**

```bash
git add -A
git commit -m "fix(about): visual QA adjustments across 6 beats"
```

---

## Self-Review Notes

- **Spec coverage:** All 6 models (globe, clashing systems, convergence, speed, shield, insight gem) → Task 2. Text re-split into 6 beats with redistributed proof → Task 1. Captions + disc per beat → Task 3. Reduced-motion / mobile / `.glb`-slot constraints → Task 2 code + Task 4 QA. Opening/close unchanged → preserved verbatim in Task 1.
- **Placeholder scan:** none — every step shows complete code or an exact command + expected output.
- **Type consistency:** chapter `id`s (`journey, chaos, convergence, speed, trust, insight`) order matches `active` 0..5 used by the `ModelSlot` wiring in Task 2 and the `CAPTIONS`/`DISC_CLASS` index order in Task 3. The 5 proof stats from the original `proof` array are preserved (now on beats 4–5), verified by the grep in Task 1 Step 3.
- **Note on TDD:** intentionally not used — no component test runner exists (no `@testing-library/react`) and the deliverables are procedural 3D visuals where geometry assertions add no value. Verification is compile + browser visual QA, consistent with the existing codebase (zero component tests).
```