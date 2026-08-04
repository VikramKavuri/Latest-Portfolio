from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "models" / "concepts"
DEST = ROOT / "public" / "models" / "cutouts"


def edge_background_color(rgb: np.ndarray) -> np.ndarray:
    h, w, _ = rgb.shape
    strips = np.concatenate(
        [
            rgb[:24, :, :].reshape(-1, 3),
            rgb[h - 24 :, :, :].reshape(-1, 3),
            rgb[:, :24, :].reshape(-1, 3),
            rgb[:, w - 24 :, :].reshape(-1, 3),
        ],
        axis=0,
    )
    return np.median(strips, axis=0)


def flood_background(rgb: np.ndarray, bg: np.ndarray, threshold: float = 48.0) -> np.ndarray:
    h, w, _ = rgb.shape
    diff = np.linalg.norm(rgb.astype(np.float32) - bg.astype(np.float32), axis=2)
    similar = diff < threshold
    visited = np.zeros((h, w), dtype=bool)
    q = deque()

    def push(y: int, x: int) -> None:
        if 0 <= y < h and 0 <= x < w and similar[y, x] and not visited[y, x]:
            visited[y, x] = True
            q.append((y, x))

    step = max(1, min(h, w) // 96)
    for x in range(0, w, step):
        push(0, x)
        push(h - 1, x)
    for y in range(0, h, step):
        push(y, 0)
        push(y, w - 1)

    while q:
        y, x = q.popleft()
        push(y - 1, x)
        push(y + 1, x)
        push(y, x - 1)
        push(y, x + 1)

    return visited


def make_cutout(src_path: Path, dest_path: Path) -> None:
    image = Image.open(src_path).convert("RGBA")
    rgb = np.asarray(image.convert("RGB"))
    bg = edge_background_color(rgb)
    background = flood_background(rgb, bg)

    # Conservative mask: only remove background connected to the image boundary.
    alpha = np.where(background, 0, 255).astype(np.uint8)
    alpha_img = Image.fromarray(alpha, mode="L")
    alpha_img = alpha_img.filter(ImageFilter.MinFilter(3))
    alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(1.1))

    out = image.copy()
    out.putalpha(alpha_img)
    out.save(dest_path)


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    for src_path in sorted(SRC.glob("[0-9][0-9]-*.png")):
        dest_path = DEST / src_path.name
        make_cutout(src_path, dest_path)
        print(f"wrote {dest_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
