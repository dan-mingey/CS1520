
function GetCategories()
{
    var httpRequest = new XMLHttpRequest();
	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	httpRequest.onreadystatechange = function() {
        DisplayCategories(httpRequest);
    };
	httpRequest.open("get", "/cats");
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	httpRequest.send();
}


function DisplayCategories(httpRequest)
{
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		if (httpRequest.status === 200) {
			
			var categories = JSON.parse(httpRequest.responseText)
			console.log(categories);
			
			var select = document.getElementById("PurchaseCategory")
			var option = document.createElement("option")
			option.value = categories[0]["category"]
			option.innerHTML = categories[0]["category"]
			option.setAttribute("id", categories[0]['category']+"_option");
			select.appendChild(option);
			
			catTable = document.getElementById("category_summary")
			newCatRow = catTable.insertRow();
			newCatCell = newCatRow.insertCell();
			var amount_spent = categories[0]["money_spent"];
			var cat_info = document.createTextNode("You have spent: $"+amount_spent+" on uncategorized pruchases")
			newCatCell.setAttribute("id", categories[0]['category']);
			newCatCell.appendChild(cat_info);

        } else if(httpRequest.status === 201) {
			
			new_category = JSON.parse(httpRequest.responseText)
			console.log(new_category);

			catTable = document.getElementById("category_summary")
			newCatRow = catTable.insertRow();
			newCatCell = newCatRow.insertCell();
			var amount_left = new_category["monthly_limit"] - new_category["money_spent"];
			var cat_info = document.createTextNode(new_category['category'] + ":     "+ amount_left + "/"+new_category["monthly_limit"])
			newCatCell.appendChild(cat_info);
			newCatCell.setAttribute("id", new_category['category']);
			
			//add the category to the make a purchase form
			var select = document.getElementById("PurchaseCategory")
			var option = document.createElement("option")
			option.setAttribute("id", new_category['category']+"_option_purchase");
			option.value = new_category["category"]
			option.innerHTML = new_category["category"]
			select.appendChild(option);

			// add the category to the delete category form
			var option2 = document.createElement("option")
			option2.setAttribute("id", new_category['category']+"_option_delete");
			option2.value = new_category["category"]
			option2.innerHTML = new_category["category"]
			var del_select = document.getElementById("CategoryToDelete");
			del_select.appendChild(option2);
			
        }
        else {
			alert("There was a problem with the post request.");
		}
	}
}

function DisplayPurchases(httpRequest)
{
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		if (httpRequest.status === 201) {
			var category_to_update = JSON.parse(httpRequest.responseText);
			console.log(category_to_update);

			cat = document.getElementById(category_to_update['category']);
			var amount_left = category_to_update["monthly_limit"] - category_to_update["money_spent"];
			cat.innerHTML = category_to_update['category'] + ":  $"+amount_left+"/"+category_to_update["monthly_limit"];
			if(amount_left == 0)
			{
				alert("You have reached your budget for "+category_to_update['category']);
			} else if(amount_left < 0)
			{
				alert("You exceeded your budget for "+category_to_update['category']);
			}
		} else if(httpRequest.status === 200) {
			var category_to_update = JSON.parse(httpRequest.responseText);
			var amount_spent = category_to_update["money_spent"];
			cat = document.getElementById(category_to_update['category']);
			cat.innerHTML = "You have spent: $"+amount_spent+" on uncategorized pruchases"
		} else if(httpRequest.status === 202) {
			alert("The purchase you added was not for this current month, it did not affect the monthly budget");
		} else {
			alert("There was a problem with the post request.");
		}
	}
}

