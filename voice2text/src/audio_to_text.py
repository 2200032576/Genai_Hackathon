import sys
import os
from google.cloud import speech
from google.oauth2 import service_account

# Path to your service account JSON key
SERVICE_ACCOUNT_JSON = r"C:\Users\jyoth\Downloads\ocr-rag-project-061fa931dd4a.json"


def get_config(file_path):
    """Return the correct Speech-to-Text config based on file extension."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".mp3":
        return speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.MP3,
            sample_rate_hertz=44100,
            language_code="en-US"
        )
    elif ext == ".wav":
        return speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="en-US"
        )
    else:
        raise ValueError(f"❌ Unsupported audio format: {ext}")


def transcribe_audio(file_path):
    """Transcribe speech from an audio file to text."""
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return

    print("🎧 Transcribing audio...")

    # Load credentials
    creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_JSON)
    client = speech.SpeechClient(credentials=creds)

    # Read audio file
    with open(file_path, "rb") as f:
        content = f.read()

    audio = speech.RecognitionAudio(content=content)

    # Choose config automatically
    config = get_config(file_path)

    # Call API
    response = client.recognize(config=config, audio=audio)

    if not response.results:
        print("❌ No transcription found.")
        return

    transcript = "\n".join([result.alternatives[0].transcript for result in response.results])
    print("✅ Transcription:\n")
    print(transcript)

    # Save to .txt
    output_file = os.path.splitext(os.path.basename(file_path))[0] + ".txt"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(transcript)

    print(f"\n📂 Transcription saved to {output_file}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("⚠️ Usage: python audio_to_text.py <path_to_audio_file>")
    else:
        transcribe_audio(sys.argv[1])
