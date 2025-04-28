document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const uploadForm = document.getElementById('uploadForm');
    const outputDiv = document.getElementById('output');

    imageInput.addEventListener('change', (event) => {
        outputDiv.innerHTML = '';

        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Leaf Image Preview';
                img.style.maxWidth = '20%';
                img.style.height = '40%';

                outputDiv.appendChild(img);
            };

            reader.readAsDataURL(file);
        }
    });

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        const imageInput = document.getElementById('imageInput').files[0];
        
        if (!imageInput) {
            outputDiv.textContent = 'Please select an image.';
            return;
        }
        
        formData.append('image', imageInput);
        
        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                outputDiv.innerHTML += `<p>Predicted SPAD Value: ${data.spad_value}</p>`;
            } else {
                outputDiv.textContent = 'Error in prediction. Please try again.';
            }
        } catch (error) {
            outputDiv.textContent = 'Error: ' + error.message;
        }
    });
});
