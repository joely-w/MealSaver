const video = $("#video")
const canvas = $("#canvas")
// Get access to the camera!
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
        //video.src = window.URL.createObjectURL(stream);
        video[0].srcObject = stream;
        video[0].play();
    });
}
// Elements for taking the snapshot
const context = canvas[0].getContext('2d');

// Trigger photo take
document.getElementById("snap").addEventListener("click", function () {
    $("#snap").hide();
    $("#retry").show();
    $("#accept").show();
    video.hide()
    canvas.show();
    context.drawImage(video[0], 0, 0, 400, 300);

});

$("#retry").click(() => {
    $("#snap").show();
    $("#retry").hide();
    $("#accept").hide();
    video.show();
    canvas.hide()
})
$("#accept").click(() => {

})