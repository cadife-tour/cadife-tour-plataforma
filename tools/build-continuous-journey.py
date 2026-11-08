"""Build the home-2 edit with ffmpeg/ffprobe (Python standard library only).

Cuts were inspected at 0.5 s intervals. Reverse only the cloud-to-destination
portion to return to the sky, never the cabin. Dissolve adjacent cloud frames.
Run from the repository root: python tools/build-continuous-journey.py
"""

import json
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/assets/hero/continuous-journey.mp4"
MANIFEST = ROOT / "src/features/travel-experience/config/continuousJourney.json"
FPS = 24
DISSOLVE = 0.5
CLOUD_BRIDGE_DURATION = 3.0
# destination, first fully exterior/dense cloud frame, destination reveal
CUTS = [
    ("franca", 7.0, 8.5),
    ("chile", 6.0, 7.0),
    ("argentina", 7.0, 8.0),
    ("peru", 4.0, 5.0),
    ("cruzeiros", 6.5, 8.0),
    ("portugal", 7.0, 8.0),
    ("espanha", 7.0, 8.0),
    ("italia", 6.5, 8.0),
    ("brasil", 6.0, 7.5),
    ("resorts", 4.5, 6.0),
]


def run(*args):
    subprocess.run([str(arg) for arg in args], check=True, cwd=ROOT)


def duration(path):
    return float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "csv=p=0", str(path),
    ], text=True).strip())


with tempfile.TemporaryDirectory(prefix="cadife-journey-") as temporary:
    clips = []
    chapters = []
    cloud_bridges = []
    bridge = Path(temporary) / "cloud-bridge.mp4"
    # Exterior sky only, before Paris first appears. Slow the cloud movement 2x.
    run("ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", "5.5", "-t", "1.5",
        "-i", ROOT / "public/assets/hero/destinations/franca-scrub.mp4",
        "-vf", f"setpts={CLOUD_BRIDGE_DURATION / 1.5}*(PTS-STARTPTS),fps={FPS},scale=1280:720,setsar=1",
        "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "23", "-g", "24", bridge)
    bridge_length = duration(bridge)
    cursor = 0.0
    for index, (destination, clouds, reveal) in enumerate(CUTS):
        source = ROOT / "public/assets/hero" / (
            "airplane-journey-scrub.mp4" if destination == "chile"
            else f"destinations/{destination}-scrub.mp4"
        )
        end = round(duration(source) * FPS) / FPS
        start = 0 if index == 0 else clouds
        clip = Path(temporary) / f"{index}.mp4"
        graph = (
            f"[0:v]fps={FPS},scale=1280:720,setsar=1,split[a][b];"
            f"[a]trim=start={start}:end={end},setpts=PTS-STARTPTS[forward];"
            f"[b]trim=start={clouds}:end={end},reverse,setpts=PTS-STARTPTS[back];"
            "[forward][back]concat=n=2:v=1:a=0,format=yuv420p[out]"
        )
        run("ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", source,
            "-filter_complex_threads", "1", "-filter_complex", graph, "-map", "[out]",
            "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "23", "-g", "24", clip)
        length = duration(clip)
        chapters.append({
            "destination": destination,
            "start": round(cursor, 4),
            "reveal": round(cursor + reveal - start, 4),
            "returnStart": round(cursor + end - start, 4),
            "end": round(cursor + length, 4),
            "sourceCloudStart": clouds,
        })
        clips.append((clip, length))
        cursor += length - DISSOLVE
        if index < len(CUTS) - 1:
            cloud_bridges.append({
                "start": round(cursor, 4),
                "clearStart": round(cursor + DISSOLVE, 4),
                "clearEnd": round(cursor + bridge_length - DISSOLVE, 4),
                "end": round(cursor + bridge_length, 4),
            })
            clips.append((bridge, bridge_length))
            cursor += bridge_length - DISSOLVE
        print(f"Prepared {destination}: cloud cut {clouds}s", flush=True)

    inputs = []
    filters = []
    for index, (clip, _) in enumerate(clips):
        inputs.extend(["-threads", "1", "-i", str(clip)])
        filters.append(f"[{index}:v]settb=AVTB,setpts=PTS-STARTPTS[v{index}]")
    elapsed = clips[0][1]
    previous = "v0"
    for index in range(1, len(clips)):
        output = f"x{index}"
        filters.append(
            f"[{previous}][v{index}]xfade=transition=fade:duration={DISSOLVE}:"
            f"offset={elapsed - DISSOLVE}[{output}]"
        )
        elapsed += clips[index][1] - DISSOLVE
        previous = output
    run("ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs,
        "-filter_complex_threads", "1", "-filter_complex", ";".join(filters),
        "-map", f"[{previous}]", "-an", "-c:v", "libx264", "-preset", "fast",
        "-crf", "24", "-pix_fmt", "yuv420p", "-g", "24", "-movflags", "+faststart", OUTPUT)
    MANIFEST.write_text(json.dumps({
        "src": "/assets/hero/continuous-journey.mp4",
        "poster": "/assets/hero/destinations/franca-poster.webp",
        "duration": duration(OUTPUT),
        "cloudDissolve": DISSOLVE,
        "cloudBridges": cloud_bridges,
        "chapters": chapters,
    }, indent=2) + "\n", encoding="utf-8")
    print(f"Created {OUTPUT}: {duration(OUTPUT):.2f}s, {OUTPUT.stat().st_size / 1e6:.1f} MB")
