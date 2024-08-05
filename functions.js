// Function to get the current date
function getCurrentDate() {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	//write the month in letters
	if (month == 1) {
		month = "janvier";
	} else if (month == 2) {
		month = "février";
	} else if (month == 3) {
		month = "mars";
	} else if (month == 4) {
		month = "avril";
	} else if (month == 5) {
		month = "mai";
	} else if (month == 6) {
		month = "juin";
	} else if (month == 7) {
		month = "juillet";
	} else if (month == 8) {
		month = "août";
	} else if (month == 9) {
		month = "septembre";
	} else if (month == 10) {
		month = "octobre";
	} else if (month == 11) {
		month = "novembre";
	} else if (month == 12) {
		month = "décembre";
	}
	var year = date.getFullYear();
	return day + " " + month + " " + year;
}

// Function to get the current time
function getCurrentTime() {
	var date = new Date();
	var hour = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	return hour + ":" + minutes + ":" + seconds;
}

// Function to get the current date and time

function getCurrentDateTime() {
	return getCurrentDate() + " " + getCurrentTime();
}

// bingo game 
function bingo() {
    var bingo = Math.floor(Math.random() * 100);
    return bingo;
}


// Export the functions
module.exports = {
	getCurrentDate,
	getCurrentTime,
	getCurrentDateTime,
};
