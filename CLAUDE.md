# Portfolio (muhammedumar.in)

React 19 + Vite, deployed on Vercel. Dark editorial design, Inter. No em dashes
anywhere (copy, code, comments, commits).

## Layout

- `src/data/projects.js`: single source for projects. `key` names the building
  in the 3D island; `id` is the `/works?project=<id>` deep link.
- `src/components/Work.jsx` + `src/components/city/`: the 3D "project island"
  (React Three Fiber, lazy loaded). `CityScene.jsx` drives animation by node
  name, picking, camera rig and bloom. `vehicles.js` dresses the lot vehicles.
- `src/components/tour/` + `src/components/demos/`: guided, clickable product
  tours (ERP Edge, Motoriq, Pravak, MedBot). Beats come from `tour/beats.js`;
  screens ask `has(target)` / `last(...)` instead of counting beats. All demo
  data is made up; never name the ERP Edge client (AIGTS only).
- `api/visits.js`: Vercel function for the visit counter (Upstash Redis).

## 3D assets

- `public/models/city.glb` is generated from `tools/blender/city.py`;
  `public/models/vehicles.glb` packs the lot models from the
  Vehicle-management-system repo (`tools/blender/vehicles.py`). Rebuild:
  `BLENDER="C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" VEHICLES_SRC="../Vehicle-management-system/frontend/public/lot-models" npm run build:city`
- Both are meshopt-compressed, which stores a dequantization transform on mesh
  nodes: never set position/scale on an exported mesh directly. Animate through
  `pivot()` groups (see `CityScene.jsx`).
- Picking resolves the building root by exact name `B_<key>`; child meshes are
  `B_<key>_static_N`.
- The canvas background is `#1c1c1c` on purpose: after ACES tone mapping it
  renders as the hero's `#0a0a0a` (measured). Don't add a vignette; it breaks
  the seam with the hero.
- Vehicles are placed by `slot_<model>_<rrggbb>` empties from Blender.

## Checks

`npm run lint` (clean), `npm run build`. Verify visual changes in a real
browser; the scene needs WebGL.

## Open items

- Visit counter needs Upstash Redis added to the Vercel project.
- AIGTS start date is a placeholder ("2026 – Present"); team size not yet given.
- Resume PDF is out of date; the owner will replace it.
