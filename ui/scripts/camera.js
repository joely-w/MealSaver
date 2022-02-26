const video = document.getElementById('video');

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });
}
// Elements for taking the snapshot
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Trigger photo take
document.getElementById("snap").addEventListener("click", function()
{
    video.style.display = "none"
    canvas.style.display = "block"
    context.drawImage(video, 0, 0, 640, 480);
});