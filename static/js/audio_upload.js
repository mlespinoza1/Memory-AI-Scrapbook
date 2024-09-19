document.addEventListener('DOMContentLoaded', function() {
    const audioFileInput = document.getElementById('audioFileInput');
    const uploadAudioButton = document.getElementById('uploadAudio');

    uploadAudioButton.addEventListener('click', function() {
        audioFileInput.click();
    });

    audioFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            uploadAudioFile(file);
        }
    });

    function uploadAudioFile(file) {
        const formData = new FormData();
        formData.append('audio', file);

        fetch('/upload_audio', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Audio file uploaded successfully!');
                // You can add more functionality here, like updating the UI or refreshing the memory grid
            } else {
                alert('Failed to upload audio file. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error uploading audio file:', error);
            alert('An error occurred while uploading the audio file. Please try again.');
        });
    }
});
