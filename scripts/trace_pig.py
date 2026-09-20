import math
from collections import defaultdict
from PIL import Image

img = Image.open('C:/Users/Lin_ge/.gemini/antigravity/brain/300f7172-90f8-48b9-a1fc-c83e3d6f0ad3/.user_uploaded/media_1789917992089.png').convert('RGB')
w, h = img.size

def get_loops(predicate):
    padded_w, padded_h = w + 2, h + 2
    grid = [[0]*padded_w for _ in range(padded_h)]
    for y in range(h):
        for x in range(w):
            if predicate(img.getpixel((x, y)), x, y):
                grid[y+1][x+1] = 1
    
    adj = defaultdict(list)
    for y in range(padded_h - 1):
        for x in range(padded_w):
            v1, v2 = grid[y][x], grid[y+1][x]
            if v1 != v2:
                p1, p2 = ((x-1, y), (x, y)) if v1 > v2 else ((x, y), (x-1, y))
                adj[p1].append(p2)
    for y in range(padded_h):
        for x in range(padded_w - 1):
            v1, v2 = grid[y][x], grid[y][x+1]
            if v1 != v2:
                p1, p2 = ((x, y), (x, y-1)) if v1 > v2 else ((x, y-1), (x, y))
                adj[p1].append(p2)
                    
    visited = set()
    loops = []
    for start in list(adj.keys()):
        if start not in visited:
            loop = [start]
            visited.add(start)
            curr = start
            while True:
                nxts = [n for n in adj[curr] if n not in visited or (n == start and len(loop) > 2)]
                if not nxts:
                    break
                nxt = nxts[0]
                if nxt == start:
                    break
                visited.add(nxt)
                loop.append(nxt)
                curr = nxt
            if len(loop) > 8:
                loops.append(loop)
    return loops

def rdp(pts, epsilon=1.2):
    if len(pts) < 3:
        return pts
    x1, y1 = pts[0]
    x2, y2 = pts[-1]
    max_d, max_idx = 0, 0
    dx, dy = x2 - x1, y2 - y1
    d_sq = dx*dx + dy*dy
    for i in range(1, len(pts)-1):
        x0, y0 = pts[i]
        d = abs(dy*x0 - dx*y0 + x2*y1 - y2*x1) / math.sqrt(d_sq) if d_sq else math.hypot(x0-x1, y0-y1)
        if d > max_d:
            max_d, max_idx = d, i
    if max_d > epsilon:
        res1 = rdp(pts[:max_idx+1], epsilon)
        res2 = rdp(pts[max_idx:], epsilon)
        return res1[:-1] + res2
    return [pts[0], pts[-1]]

def pts_to_path(pts, epsilon=1.2):
    simplified = rdp(pts, epsilon)
    return 'M ' + ' L '.join(f'{x:.1f} {y:.1f}' for x, y in simplified) + ' Z'

# 1. Pig body
body_loops = get_loops(lambda c, x, y: c[0] > 30 or c[1] > 30 or c[2] > 30)
body_loops.sort(key=lambda l: len(l), reverse=True)
outer_body = body_loops[0]
tail_hole = body_loops[1] if len(body_loops) > 1 else None

# 2. Snout
snout_loops = get_loops(lambda c, x, y: 40 < x < 120 and 160 < y < 225 and ((c[0] > 190 and c[1] < 160 and c[2] < 160) or (c[0] < 50 and c[1] < 50 and c[2] < 50)))
snout_loops.sort(key=lambda l: len(l), reverse=True)

# 3. Flap
flap_loops = get_loops(lambda c, x, y: c[0] > 220 and 150 < c[1] < 190 and 150 < c[2] < 190 and 180 < x < 230 and 220 < y < 265)
flap_loops.sort(key=lambda l: len(l), reverse=True)

# 4. Left ear magenta
ear1_loops = get_loops(lambda c, x, y: c[0] > 180 and c[1] < 115 and c[2] > 115 and x < 100)
ear1_loops.sort(key=lambda l: len(l), reverse=True)

