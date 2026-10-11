import os
import subprocess
import sys

ffmpeg_bin = r"C:\Users\Furkan\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin"

songs = [
    ("seni-yazdim.mp4", "https://www.youtube.com/watch?v=wtOHNhG0EZc"),
    ("kullenen-ask.mp4", "https://www.youtube.com/watch?v=0kF1R9U4P30"),
    ("herseyim-oldun.mp4", "https://www.youtube.com/watch?v=BWMvHaPCNT4"),
    ("bir-alo-de.mp4", "https://www.youtube.com/watch?v=kYJm3sLqGls"),
    ("sen-evlisin.mp4", "https://www.youtube.com/watch?v=wromYNBB66M"),
    ("deli-gibi-yuregime-zor.mp4", "https://www.youtube.com/watch?v=I5yECnaLjms"),
    ("de-get-yalan-dunya.mp4", "https://www.youtube.com/watch?v=dfqEPSkS1JE"),
    ("pismanliklar-diliyorum.mp4", "https://www.youtube.com/watch?v=HTup6DI0X88")
]

os.makedirs("assets", exist_ok=True)

for filename, url in songs:
    target_path = os.path.join("assets", filename)
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1000000:
        print(f"Already exists: {filename}")
        continue
    
    print(f"\n--- Downloading: {filename} from {url} ---")
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "--ffmpeg-location", ffmpeg_bin,
        "--js-runtimes", "node",
        "-f", "bestvideo[height<=720]+bestaudio/best[height<=720]",
        "--merge-output-format", "mp4",
        "-o", target_path,
        url
    ]
    try:
        subprocess.run(cmd, check=True)
        print(f"Success: {filename}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

print("\n--- ALL SONGS DOWNLOAD PROCESS FINISHED ---")
