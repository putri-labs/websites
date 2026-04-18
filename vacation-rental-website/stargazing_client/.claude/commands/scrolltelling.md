# ScrollTelling Skill

Use this skill when the user wants to add, modify, or integrate scroll-driven animations using the `scroll-telling` npm package.

## Package

```
npm install scroll-telling
```

Two entry points:
- `"scroll-telling"` — client components + hooks (React, browser)
- `"scroll-telling/server"` — `getFramePaths` server utility (Node.js only)

## Next.js Setup

After installing, add `transpilePackages` to `next.config.mjs` so Next.js compiles the package's TypeScript source:

```js
// next.config.mjs
const nextConfig = {
  transpilePackages: ["scroll-telling"],
};
export default nextConfig;
```

No other config needed. React resolution is handled automatically by `transpilePackages`.

## Core API

### `getFramePaths(folder, pattern?)` — server only
Reads image files from `public/<folder>` in the consuming project, sorts numerically, returns URL paths.

```ts
import { getFramePaths } from "scroll-telling/server";

// page.tsx (server component)
const frames = await getFramePaths("frames");                  // all images in public/frames/
const mountain = await getFramePaths("frames/mountain");       // subfolder
const custom = await getFramePaths("frames", /^\d+\.webp$/);  // custom pattern
```

### `<ScrollTelling frames={} scrollHeight="420vh">`
Canvas-based frame sequencer + context provider. All scroll hooks must be used inside this.

- `frames: string[]` — image URL array from `getFramePaths`
- `scrollHeight?: string` — total scroll distance, default `"420vh"`. Increase for slower pacing.
- `children` — any JSX, rendered as overlay on top of the canvas

### `<ScrollScene start={} end={} fadeDuration={400}>`
Fades children in/out over a scroll window. Convenience wrapper around `useScrollWindow`.

- `start / end` — scroll progress 0–1
- `fadeDuration?` — CSS transition ms, default 400
- `className / style` — forwarded to wrapper div

### `useScrollProgress()`
Raw `MotionValue<number>` (0–1) for the nearest `<ScrollTelling>` ancestor.

```tsx
const progress = useScrollProgress();
```

### `useScrollWindow(start, end)`
Returns `{ active: boolean, progress: MotionValue<number> }`.
- `active` — plain React state, use for CSS class toggling
- `progress` — 0→1 normalized within the window, use for Framer Motion style props

```tsx
const { active, progress } = useScrollWindow(0.2, 0.6);
```

### `useScrollMap(start, end, from, to, easing?)`
Maps scroll progress in `[start, end]` to numeric range `[from, to]`. Returns `MotionValue<number>`. Clamped outside the window.

- `easing?: "linear" | "easeIn" | "easeOut" | "easeInOut"` — default `"linear"`

```tsx
const x = useScrollMap(0, 0.5, -200, 0, "easeOut");
<motion.div style={{ x }} />
```

## Usage Example (page.tsx)

```tsx
import { getFramePaths } from "scroll-telling/server";
import { ScrollTelling, ScrollScene } from "scroll-telling";

export default async function Page() {
  const frames = await getFramePaths("frames");

  return (
    <ScrollTelling frames={frames} scrollHeight="500vh">
      {/* Gradients, overlays, anything */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 to-black" />

      <ScrollScene start={0.1} end={0.4} className="absolute top-1/4 left-1/2 -translate-x-1/2">
        <h2 className="text-white text-4xl">First Scene</h2>
      </ScrollScene>

      <ScrollScene start={0.5} end={0.9} className="absolute top-1/2 left-1/2 -translate-x-1/2">
        <MyCustomComponent />
      </ScrollScene>
    </ScrollTelling>
  );
}
```

## All Use Cases & Patterns

### 1. Fade only (ScrollScene)
```tsx
<ScrollScene start={0.1} end={0.4} className="absolute top-1/2 left-1/2 -translate-x-1/2">
  <h2 className="text-white text-3xl">Any content</h2>
</ScrollScene>
```

### 2. Position shift only (no fade)
```tsx
function ParallaxLayer() {
  const y = useScrollMap(0, 1, 0, -300, "easeOut");
  return <motion.div style={{ y }} className="absolute top-1/4 left-10">content</motion.div>;
}
```

