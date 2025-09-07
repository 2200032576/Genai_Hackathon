import sys
import os
from google.cloud import vision
from google.oauth2 import service_account
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# Path to your service account JSON key (raw string to avoid unicodeescape issues)
SERVICE_ACCOUNT_JSON = r"C:\Users\jyoth\Downloads\ocr-rag-project-061fa931dd4a.json"

def save_text_to_pdf(text, output_pdf):
    c = canvas.Canvas(output_pdf, pagesize=letter)
    width, height = letter
    x, y = 50, height - 50

    for line in text.splitlines():
        if y < 50:  # Start new page
            c.showPage()
            y = height - 50
        c.drawString(x, y, line)
        y -= 15  # Line spacing

    c.save()
    print(f"📄 PDF saved to {output_pdf}")

def extract_text_from_image(image_path):
    # Validate image path
    if not os.path.exists(image_path):
        print(f"❌ File not found: {image_path}")
        return ""

    if os.path.getsize(image_path) == 0:
        print(f"❌ File is empty: {image_path}")
        return ""

    # Load credentials and client
    creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_JSON)
    client = vision.ImageAnnotatorClient(credentials=creds)

    # Read image
    with open(image_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    # Call Vision API
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if not texts:
        print("❌ No text found in image.")
        return ""

    extracted_text = texts[0].description
    print("✅ Extracted Text:\n")
    print(extracted_text)

    # Save .txt file
    base_name = os.path.splitext(os.path.basename(image_path))[0]
    txt_file = base_name + ".txt"
    pdf_file = base_name + ".pdf"

    with open(txt_file, "w", encoding="utf-8") as f:
        f.write(extracted_text)
    print(f"\n📂 Text saved to {txt_file}")

    # Save .pdf file
    save_text_to_pdf(extracted_text, pdf_file)

    return extracted_text


if __name__ == "__main__":
    if len(sys.argv) < 2:
        # Default to test.png
        img_path = r"C:\Users\jyoth\OneDrive\Desktop\Imgtotext\Images\test.png"
    else:
        img_path = sys.argv[1]

    extract_text_from_image(img_path)
