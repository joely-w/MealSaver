function getShoppingList() {
    console.log('Getting')
    $.get('/api/list/shopping', async (res) => {
        res.forEach(item => {
            $("#items").append(`<tr class="row"><td>${item.title}</td><td>${item.num}</td></tr>`)
        })
    })
}

getShoppingList()