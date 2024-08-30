// const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
// const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

const fetchData = async function() {
	let data = await fetch(`https://api.nasa.gov/planetary/apod?api_key=2JIAqqYrlhYv6fb3EqRIBA1IDz9BitqNQReEu8yK`);
	// &date=2024-08-09
	let parsed = await data.json();
	console.log(parsed);
	document.querySelector(".calendar-body").style.backgroundImage = `url(${parsed.url})`;
	console.log(document.querySelector(".calendar-body").style.backgroundImage);
}

const numToMonth = function(num) {
	switch (num) {
		case 0:
			return "January";
		case 1:
			return "February";
		case 2:
			return "March";
		case 3:
			return "April";
		case 4:
			return "May";
		case 5:
			return "June";
		case 6:
			return "July";
		case 7:
			return "August";
		case 8:
			return "September";
		case 9:
			return "October";
		case 10:
			return "November";
		case 11:
			return "December";
	}
}

const daysBefore = function(x) {
	return new Date(Date.now() - x * 86400000);
}

fetchData();

let today = new Date(Date.now());
let thisMonth = today.getMonth();
console.log('This Month:', thisMonth);
let dl = 6 - today.getDay();
console.dir(today);
console.log(today.getDay());

let currentMonth = document.querySelector(".calMonth");
currentMonth.innerText = numToMonth(thisMonth);

//Building Calendar
let calendarBody = document.querySelector(".calendar-body");
for (let w = 0; w < 5; w++) {
	let calWeek = document.createElement("div");
	calWeek.classList.add("calWeek");
	for (let d = 0; d < 7; d++) {
		let calDay = document.createElement("div");
		calDay.classList.add("calDay");
		if (d === 6) {
			calDay.classList.add("bd-rightside");
		}
		let calDate = document.createElement("div");
		calDate.classList.add("calDate");
		let dateObj;
		let dateVal;
		switch (w) {
			case 0:
				dateObj = daysBefore(today.getDay() - d);
				dateVal = dateObj.getDate();
				calDate.innerText = dateVal;
				calDay.setAttribute("id", numToMonth(dateObj.getMonth()).slice(0, 3) + '-' + dateVal);
				break;
			case 1:
				dateObj = daysBefore(-(d + 1 + dl));
				dateVal = dateObj.getDate();
				calDate.innerText = dateVal;
				calDay.setAttribute("id", numToMonth(dateObj.getMonth()).slice(0, 3) + '-' + dateVal);
				break;
			case 2:
				dateObj = daysBefore(-(d + 1 + dl + 7));
				dateVal = dateObj.getDate();
				calDate.innerText = dateVal;
				calDay.setAttribute("id", numToMonth(dateObj.getMonth()).slice(0, 3) + '-' + dateVal);
				break;
			case 3:
				dateObj = daysBefore(-(d + 1 + dl + 14));
				dateVal = dateObj.getDate();
				calDate.innerText = dateVal;
				calDay.setAttribute("id", numToMonth(dateObj.getMonth()).slice(0, 3) + '-' + dateVal);
				break;
			case 4:
				dateObj = daysBefore(-(d + 1 + dl + 21));
				dateVal = dateObj.getDate();
				calDate.innerText = dateVal;
				calDay.setAttribute("id", numToMonth(dateObj.getMonth()).slice(0, 3) + '-' + dateVal);
				break;
		}
		calDay.appendChild(calDate);
		calWeek.appendChild(calDay);
	}
	calendarBody.appendChild(calWeek);
}
//Building Calendar

//Adding Events
for (let e = 0; e < 13; e++) {
	let newEvent = document.createElement("li");
	let newText = document.createElement("span");
	newText.classList.add("shiftL");
	newEvent.appendChild(newText);
	if (e === 0) {
		newText.innerHTML = "Bank Holiday";
		document.getElementById("Aug-26").appendChild(newEvent);
	} else if (e === 1) {
		// newText.innerHTML = "приготовить борщь днем";
		// document.getElementById("Aug-28").appendChild(newEvent);
	} else if (e === 2) {
		// newText.innerHTML = "Идти в магазин - борщь и вино :)";
		// document.getElementById("Aug-27").appendChild(newEvent);
	} else if (e === 3) {
		// newText.innerHTML = "прогулять по-реке";
		// document.getElementById("Aug-28").appendChild(newEvent);
	} else if (e === 4) {
		newText.innerHTML = "am Kelsey returns from UGM";
		document.getElementById("Aug-25").appendChild(newEvent);
	} else if (e === 5) {
		// newText.innerHTML = "шесть-сорок-пять: сауна";
		// document.getElementById("Aug-29").appendChild(newEvent);
	} else if (e === 6) {
		// newText.innerHTML = "21:45 Avery flys to BRS";
		// document.getElementById("Aug-20").appendChild(newEvent);
	} else if (e === 7) {
		// newText.innerHTML = "Wash Hair & Laundry";
		// document.getElementById("Aug-12").appendChild(newEvent);
	} else if (e === 8) {
		// newText.innerHTML = "Haircut & Contact Soln";
		// document.getElementById("Aug-15").appendChild(newEvent);
	} else if (e === 9) {
		// newText.innerHTML = "Late pm Talk with Erica";
		// document.getElementById("Aug-12").appendChild(newEvent);
	} else if (e === 10) {
		// newText.innerHTML = "Pack for Edinburgh";
		// document.getElementById("Aug-14").appendChild(newEvent);
	} else if (e === 11) {
		// newText.innerHTML = "Prethi - Supper Club";
		// document.getElementById("Aug-14").appendChild(newEvent);
	} else if (e === 12) {
		// console.log(e);
	}
}

//Adding Events