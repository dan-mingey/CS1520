var timeoutID;
var timeout = 5000;

function setup() {
	document.getElementById("submit_message").addEventListener("click", makePost, true);

	timeoutID = window.setTimeout(poller, timeout);
}

function makePost() {
	var httpRequest = new XMLHttpRequest();
	//console.log("in make post")
	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	var message = document.getElementById("message_text").value

	httpRequest.onreadystatechange = function() { 
		
		//console.log("111111")
		handlePost(httpRequest) 
	
	};

	httpRequest.open("POST", "/message_sent");
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	var d = new Date();
	var data = "message_text=" + message + "&current_time=" + (d.getTime());
	httpRequest.send(data);
}

function handlePost(httpRequest) {
	//console.log("222222")
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		if (httpRequest.status === 200) {
			//addRow(row);
			//clearInput();
			//console.log("This is where it should be adding the new message")
			// this will add the message for the current user
			addMessage(JSON.parse(httpRequest.response))

			// add the message to the bottom of list of messages
			// i need the name of the message creator but this isnt available right now

		} else {
			alert("There was a problem with the post request.");
		}
	}
}

function poller() {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	httpRequest.onreadystatechange = function() { handlePoll(httpRequest) };
	//httpRequest.open("GET", "/messages");
	//httpRequest.send();

	httpRequest.open("POST", "/get_new_messages");
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	
	var d = new Date();

	var data = "current_time=" + (d.getTime()-timeout);
	httpRequest.send(data)
}

function handlePoll(httpRequest) {
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		if (httpRequest.status === 200 && httpRequest.response != "null") {
			// only get the messages that are new
			// this means messages that have a time stamp > time since page load 
			// time since page load should be reset every time the the polling takes place
			var rows = JSON.parse(httpRequest.responseText);
      		//console.log(rows)
			for (var i = 0; i < rows.length; i++) {
				addMessage(rows[i]);
			}

			timeoutID = window.setTimeout(poller, timeout);

		} else if (httpRequest.response == "null")
		{
			
			//console.log("chatroom was deleted")
			setTimeout(function() {
		
				alert("This chatroom has been deleted!");
				location.replace("/chatpage");
			}, 10);
			
		}
		else {
			alert("something wrong")
		}
	}
}

function addMessage(message) {
  	//console.log(message.message_text)

	var tableRef = document.getElementById("messages");
	var newRow   = tableRef.insertRow();
	var newCell = newRow.insertCell();
	var newMessage = document.createTextNode(message.message_creator+": "+message.message_text)
	newCell.appendChild(newMessage)
}
