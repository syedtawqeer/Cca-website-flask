from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import io

app = Flask(__name__)
CORS(app)  

model = tf.keras.models.load_model('model.h5')
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image = request.files['image']
    img = Image.open(io.BytesIO(image.read()))
    img = img.resize((224, 224)) 
    img = tf.keras.preprocessing.image.img_to_array(img)
    img = np.expand_dims(img, axis=0)  

    prediction = model.predict(img)
    flattened_prediction = prediction.mean(axis=(1, 2, 3)).flatten()
    spad_value = float(np.mean(flattened_prediction))

    return jsonify({'spad_value': spad_value})

if __name__ == '__main__':
    app.run(debug=True)
