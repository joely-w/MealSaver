function listInventory() {
    $.ajax({
        type: "GET",
        url: "/api/list/inventory",
        success: (res) => {
            for (let item of res) {
                console.log(item)
                $("#items").append(`<tr class="row"><td>${item.title}</td><td>${item.num}</td><td><button id=${item.item_id} type="button" class="addIngredient" data-id=${item.item_id} data-title=${item.title}></button></td></tr>`)
            }
        }

    })
}

listInventory()
let ingredientsList = [];
$(document).ready(function(){
    $(".addIngredient").click(function(){
        ingredientsList.push($(this).data("title"));
        $("#"+$(this).data("id")).css("display", "none");
        console.log(ingredientsList);
        $.post("/api/list/recipes",{data: ingredientsList}, (res)=>{
            $("#recipeList").empty();
            console.log(res);
            for (let i in res){
                $("#recipeList").append("<li><a href="+res[i]["recipe"]["url"]+"</a>"+res[i]["recipe"]["label"]+"</li>");
            }
        });
    });
});

