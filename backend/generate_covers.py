import pymysql
import requests
import os
import tempfile
import fitz  # pip install PyMuPDF
import qiniu # pip install qiniu
import cv2   # pip install opencv-python
import win32com.client # pip install pywin32
import pythoncom
from io import BytesIO

# Qiniu Configuration
access_key = 'zfc9y0LL6rUe5b6dz0c43yOx7cKOxtHn4bON76rz'
secret_key = 'yoJYJH0AnqKFFcSVJUONwA-OSxwP4jzFvAlefJwL'
bucket_name = 'edwell-k12'
domain = 'http://oss.gut9.cn/'
q = qiniu.Auth(access_key, secret_key)

def upload_image_to_qiniu(img_data, key):
    token = q.upload_token(bucket_name, key, 3600)
    ret, info = qiniu.put_data(token, key, img_data)
    if info.status_code == 200:
        return domain + key
    else:
        raise Exception("Upload failed")

def download_to_temp(file_url, suffix):
    print(f"Downloading {file_url}...", flush=True)
    response = requests.get(file_url, timeout=30)
    response.raise_for_status()
    fd, temp_path = tempfile.mkstemp(suffix=suffix)
    with os.fdopen(fd, 'wb') as f:
        f.write(response.content)
    return temp_path

def generate_pdf_cover(temp_path):
    doc = fitz.open(temp_path)
    if doc.page_count > 0:
        page = doc.load_page(0)
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        doc.close()
        return pix.tobytes("jpeg")
    doc.close()
    return None

def generate_video_cover(temp_path):
    cap = cv2.VideoCapture(temp_path)
    success, frame = cap.read()
    cap.release()
    if success:
        # Encode to JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        if ret:
            return buffer.tobytes()
    return None

def generate_word_cover(temp_path):
    # Word -> PDF -> Image
    pythoncom.CoInitialize()
    word = win32com.client.Dispatch("Word.Application")
    word.Visible = False
    word.DisplayAlerts = 0
    
    pdf_path = temp_path + ".pdf"
    try:
        doc = word.Documents.Open(temp_path, ReadOnly=True)
        # 17 is the enum for wdFormatPDF
        doc.SaveAs(pdf_path, FileFormat=17)
        doc.Close()
        word.Quit()
        
        # Now read the PDF
        img_data = generate_pdf_cover(pdf_path)
        os.remove(pdf_path)
        return img_data
    except Exception as e:
        word.Quit()
        raise e
    finally:
        pythoncom.CoUninitialize()

def generate_ppt_cover(temp_path):
    # PPT -> JPG
    pythoncom.CoInitialize()
    powerpoint = win32com.client.Dispatch("PowerPoint.Application")
    powerpoint.DisplayAlerts = 1  # 1 is ppAlertsNone in PPT
    # PowerPoint requires Window to be visible or minimized in some versions, but let's try without
    
    jpg_path = temp_path + "_cover"
    try:
        presentation = powerpoint.Presentations.Open(temp_path, ReadOnly=True, WithWindow=False)
        # 17 is the enum for ppSaveAsJPG
        # This saves a folder with slides, but if we specify a file it might save Slide1.JPG
        presentation.Slides[1].Export(jpg_path + ".jpg", "JPG", 800, 600)
        presentation.Close()
        powerpoint.Quit()
        
        with open(jpg_path + ".jpg", "rb") as f:
            img_data = f.read()
        os.remove(jpg_path + ".jpg")
        return img_data
    except Exception as e:
        powerpoint.Quit()
        raise e
    finally:
        pythoncom.CoUninitialize()


def main():
    conn = pymysql.connect(host='localhost', user='root', password='root', database='xueyuanhui')
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    # Find resources without a custom cover
    cursor.execute("SELECT id, title, file_url, file_type FROM resource WHERE (cover_url = '' OR cover_url LIKE '%cat.jpeg%')")
    resources = cursor.fetchall()
    
    print(f"Found {len(resources)} resources needing covers.", flush=True)
    
    for i, res in enumerate(resources):
        res_id = res['id']
        file_url = res['file_url']
        file_type = res['file_type'].upper()
        
        temp_path = None
        try:
            temp_path = download_to_temp(file_url, "." + file_type.lower())
            img_data = None
            
            if file_type == 'PDF':
                img_data = generate_pdf_cover(temp_path)
            elif file_type in ['MP4', 'VIDEO']:
                img_data = generate_video_cover(temp_path)
            elif file_type in ['DOC', 'DOCX']:
                img_data = generate_word_cover(temp_path)
            elif file_type in ['PPT', 'PPTX']:
                img_data = generate_ppt_cover(temp_path)
            else:
                print(f"[{i+1}/{len(resources)}] Skipping unsupported type {file_type} for {res['title']}", flush=True)
                continue
                
            if img_data:
                cover_key = f"covers/{res_id}_cover.jpg"
                cover_url = upload_image_to_qiniu(img_data, cover_key)
                
                cursor.execute("UPDATE resource SET cover_url = %s WHERE id = %s", (cover_url, res_id))
                conn.commit()
                print(f"[{i+1}/{len(resources)}] Updated cover for {res['title']}: {cover_url}", flush=True)
            else:
                print(f"[{i+1}/{len(resources)}] Could not extract cover for {res['title']}", flush=True)
                
        except Exception as e:
            print(f"[{i+1}/{len(resources)}] Failed to process {res['title']}: {e}", flush=True)
        finally:
            if temp_path and os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except:
                    pass

    cursor.close()
    conn.close()

if __name__ == '__main__':
    main()