// CREATE A NEW CATEGORY
// MAKE A POST TO CATS IN BUDGET.PY
function NewCategory()
{

	//retrieve the information from the form where the user creates the category
    var category_name = document.getElementById("CatName").value;
    var monthly_limit = document.getElementById("MonthlyLimit").value;
	
	var null_if_new_category = document.getElementById(category_name);
	if(null_if_new_category != null)
	{
		alert("That categoy already exists!");
	} else if(category_name.length == 0) {
		alert("Enter a valid category name")
	} else if(monthly_limit.length == 0) {
		alert("Enter a vlid monthly limit")
	} else {
		//retrieve the information from the form where the user creates the category
		var category_name = document.getElementById("CatName").value;
		var monthly_limit = document.getElementById("MonthlyLimit").value;
	
		var httpRequest = new XMLHttpRequest();
		if (!httpRequest) {
			alert('Giving up :( Cannot create an XMLHTTP instance');
			return false;
		}
		httpRequest.onreadystatechange = function() {
			DisplayCategories(httpRequest);
		};
		httpRequest.open("post", "/cats");
		httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	
		var data = "category_name=" + category_name + "&monthly_limit=" + monthly_limit;
		httpRequest.send(data);
	}

	
}

function NewPurchase()
{
	//retrieve the information from the form where the user creates the category
	var purchase_amount = document.getElementById("PurchaseAmount").value;
	var name_of_purchase = document.getElementById("PurchaseName").value;
	var date_of_purchase = document.getElementById("DateOfPurchase").value;
	var category_of_purchase = document.getElementById("PurchaseCategory").value;
	
	if(purchase_amount.length==0)
	{
		alert("enter a value for your purchase");
	} else if(name_of_purchase.length==0)
	{
		alert("enter a valid name for your purchase");
	} else if(date_of_purchase.length==0)
	{
		alert("enter a valid date for your purchase");
	} else {

		var httpRequest = new XMLHttpRequest();
		if (!httpRequest) {
			alert('Giving up :( Cannot create an XMLHTTP instance');
			return false;
		}
		httpRequest.onreadystatechange = function() {
			DisplayPurchases(httpRequest);
		};
		httpRequest.open("post", "/purchases");
		httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		
		var data = "name_of_purchase=" + name_of_purchase + "&date_of_purchase=" + date_of_purchase+ "&category_of_purchase=" + category_of_purchase + "&purchase_amount=" + purchase_amount;
		httpRequest.send(data);
	}
	

    
}

function RemoveCategories(httpRequest, category_to_delete)
{
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		if (httpRequest.status === 200) {
			
			//remove the category as an option for deleting a category and a purchase category
			var option1_to_delete = document.getElementById(category_to_delete+"_option_delete")
			option1_to_delete.parentNode.removeChild(option1_to_delete);

			var option2_to_delete = document.getElementById(category_to_delete+"_option_purchase")
			option2_to_delete.parentNode.removeChild(option2_to_delete);

			//remove the category from the displayed budget statistics
			var cat_element_to_delete = document.getElementById(category_to_delete);
			cat_element_to_delete.parentNode.removeChild(cat_element_to_delete);

			// update the uncategorized purchases
			var updated_uncategorized = JSON.parse(httpRequest.responseText)
			console.log(updated_uncategorized);
			var uncategorized = document.getElementById("uncategorized")
			var amount_spent = updated_uncategorized["money_spent"];
			uncategorized.innerHTML = "You have spent: $"+amount_spent+" on uncategorized pruchases"
			
		} else {
			alert("There was a problem with the post request.");
		}
	}
}

function DeleteCategory()
{
	var category_to_delete = document.getElementById("CategoryToDelete").value;
	if(category_to_delete.length == 0)
	{
		alert("There are no categories to delete!")
	} else {
		var httpRequest = new XMLHttpRequest();
		if (!httpRequest) {
			alert('Giving up :( Cannot create an XMLHTTP instance');
			return false;
		}
		httpRequest.onreadystatechange = function() {
			RemoveCategories(httpRequest,category_to_delete);
		};
		httpRequest.open("delete", "/cats");
		httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		

		var category_to_delete = document.getElementById("CategoryToDelete").value;
		var data = "category_to_delete=" + category_to_delete;
		httpRequest.send(data);
	}
	
}

function AddEventListeners() {
    document.getElementById("SubmitCategory").addEventListener("click", NewCategory, true);
	document.getElementById("SubmitPurchase").addEventListener("click", NewPurchase, true);
	document.getElementById("DeleteCategory").addEventListener("click", DeleteCategory, true);
}

window.onload = function setup() {
    GetCategories();
    AddEventListeners();
}
