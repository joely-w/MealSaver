function listInventory() {
    $.ajax({
        type: "GET",
        url: "/api/list/inventory",
        success: (res) => {
            for (let item of res) {
                $("#items").append(`<tr class="row"><td>${item.title}</td><td>${item.num}</td></tr>`)
            }
        }

    })
}

listInventory()