# 5. Right ear magenta
ear2_loops = get_loops(lambda c, x, y: c[0] > 180 and c[1] < 115 and c[2] > 115 and x >= 100)
ear2_loops.sort(key=lambda l: len(l), reverse=True)

# 6. Eyes
eye1_loops = get_loops(lambda c, x, y: c[0] < 50 and c[1] < 50 and c[2] < 50 and 40 < x < 85 and 130 < y < 170)
eye2_loops = get_loops(lambda c, x, y: c[0] < 50 and c[1] < 50 and c[2] < 50 and 115 < x < 165 and 140 < y < 185)

# 7. Nostrils
n1_loops = get_loops(lambda c, x, y: c[0] < 50 and c[1] < 50 and c[2] < 50 and 55 < x < 76 and 175 < y < 205)
n2_loops = get_loops(lambda c, x, y: c[0] < 50 and c[1] < 50 and c[2] < 50 and 78 < x < 100 and 175 < y < 208)

body_d = pts_to_path(outer_body, 1.2)
if tail_hole:
    body_d += ' ' + pts_to_path(tail_hole, 1.0)

snout_d = pts_to_path(snout_loops[0], 0.8) if snout_loops else ''
flap_d = pts_to_path(flap_loops[0], 0.8) if flap_loops else ''
ear1_d = pts_to_path(ear1_loops[0], 0.8) if ear1_loops else ''
ear2_d = pts_to_path(ear2_loops[0], 0.8) if ear2_loops else ''
eye1_d = pts_to_path(eye1_loops[0], 0.6) if eye1_loops else ''
eye2_d = pts_to_path(eye2_loops[0], 0.6) if eye2_loops else ''
n1_d = pts_to_path(n1_loops[0], 0.6) if n1_loops else ''
n2_d = pts_to_path(n2_loops[0], 0.6) if n2_loops else ''

all_pts = outer_body
min_x = min(p[0] for p in all_pts)
max_x = max(p[0] for p in all_pts)
min_y = min(p[1] for p in all_pts)
max_y = max(p[1] for p in all_pts)

pad = 8
vx = min_x - pad
vy = min_y - pad
vw = (max_x - min_x) + pad * 2
vh = (max_y - min_y) + pad * 2

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vx:.1f} {vy:.1f} {vw:.1f} {vh:.1f}" fill="none">
  <!-- Pig Silhouette & Legs & Tail -->
  <path d="{body_d}" fill="#F8D5B4" fill-rule="evenodd" stroke="#F8D5B4" stroke-width="1" stroke-linejoin="round" />
  
  <!-- Underbelly Flap -->
  <path d="{flap_d}" fill="#F1ADA8" stroke="#F1ADA8" stroke-width="0.5" stroke-linejoin="round" />
  
  <!-- Left Ear Magenta Accent -->
  <path d="{ear1_d}" fill="#D35C8E" stroke="#D35C8E" stroke-width="0.5" stroke-linejoin="round" />
  
  <!-- Right Ear Magenta Fold -->
  <path d="{ear2_d}" fill="#D35C8E" stroke="#D35C8E" stroke-width="0.5" stroke-linejoin="round" />
  
  <!-- Snout -->
  <path d="{snout_d}" fill="#ED8686" stroke="#ED8686" stroke-width="0.5" stroke-linejoin="round" />
  
  <!-- Nostrils -->
  <path d="{n1_d}" fill="#282826" stroke="#282826" stroke-width="0.5" stroke-linejoin="round" />
  <path d="{n2_d}" fill="#282826" stroke="#282826" stroke-width="0.5" stroke-linejoin="round" />
  
  <!-- Eyes -->
  <path d="{eye1_d}" fill="#282826" stroke="#282826" stroke-width="0.5" stroke-linejoin="round" />
  <path d="{eye2_d}" fill="#282826" stroke="#282826" stroke-width="0.5" stroke-linejoin="round" />
</svg>
'''

with open('public/pig.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print(f'Generated public/pig.svg with viewBox="{vx:.1f} {vy:.1f} {vw:.1f} {vh:.1f}"')
