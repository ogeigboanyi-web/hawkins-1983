# HAWKINS — November 1983

A first-person 3D photography game. You are **Jonathan Byers**, the night Will Byers disappeared.
Explore Hawkins, Indiana after dark, and use your Canon AE-1 to photograph the places that matter —
nine subjects hidden across three locations from Stranger Things Season 1.

**Built with Three.js (no build step, single page).**

## Locations
1. **Mirkwood** — the dark forest road, Hopper's police cruiser with its light bar blinking,
   MISSING: Will Byers posters nailed to the trees, ground mist, fireflies.
2. **Harrington House — Backyard** — two-story house (brick lower story, gray siding above),
   the in-ground pool sleeping under its green winter cover, patio with table, chairs and
   umbrella, the warm wall lamp, Steve's lit window.
3. **Hawkins Middle School** — red-brick facade with pitched roof, the "HAWKINS MIDDLE SCHOOL"
   sign, empty lit lot, basketball hoop, the party's bikes still racked outside.

All three locations sit in one continuous world joined by night roads, with street lamps,
drifting clouds, a full star field and moon, and a distant glowing city skyline to the south.

## Running
Any static server works (internet needed once, for the Three.js CDN):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

(Opening index.html directly also works in most browsers.)

## Controls
| Key | Action |
|---|---|
| W A S D / Arrow keys | Move |
| Mouse | Look |
| Space | Jump |
| Shift | Sprint |
| Click (once) | Raise camera (viewfinder) |
| F / Click in viewfinder | Take photo |
| E / C | Toggle camera viewfinder |
| T / Right-click | Flashlight |
| Tab / B | Fotolog (photo album) |
| M | Travel map |
| 1 2 3 | Quick travel |
| R | Load a new roll of Kodachrome |

## Photo subjects
Nine subjects are discoverable — get close and face them while the shutter fires:
3 in Mirkwood, 3 at the Harrington backyard, 3 at Hawkins Middle. The HUD tracks
"SUBJECTS PHOTOGRAPHED: n / 9". Every shot is stored in your Fotolog with a
November '83 date stamp.

## Tech notes
- Custom lightweight physics: gravity, jumping, sprint acceleration, head-bob, landing dip,
  capsule-vs-AABB collision against ~800 colliders.
- Procedurally generated textures (grass, worn asphalt, brick, siding, pool cover, wall
  posters) — no external assets.
- Night sky shader with city-glow horizon, 1,400 stars, drifting cloud billboards, moon halo.
- Real-time shadows from a moonlight directional light that follows the player; ACES filmic
  tone mapping; exponential fog.
- WebAudio: film shutter, footsteps, wind ambience.
