document.addEventListener('DOMContentLoaded', function() {
    const uploadAudioBtn = document.getElementById('uploadAudio');
    const audioFileInput = document.getElementById('audioFileInput');

    uploadAudioBtn.addEventListener('click', function() {
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
                alert('Audio uploaded and transcribed successfully. Transcription: ' + data.transcription);
                // Here you can add code to display the transcription on the page or create a new memory card
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while uploading the audio file.');
        });
    }
});
