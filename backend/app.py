from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import subprocess

app = Flask(__name__)
CORS(app)

# Temporary storage paths
UPLOAD_FOLDER = './static/uploads'
PROCESSED_FOLDER = './static/processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# Endpoint to upload video
@app.route('/upload', methods=['POST'])
def upload_video():
    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    print(file_path)
    file.save(file_path)
    return jsonify({"message": "Video uploaded successfully!", "path": file_path})

# Endpoint to save subtitle data
@app.route('/save_subtitles', methods=['POST'])
def save_subtitles():
    subtitles = request.json['subtitles']
    video_path = request.json['videoPath']
    output_path = render_video(video_path, subtitles)
    return jsonify({"message": "Video processed successfully!", "outputPath": output_path})

# Serve the processed video
@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(PROCESSED_FOLDER, filename)

# Function to render video with subtitles using FFmpeg
def render_video(input_path, subtitles):
    output_path = os.path.join(PROCESSED_FOLDER, "output.mp4")
    drawtext_commands = ",".join([
        f"drawtext=text='{s['text']}':x={s['x']}:y={s['y']}:fontsize={s['size']}:fontcolor={s['color']}:enable='between(t,{s['start']},{s['end']})':fontfile='/Windows/Fonts/arial.ttf'"
        for s in subtitles
    ])
    print(input_path)
    command = [
        "ffmpeg", "-i", input_path, "-vf", drawtext_commands, output_path
    ]
    subprocess.run(command)
    return output_path

if __name__ == "__main__":
    app.run(debug=True)