### 3. Fade + position shift (parallax entrance)
```tsx
function ParallaxEntrance() {
  const { active } = useScrollWindow(0.1, 0.5);
  const y = useScrollMap(0.1, 0.5, 40, 0, "easeOut");
  return (
    <motion.div
      style={{ y, opacity: active ? 1 : 0 }}
      className="transition-opacity duration-500 absolute top-1/3 left-1/2"
    >
      slides up while fading in
    </motion.div>
  );
}
```

### 4. Scale + fade (zoom reveal)
```tsx
function ZoomReveal() {
  const { active } = useScrollWindow(0.3, 0.7);
  const scale = useScrollMap(0.3, 0.5, 0.8, 1, "easeOut");
  return (
    <motion.div style={{ scale, opacity: active ? 1 : 0 }} className="transition-opacity duration-300 absolute ...">
      zooms in while fading
    </motion.div>
  );
}
```

### 5. Counter (number counts as you scroll)
```tsx
function ScrollCounter() {
  const count = useScrollMap(0.2, 0.8, 0, 100, "easeInOut");
  const rounded = useTransform(count, Math.round);
  return <motion.span className="text-6xl font-bold text-white">{rounded}</motion.span>;
}
```

### 6. Typewriter (text reveals character by character)
```tsx
function Typewriter({ text }: { text: string }) {
  const progress = useScrollProgress();
  const [displayed, setDisplayed] = useState("");
  useEffect(() => progress.on("change", (v) => {
    setDisplayed(text.slice(0, Math.round(v * text.length)));
  }), [progress, text]);
  return <span className="text-white font-mono">{displayed}</span>;
}
```

### 7. Color shift
```tsx
function ColorShifter() {
  const r = useScrollMap(0, 1, 10, 135);
  const g = useScrollMap(0, 1, 10, 181);
  const b = useScrollMap(0, 1, 10, 230);
  const background = useMotionTemplate`rgb(${r}, ${g}, ${b})`;
  return <motion.div style={{ background }} className="absolute inset-0 pointer-events-none" />;
}
```

### 8. Progress bar
```tsx
function ScrollProgressBar() {
  const width = useScrollMap(0, 1, 0, 100);
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
      <motion.div style={{ width: useMotionTemplate`${width}%` }} className="h-full bg-white" />
    </div>
  );
}
```

### 9. Hard visibility window (no fade)
```tsx
function HardWindow() {
  const { active } = useScrollWindow(0.4, 0.6);
  if (!active) return null;
  return <div className="absolute ...">only renders in this window</div>;
}
```

### 10. Parallax (moves slower than scroll)
```tsx
function ParallaxBackground() {
  const y = useScrollMap(0, 1, 0, -150, "linear");
  return <motion.div style={{ y }} className="absolute inset-0">background layer</motion.div>;
}
```

## Multiple Instances (different frame folders)

Each `<ScrollTelling>` is independent — children read from their nearest ancestor automatically.

```tsx
// page.tsx
const mountainFrames = await getFramePaths("frames/mountain");
const cityFrames = await getFramePaths("frames/city");

// JSX
<ScrollTelling frames={mountainFrames} scrollHeight="300vh">
  <MyMountainOverlay />
</ScrollTelling>

<ScrollTelling frames={cityFrames} scrollHeight="500vh">
  <MyCityOverlay />
</ScrollTelling>
```

## Publishing to npm

When ready to publish publicly (free):

```bash
cd /path/to/scroll-telling
npm publish --access public
```

Then consuming projects install normally:
```bash
npm install scroll-telling
# no transpilePackages needed for published packages (pre-built)
```

Note: once published and pre-built, remove `transpilePackages` from next.config.mjs — it's only needed for local `file:` references where the source is TypeScript.

## Error to Watch For

If any scroll hook is used outside `<ScrollTelling>`, it throws:
> "Scroll hooks must be used inside a \<ScrollTelling\> component."

All overlay components must be rendered as children (direct or nested) of `<ScrollTelling>`.

## Implementation Checklist

1. Pick the right hook: raw progress → `useScrollProgress`, windowed → `useScrollWindow`, value mapping → `useScrollMap`
2. Easing: `easeOut` for entrances, `easeIn` for exits, `easeInOut` for counters/transitions
3. All overlay components must live inside `<ScrollTelling>` as children
4. Position overlays with `absolute` inside the sticky viewport
5. CSS fades: use `active` boolean from `useScrollWindow` + `transition-opacity`
6. Motion fades: pass `MotionValue` directly to `motion.*` `style` prop
