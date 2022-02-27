function listInventory() {
    $.ajax({
        type: "GET",
        url: "/api/list/inventory",
        success: (res) => {
            for (let item of res) {
                console.log(item)
                $("#items").append(`<tr class="row"><td>${item.title}</td><td>${item.num}</td><td><button type="button" class="addIngredient" data-id=${item.item_id} data-title=${item.title}></button></td></tr>`)
            }
        }

    })
}

listInventory()
let ingredientsList = [];
$(document).ready(function(){
    $(".addIngredient").click(function(){
        alert($(this).data("id"));
        alert($(this).data("title"));
        $("#ingredientsInRecipe").append(`<li>`+$(this).data("title")+"</li>");
        ingredientsList.push($(this).data("title"));
        console.log(ingredientsList);
        $.post("/api/list/recipes",{data: ingredientsList}, (res)=>{
            console.log(res);
            for (let i in res){
                $("#recipeList").append("<li>"+res[i]["recipe"]["label"]+"</li");
            }
        });
    });
g
});

