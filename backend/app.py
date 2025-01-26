from flask import Flask, request, send_file
from flask_cors import CORS
import subprocess
import tempfile
import json
import os

app = Flask(__name__)
CORS(app)

# Endpoint to upload video and save subtitle data
@app.route('/save_subtitles', methods=['POST'])
def save_subtitles():
    print("aaaaaaaaaaaaaaaaa", flush=True)
    # Get the video file from the request
    file = request.files['file']
    subtitles = request.form.get('subtitles')
    subtitles = json.loads(subtitles)

    # Save the file to a temporary directory
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_input_file:
        file.save(temp_input_file.name)
        print("bbbbbbbbbbbbbbbbbbbbbb", flush=True)

        # Process the video with subtitles
        output_path = render_video(temp_input_file.name, subtitles)
    
    print("dddddddddddddddddddddddddddddddddddddd", flush=True)

    # Send the processed video back to the client
    return send_file(output_path, as_attachment=True, download_name="output.mp4", mimetype="video/mp4")

# Function to render video with subtitles using FFmpeg
def render_video(input_path, subtitles):

    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_output_file:
        drawtext_commands = ",".join([
            f"drawtext=text='{s['text']}':x={s['x']}:y={s['y']}:fontsize={s['size']}:fontcolor={s['color']}:enable='between(t,{s['start']},{s['end']})':fontfile=fonts/Arial.ttf"
            for s in subtitles
        ])

        print("cccccccccccccccccccccccccccccccc", flush=True)

        # Run the FFmpeg command
        command = [
            "ffmpeg", "-y", "-i", input_path, "-vf", drawtext_commands, temp_output_file.name
        ]
        subprocess.run(command)

        print(f"File path: {temp_output_file.name}", flush=True)
        print(f"File size: {os.path.getsize(temp_output_file.name)} bytes", flush=True)
        temp_output_file.flush()

        return temp_output_file.name

if __name__ == "__main__":
    #app.run(debug=True)
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)