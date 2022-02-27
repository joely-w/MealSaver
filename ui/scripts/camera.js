const video = $("#video")
const canvas = $("#canvas");
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
    canvas[0].toBlob(async (blob) => {
        const form_data = new FormData();
        form_data.append('file', blob);
        $.ajax({
            type: 'POST',
            contentType: false,
            cache: false,
            processData: false,
            url: '/api/upload/receipt',
            data: form_data,
            success: data => loadInventory(data)
        })
    });

})

function loadInventory(data) {

    let i = 0;
    for (const key of Object.keys(data)) {
        i += 1;
        $("#items").append(`<label>${i}. <span>${key}</span><input name="${key}" type="number" value="${data[key]}"><a><i onclick="$(this).closest('label').remove()" class="fa fa-trash-o" aria-hidden="true"></i></a></label>`)
    }
    $("#inventory").show();
    $("#receipt").hide();
}

$("#save").click(() => {
    $.ajax({
        type: "POST",
        url: "/api/save/inventory",
        data: $("#items").serialize(),
        success: (res) => {
            window.location.href='/inventory.html'
        }

    })
})
// TODO add search to add elements in the list
// TODO add back button on check list