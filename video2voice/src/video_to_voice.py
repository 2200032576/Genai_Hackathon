import os
import sys
from moviepy.editor import VideoFileClip

def extract_audio(video_path, output_format="wav", rate=16000):
    # Ensure outputs folder exists
    os.makedirs("../outputs", exist_ok=True)

    # Load video
    clip = VideoFileClip(video_path)
    
    # Set output filename
    base = os.path.splitext(os.path.basename(video_path))[0]
    audio_path = f"../outputs/{base}.{output_format}"

    # Export audio
    print(f"🎬 Extracting audio from: {video_path}")
    print(f"💾 Saving to: {audio_path}")

    if output_format == "wav":
        clip.audio.write_audiofile(audio_path, fps=rate)
    else:
        # Falls back to wav if ffmpeg missing
        try:
            clip.audio.write_audiofile(audio_path, codec="mp3", fps=rate)
        except Exception:
            print("⚠️ MP3 export failed (no ffmpeg). Saving WAV instead.")
            audio_path = f"../outputs/{base}.wav"
            clip.audio.write_audiofile(audio_path, fps=rate)

    clip.close()
    print("✅ Done!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python video_to_voice.py <video_path>")
        sys.exit(1)

    video_path = sys.argv[1]
    extract_audio(video_path)
