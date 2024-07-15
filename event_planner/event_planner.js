let modal = document.getElementById('shareModal');
let modalClose = document.getElementById('close');
modalClose.onclick = function(){
        modal.style.display = 'none';
};
window.onclick = function(event){
    if(event.target == modal){
        modal.style.display = 'none';
    };
};
let listAlerts = document.getElementById('list-alerts-general');
let listOutput = document.getElementById('listOutput');

const databaseName = "UserEventOrganizer";
const databaseVersion = 1;
const databaseStoreName = "EventList";
const geoKey = "65bd86c57125c277296913zfoe960a8";
let db;
let addWithLocation = "no";
let editWithLocation = "no";
let searchCriteria = "";
let shareName = '';
let shareTimeDate = '';
let shareStreet = '';
let shareCityState = '';
let shareNotes = '';
let useCustom;

//LEAFLET MAP SETTINGS
let map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
//LEAFLET MAP SETTINGS

//FUNCTION PROMPT USER
async function promptUser(){
    let userResponse = prompt(`You are about to delete more than one event record, please type "yes" if this is okay or "no" to go back.`);
    let responseNoSpaces = userResponse.trim();
    let responseNoQuotes = responseNoSpaces.replaceAll(`"`, ``);
    let responseLC = responseNoQuotes.toLowerCase();
    return responseLC;
}
//FUNCTION PROMPT USER

//FUNCTION PROCESS STRING
function processString(string){
    let stringPlus = string.replaceAll(' ', '+');
    let stringNoDots = stringPlus.replaceAll('.', '');
    return stringNoDots;
};
//FUNCTION PROCESS STRING

//FUNCTION FORMAT MAILTO
function formatMailto(string){
    let noQuest = string.replaceAll("?", "%3F");
    let noAnds = noQuest.replaceAll("&", "%26");
    let noColons = noAnds.replaceAll(":", "%3A");
    let noSemis = noColons.replaceAll(";", "%3B");
    let noSpaces = noSemis.replaceAll(" ", "%20");
    let noReturns = noSpaces.replaceAll("\n", "%0D%0A");
    //etc...
    console.log(noReturns);
    return noReturns;
};
//FUNCTION FORMAT MAILTO

//FUNCTION FORMAT DATE
function formatDate(date){
    let dateFinal = date.split('-');
    let month = [dateFinal[1]];
    let day = [dateFinal[2] + ','];
    dateFinal.pop();
    dateFinal.pop();
    dateFinal.push(day);
    if(month == '01'){
        dateFinal.push("Jan.");
    } else if(month == '02'){
        dateFinal.push("Feb.");
    } else if(month == '03'){
        dateFinal.push("Mar.");
    } else if(month == '04'){
        dateFinal.push("Apr.");
    } else if(month == '05'){
        dateFinal.push("May");
    } else if(month == '06'){
        dateFinal.push("Jun.");
    } else if(month == '07'){
        dateFinal.push("Jul.");
    } else if(month == '08'){
        dateFinal.push("Aug.");
    } else if(month == '09'){
        dateFinal.push("Sep.");
    } else if(month == '10'){
        dateFinal.push("Oct.");
    } else if(month == '11'){
        dateFinal.push("Nov.");
    } else if(month == '12'){
        dateFinal.push("Dec.");
    };
    return dateFinal.reverse().join(' ');
 };
 //FUNCTION FORMAT DATE

//FUNCTION CLEAR TEXT
function clearText(panel){
    document.getElementById(`eventName${panel}`).value = "";
    document.getElementById(`eventDate${panel}`).value = "";
    document.getElementById(`eventTime${panel}`).value = "";
    document.getElementById(`eventStreet${panel}`).value = "";
    document.getElementById(`eventCity${panel}`).value = "";
    document.getElementById(`eventState${panel}`).value = "";
    document.getElementById(`eventPost${panel}`).value = "";
    document.getElementById(`eventCountry${panel}`).value = "";
    document.getElementById(`eventNotes${panel}`).value = "";
};
//FUNCTION CLEAR TEXT

// FUNCTION OPEN INDEXEDDB
function openDb() {
    console.log("openDb...");
    let request_open = indexedDB.open(databaseName, databaseVersion);
    request_open.onsuccess = function(event){
        db = request_open.result;
        console.log("openDb DONE");
    };
    request_open.onerror = function(event){
        console.error("openDb:", event.target.errorCode);
        displayActionFailure("Please give Event Organizer permission to open a database in order to continue.");
    };
    request_open.onupgradeneeded = function(event){
        console.log("openDb.onupgradeneeded");
        db = event.target.result;
        const objectStore = db.createObjectStore(databaseStoreName, {autoIncrement: true});
        objectStore.createIndex('eventName', 'eventName', {unique: false});
        objectStore.createIndex('eventDate', 'eventDate', {unique: false});
        objectStore.createIndex('eventLocation', 'eventLocation', {unique: false});
    };
};
//FUNCTION OPEN INDEXEDDB

//FUNCTION GET OBJECT STORE
function getObjectStore(databaseStoreName, mode){
    let transaction = db.transaction(databaseStoreName, mode);
    return transaction.objectStore(databaseStoreName);
};
//FUNCTION GET OBJECT STORE

//FUNCTION CLEAR OBJECT STORE
function clearObjectStore(){
    let objectStore = getObjectStore(databaseStoreName, 'readwrite');
    let request_clear = objectStore.clear();
    request_clear.onsuccess = function(event){
        console.log("list cleared");
        displayActionSuccess("clear", "Event list cleared");
        displayObjectStore(objectStore);
    };
    request_clear.onerror = function(event){
        console.error("clearObjectStore:", event.target.errorCode);
        displayActionFailure("clear", event.target.error);
    };
};
//FUNCTION CLEAR OBJECT STORE

//FUNCTION DISPLAY ITEM
function displayItem(keyValue, itemKey, leafletIds){
    let listItem = document.createElement('li');
    listItem.setAttribute('id', itemKey);
    listItem.innerHTML = "<b>" + keyValue.eventName + "</b><br/>";
    if(keyValue.eventTime !== ''){
        listItem.innerHTML += keyValue.eventTime + ' ';
    };
    listItem.innerHTML += keyValue.eventDate + '<br/>';
    if(keyValue.eventLocation.City !== ''){
        if(keyValue.eventLocation.Street !== ""){
            listItem.innerHTML += keyValue.eventLocation.Street;
        };
        listItem.innerHTML += " " + keyValue.eventLocation.City;
        if(keyValue.eventLocation.State !== ""){
            listItem.innerHTML += ", " + keyValue.eventLocation.State;
        };
        if(keyValue.eventLocation.Post !== ""){
            listItem.innerHTML += " " + keyValue.eventLocation.Post;
        };
        listItem.innerHTML += ", " + keyValue.eventLocation.Country + '<br/>';
        marker = L.marker([keyValue.eventLatLon[0], keyValue.eventLatLon[1]]).addTo(map);
        console.log("displayItem Location Marker: ", marker);
        let leafletId = marker._leaflet_id;
        leafletIds[itemKey] = leafletId;
        marker.bindPopup(`<div id='popup'>${keyValue.eventName}<br/>${keyValue.eventDate}</div>`).openPopup();
    };
    if(keyValue.eventNotes !== ''){
        listItem.innerHTML += keyValue.eventNotes;
    };
    listItem.addEventListener('click', () => {
        setEventViewer(itemKey, leafletIds[itemKey]);
    });
    listOutput.appendChild(listItem);
};
//FUNCTION DISPLAY ITEM

//FUNCTION DISPLAY OBJECT STORE
function displayObjectStore(objectStore){
    console.log("displayObjectStore");
    objectStore = getObjectStore(databaseStoreName, 'readonly');
    listAlerts.innerHTML = '';
    listOutput.innerHTML = '';
    map.eachLayer(function(layer){
        layer.remove();
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
    let leafletIds = [];
    let latFinal = '';
    let lonFinal = '';
    let request_count = objectStore.count();
    request_count.onsuccess = function(event){
        listAlerts.innerHTML = `You have <b>${event.target.result}</b> events in your organizer.`;
    };
    request_count.onerror = function(event){
        console.error("itemCount error", event.target.error);
        displayActionFailure("list", event.target.error);
    };
    let request_display = objectStore.openCursor();
    request_display.onsuccess = function(event){
        let cursor = event.target.result;
        if(cursor){
            console.log("displayObjectStore cursor:", cursor);
            request_key = objectStore.get(cursor.key);
            request_key.onsuccess = function(event){
                let keyValue = event.target.result;
                let itemKey = cursor.key;
                displayItem(keyValue, itemKey, leafletIds);
                if(keyValue.eventLatLon !== '++++'){
                    latFinal = keyValue.eventLatLon[0];
                    lonFinal = keyValue.eventLatLon[1];
                };
            };
            request_key.onerror = function(event){
                console.error("retrieveItem error", event.target.error);
                displayActionFailure("list", event.target.error);
            };
            cursor.continue();
        } else{
            console.log("No more items");
            map.setView([latFinal, lonFinal], 13);
            document.getElementById('eventList').style.display = "block";
        };
    };
    request_display.onerror = function(event){
        console.error("displayObjectStore error", event.target.error);
        displayActionFailure("list", event.target.error);
    };
};
//FUNCTION DISPLAY OBJECT STORE

//FUNCTION DISPLAY BY SEARCH
function displayBySearch(objectStore, searchCriteria, searchInput){
    console.log("displayBySearch: searching by " + searchCriteria);
    objectStore = getObjectStore(databaseStoreName, 'readonly');
    let displayCount = 0;
    listAlerts.innerHTML = '';
    listOutput.innerHTML = '';
    map.eachLayer(function(layer){
        layer.remove();
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
    let leafletIds = [];
    let latFinal = '';
    let lonFinal = '';
    request_display = objectStore.openCursor();
    request_display.onsuccess = function(event){
        let cursor = event.target.result;
        if(cursor){
            console.log("displayObjectStore cursor:", cursor);
            request_key = objectStore.get(cursor.key);
            request_key.onsuccess = function(event){
                let keyValue = event.target.result;
                let itemKey = cursor.key;
                if(searchCriteria == "eventName"){
                    if(keyValue.eventName.includes(searchInput)){
                        displayItem(keyValue, itemKey, leafletIds);
                        if(keyValue.eventLatLon !== '++++'){
                            latFinal = keyValue.eventLatLon[0];
                            lonFinal = keyValue.eventLatLon[1];
                        };
                        displayCount++;
                    };
                } else if(searchCriteria == "eventDate"){
                    if(keyValue.eventDate == formatDate(searchInput)){
                        displayItem(keyValue, itemKey, leafletIds);
                        if(keyValue.eventLatLon !== '++++'){
                            latFinal = keyValue.eventLatLon[0];
                            lonFinal = keyValue.eventLatLon[1];
                        };
                        displayCount++;
                    };
                } else if(searchCriteria == "eventLocation"){
                    if(keyValue.eventLocation.Street.includes(searchInput) || keyValue.eventLocation.City.includes(searchInput) || keyValue.eventLocation.State.includes(searchInput) || keyValue.eventLocation.Post.includes(searchInput) || keyValue.eventLocation.Country.includes(searchInput)){
                        displayItem(keyValue, itemKey, leafletIds);
                        if(keyValue.eventLatLon !== '++++'){
                            latFinal = keyValue.eventLatLon[0];
                            lonFinal = keyValue.eventLatLon[1];
                        };
                        displayCount++;
                    };
                };
                displayActionSuccess("search", "Search complete");
            };
            request_key.onerror = function(event){
                console.error("retrieveItem error", event.target.error);
                displayActionFailure("list", event.target.error);
            };
            cursor.continue();
        } else{
            console.log("No more items");
            if(latFinal !== ''){
                map.setView([latFinal, lonFinal], 13);
            } else {
                map.setView([51.505, -0.09], 13);
            };
            if(displayCount == 0){
                listAlerts.innerHTML = 'No items found';
                displayActionFailure("search", "No matching items found, check your search criteria");
            } else {
                listAlerts.innerHTML = `Your search returned <b>${displayCount}</b> matching event(s) in your organizer.`;
            };
            document.getElementById('eventList').style.display = "block";
        };
    };
    request_display.onerror = function(event){
        console.error("displayObjectStore error", event.target.error);
        displayActionFailure("list", event.target.error);
    };
};
//FUNCTION DISPLAY BY SEARCH

//FUNCTION SET EVENT VIEWER
function setEventViewer(key, id){
    console.log("setting event in viewer");
    console.log("openDB Key: ", key);
    console.log("leafletId: ", id);
    shareName = '';
    shareTimeDate = '';
    shareStreet = '';
    shareCityState = '';
    shareNotes = '';
    let objectStore = getObjectStore(databaseStoreName, 'readwrite');
    let request_get = objectStore.get(key);
    request_get.onsuccess = function(event){
        let record = request_get.result;
        console.log("Record:", record);
        if(typeof record == 'undefined'){
            displayActionFailure("view", "Error finding event");
            return;
        };
        document.getElementById('viewEventDetails').innerHTML = '';
        let name = document.createElement('p');
        name.setAttribute('id', 'SEName');
        name.innerHTML = record.eventName;
        shareName = record.eventName;
        document.getElementById('viewEventDetails').appendChild(name);
        let timeDate = document.createElement('p');
        timeDate.setAttribute('id', 'SETimeDate');
        if(record.eventTime !== ""){
            timeDate.innerHTML += record.eventTime + " on ";
        };
        timeDate.innerHTML += record.eventDate;
        shareTimeDate = timeDate.innerHTML;
        document.getElementById('viewEventDetails').appendChild(timeDate);
        if(record.eventLocation.Street !== ""){
            let street = document.createElement('p');
            street.setAttribute('id', "SEStreet");
            street.innerHTML = record.eventLocation.Street;
            shareStreet = street.innerHTML + '\n';
            document.getElementById('viewEventDetails').appendChild(street);
        };
        let cityState = document.createElement('p');
        cityState.setAttribute('id', "SECityState");
        cityState.innerHTML = record.eventLocation.City;
        shareCityState = record.eventLocation.City;
        if(record.eventLocation.State !== ""){
            cityState.innerHTML += ", " + record.eventLocation.State;
            shareCityState += ", " + record.eventLocation.State;
        };
        if(record.eventLocation.Post !== ""){
            cityState.innerHTML += " " + record.eventLocation.Post;
            shareCityState += " " + record.eventLocation.Post;
        };
        document.getElementById('viewEventDetails').appendChild(cityState);
        if(record.eventLocation.State == "" && record.eventLocation.Post == ""){
            cityState.innerHTML += ", " + record.eventLocation.Country;
            if(record.eventLocation.City !== ""){
                shareCityState += ", " + record.eventLocation.Country;
            };
        } else {
            let country = document.createElement('p');
            country.setAttribute('id', "SECountry");
            country.innerHTML = record.eventLocation.Country;
            shareCityState += "\n" + record.eventLocation.Country;
            document.getElementById('viewEventDetails').appendChild(country);
        };
        document.getElementById('SENotes').innerHTML = record.eventNotes;
        shareNotes += record.eventNotes;
        document.getElementById('viewEventNotes').style.display = 'block';
        document.getElementById('shareOptions').style.display = 'block';
        
        if(record.eventLocation.City !== ''){
            map._layers[id].openPopup();
            map.setView([record.eventLatLon[0], record.eventLatLon[1]], 13);
            document.getElementById('noEvent').style.display = 'none';
        } else {
            console.log("no location");
            //Add close/delete top layer(popup) here
            document.getElementById('noEvent').style.display = 'block';
            document.getElementById('noEvent').innerHTML = 'Event does not have a location';
        };
        displayActionSuccess("list", `${record.eventName} set in Event Viewer`);
    };
    request_get.onerror = function(event){
        console.error("deleteEvent:", event.target.errorCode);
    };
}

//FUNCTION SET EVENT VIEWER

//FUNCTION ADD EVENT
function addEvent(eventName, eventDate, eventTime, eventLocation, eventLatLon, eventNotes){
    console.log("addEvent arguments:", arguments);
    let object = {eventName: eventName, eventDate: eventDate, eventTime: eventTime, eventLocation:eventLocation, eventLatLon:eventLatLon, eventNotes:eventNotes};
    console.log(object);
    let objectStore = getObjectStore(databaseStoreName, 'readwrite');
    let checked = "yes";
    let request_check = objectStore.getAll();
    request_check.onsuccess = function(event){
        console.log("checking for duplicate");
        let listArray = event.target.result;
        console.log(listArray);
        for(x=0; x<listArray.length; x++){
            if(listArray[x].eventName == eventName && listArray[x].eventDate == eventDate && listArray[x].eventTime == eventTime){
                checked = 'no';
                if(eventTime == ''){
                    displayActionFailure("add", "Duplicate item. Please add a unique name or date, or add a time");
                } else {
                    displayActionFailure("add", "Duplicate item. Please add a unique name, date or time");
                };
                break;
            } else {
                checked = 'yes';
            };
            console.log(`#${x} checked, unique = ${checked}`);
        };
        if(checked == 'yes'){
            let request_add = objectStore.add(object);
            request_add.onsuccess = function(event){
                console.log("insertion in DB successful");
                displayActionSuccess("add", `${eventName} added`);
                displayActionSuccess("list", `${eventName} added`);
                displayObjectStore(objectStore);
            };
            request_add.onerror = function(event){
                console.error("addEvent error", event.target.error);
                displayActionFailure("add", event.target.error);
            };
            clearText("Add");
        };
    };
    request_check.onerror = function(event){
        console.log("Error error");
    };
};
//FUNCTION ADD EVENT

//FUNCTION ADD WITH LOCATION
async function addEventWithLocation(eventName, eventDate, eventTime, eventLocation, eventLocationFinal, eventNotes){
    let geoURL = "https://geocode.maps.co/search?";
    geoURL += "q=" + eventLocationFinal;
    geoURL += "&api_key=" + geoKey;
    console.log(geoURL);
    let response = await fetch(geoURL);
    let data = await response.json();
    console.log(data);
    if(data.length !== 0){
        let eventLatLon = [];
        let lat = await data[0].lat;
        let lon = await data[0].lon;
        eventLatLon.push(lat);
        eventLatLon.push(lon);
        console.log("LatLon added:" + eventLatLon);
        addEvent(eventName, eventDate, eventTime, eventLocation, eventLatLon, eventNotes);
        clearText("Add");
    } else {
        console.log("No location found");
        displayActionFailure("add", "No location found. Please check your entries and try again.");
    };
};
//FUNCTION ADD WITH LOCATION

//FUNCTION FIND EVENT ENTRY
function findEntry(keyArray, eventDate, eventTime, objectStore, findCursor){
    console.log("findObject cursor:", findCursor);
    let primaryKey = findCursor.primaryKey;
    let request_pKey = objectStore.get(primaryKey);
    request_pKey.onsuccess = function(event){
        console.log(event.target.result);
        if(eventTime !== '' && event.target.result.eventTime == eventTime){
            if(eventDate !== '' && event.target.result.eventDate == eventDate){
                console.log("Time & Date match");
                keyArray.push(primaryKey);
            } else if (eventDate == ''){
                console.log("Time matches, no date");
                keyArray.push(primaryKey);
            };
        } else if(eventTime == ''){
            if(eventDate !== '' && event.target.result.eventDate == eventDate){
                console.log("Date matches, no time");
                keyArray.push(primaryKey);
            } else if(eventDate == ''){
                console.log("No time no date match, only name");
            keyArray.push(primaryKey);
            };
        };
    };
    request_pKey.onerror =function(event){
        console.error("findEntry error", event.target.error);
        displayActionFailure("delete", event.target.error);
    };
    findCursor.continue();
};
//FUNCTION FIND EVENT ENTRY

//FUNCTION DELETE EVENT
async function deleteEvent(eventName, eventDate, eventTime){
    console.log("deleteEvent", arguments);
    let deletePrompt = "yes";
    let deleteKeys = [];
    let objectStore = getObjectStore(databaseStoreName, 'readwrite');
    let request_find = objectStore.index("eventName").openKeyCursor(eventName);
    request_find.onsuccess = async function(event){
        let findCursor = event.target.result;
        if(findCursor){
            findEntry(deleteKeys, eventDate, eventTime, objectStore, findCursor);
        } else {
            console.log("No more items");
            console.log(deleteKeys);
            if(deleteKeys.length == 0){
                displayActionFailure("delete", "No events found with the entered details. Please try again.")
            } else if(deleteKeys.length == 1){
                console.log("Success, single entry retrieved");
            } else {
                deletePrompt = await promptUser();
                console.log(deletePrompt);
            };
            if(deletePrompt == "yes"){
                console.log("Proceeding to delete");
                for(x=0;x<deleteKeys.length;x++){
                    let request_delete = objectStore.delete(deleteKeys[x]);
                    request_delete.onsuccess = function(event){
                        console.log("event:", event);
                        console.log("event.target:", event.target);
                        console.log("event.target.result", event.target.result);
                        console.log("delete successful");
                        displayActionSuccess("delete", `${deleteKeys.length} item(s) deleted: ${eventName}`);
                    };
                    request_delete.onerror = function(event){
                        console.error("deleteEvent:", event.target.errorCode);
                        displayActionFailure("delete", event.target.error);
                    };
                }
                displayObjectStore(objectStore);
            } else {
                displayActionFailure("delete", "Delete request denied");
                console.log("Delete request denied");
                return;
            };
        };
    };
    request_find.onerror = function(event){
        console.error("findMatchingEvent(s) error:", event.target.errorCode);
    };
};
//FUNCTION DELETE EVENT

//FUNCTION EDIT EVENT
function editEvent(oldName, oldDate, oldTime, newName, newDate, newTime, newLocation, newNotes){
    console.log("editEvent", arguments);
    let newLatLon = "no";
    let editKeys = [];
    let finalKeys = [];
    console.log("Finding events with matching details");
    let objectStore = getObjectStore(databaseStoreName, 'readwrite');
    let request_find = objectStore.index("eventName").openKeyCursor(oldName);
    request_find.onsuccess = async function(event){
        let findCursor = event.target.result;
        if(findCursor){
            findEntry(editKeys, oldDate, oldTime, objectStore, findCursor);
        } else {
            console.log("No more items");
            console.log(editKeys);
            if(editKeys.length == 0){
                displayActionFailure("edit", "No events found with the entered details. Please try again.");
                return;
            }
            else if(editKeys.length > 1){
                displayActionFailure("edit", "Entered details apply to more than one existing event. Please enter a name, date and time unique to the event you would like to edit.");
                return;
            } else {
                console.log("Success, single entry retrieved, proceeding to edit");
                let request_edit = objectStore.get(editKeys[0]);
                request_edit.onsuccess = async function(event){
                    let record = request_edit.result;
                    console.log("Initiating edit");
                    console.log("Record:", record);
                    if(newName !== ''){
                        record.eventName = newName;
                        console.log("Name replaced");
                    };
                    if(newDate !== ''){
                        record.eventDate = newDate;
                        console.log("Date replaced");
                    };
                    if(newTime !== ''){
                        record.eventTime = newTime;
                        console.log("Time replaced");
                    };
                    if(editWithLocation == "yes"){
                        if(newLocation.Street !== ''){
                            if(newLocation.Street.toLowerCase() == "clear current"){
                                record.eventLocation.Street = '';
                            } else {
                                record.eventLocation.Street = newLocation.Street;
                                console.log("Street replaced");
                            };
                        };
                        if(newLocation.City !== ''){
                            if(newLocation.City.toLowerCase() == "clear current"){
                                record.eventLocation.City = '';
                            } else {
                                record.eventLocation.City = newLocation.City;
                                console.log("City replaced");
                            };
                        };
                        if(newLocation.State !== ''){
                            if(newLocation.State.toLowerCase() == "clear current"){
                                record.eventLocation.State = '';
                            } else {
                                record.eventLocation.State = newLocation.State;
                                console.log("State replaced");
                            };
                        };
                        if(newLocation.Post !== ''){
                            if(newLocation.Post.toLowerCase() == "clear current"){
                                record.eventLocation.Post = '';
                            } else {
                                record.eventLocation.Post = newLocation.Post;
                                console.log("Postcode replaced");
                            };
                        };
                        if(newLocation.Country !== ''){
                            if(newLocation.Country.toLowerCase() == "clear current"){
                                record.eventLocation.Country = '';
                            } else {
                                record.eventLocation.Country = newLocation.Country;
                                console.log("Country replaced");
                            };
                        };
                        let newLocationFinal = processString(record.eventLocation.Street + " " + record.eventLocation.City + " " + record.eventLocation.State + " " + record.eventLocation.Post + " " + record.eventLocation.Country);
                        console.log("New location string generated");
                        let geoURL = "https://geocode.maps.co/search?";
                        geoURL += "q=" + newLocationFinal;
                        geoURL += "&api_key=" + geoKey;
                        console.log(geoURL);
                        let response = await fetch(geoURL);
                        let data = await response.json();
                        console.log(data);
                        if(data.length !== 0){
                            record.eventLatLon = [];
                            let lat = await data[0].lat;
                            let lon = await data[0].lon;
                            record.eventLatLon.push(lat);
                            record.eventLatLon.push(lon);
                            console.log("LatLon added:" + record.eventLatLon);
                            newLatLon = "yes";
                        } else {
                            console.log("No location found");
                            newLatLon = "broken";
                        };
                    };
                    if(newNotes !== ''){
                        record.eventNotes = newNotes;
                        console.log("Notes replaced");
                    };
                    console.log("Checking for duplicates");
                    objectStore = getObjectStore(databaseStoreName, 'readwrite');
                    let request_check_final = objectStore.index("eventName").openKeyCursor(record.eventName);
                    request_check_final.onsuccess = function(event){
                        let finalCursor = event.target.result;
                        if(finalCursor){
                            findEntry(finalKeys, record.eventDate, record.eventTime, objectStore, finalCursor);
                        } else {
                            console.log("No more items");
                            console.log(finalKeys);
                            if(finalKeys.length >= 1){
                                console.log("Duplicate item, item not updated");
                                displayActionFailure("edit", "New item would be identical to an existing item. Items must have a unique name, date or time.");
                                return;
                            } else if (finalKeys.length < 1){
                                let request_replace = objectStore.put(record, editKeys[0]);
                                request_replace.onsuccess = function(event){
                                    console.log("Replacement successful");
                                    if(newLatLon == "broken"){
                                        displayActionFailure("edit", `<grn class="grn">${record.eventName} edited successfully,</grn> but GPS lookup failed, please re-edit location to enable/update map marking`);
                                    } else {
                                        displayActionSuccess("edit", `${oldName} edited`);
                                    };
                                    clearText("New");
                                    document.getElementById('eventNameEdit').value = '';
                                    document.getElementById('eventDateEdit').value = '';
                                    document.getElementById('eventTimeEdit').value = '';
                                    displayObjectStore(objectStore);
                                };
                                request_replace.onerror = function(event){
                                    console.error("replaceEvent:", event.target.errorCode);
                                    displayActionFailure("edit", event.target.error);
                                };
                            };
                        };
                    };
                    request_check_final.onerror = function(event){
                        console.error("duplicateCheck:", event.target.errorCode);
                        displayActionFailure("edit", event.target.error);
                    };     
                };
                request_edit.onerror = function(event){
                    console.error("editEvent:", event.target.errorCode);
                    displayActionFailure("edit", event.target.error);
                };
            };
        };
    };
    request_find.onerror = function(event){
        console.error("findMatchingEvent error:", event.target.errorCode);
        displayActionFailure("edit", event.target.error);
    };
};
//FUNCTION EDIT EVENT

//FUNCTION DISPLAY ACTION SUCCESS
function displayActionSuccess(panel, msg){
    userAlert = "Success: " + msg;
    let targetAlert = document.getElementById(`${panel}-alerts-success`);
    targetAlert.innerHTML = userAlert;
    targetAlert.style.display = "block";
    document.getElementById(`${panel}-alerts-error`).style.display = "none";
};
//FUNCTION DISPLAY ACTION SUCCESS

//FUNCTION DISPLAY ACTION FAILURE
function displayActionFailure(panel, msg){
    userAlert = "Failure: " + msg;
    let targetAlert = document.getElementById(`${panel}-alerts-error`);
    targetAlert.innerHTML = userAlert;
    targetAlert.style.display = "block";
    document.getElementById(`${panel}-alerts-success`).style.display = "none";
};
//FUNCTION DISPLAY ACTION FAILURE

//ADDING EVENT LISTENERS

//LOCATION DROPDOWN LISTENERS
document.getElementById('no').addEventListener('click', () =>{
    addWithLocation = "no";
    document.getElementById('eventLocationAdd').style.display = "none";
});

document.getElementById('yes').addEventListener('click', () =>{
    addWithLocation = "yes";
    document.getElementById('eventLocationAdd').style.display = "block";
});

document.getElementById('no2').addEventListener('click', () =>{
    editWithLocation = "no";
    document.getElementById('eventLocationNew').style.display = "none";
});

document.getElementById('yes2').addEventListener('click', () =>{
    editWithLocation = "yes";
    document.getElementById('eventLocationNew').style.display = "block";
});
//LOCATION DROPDOWN LISTENERS

//SEARCH CRITERIA LISTENERS
document.getElementById('byName').addEventListener('click', () =>{
    searchCriteria = "eventName";
    document.getElementById('searchInput').type = "text";
});

document.getElementById('byDate').addEventListener('click', () =>{
    searchCriteria = "eventDate";
    document.getElementById('searchInput').type = "date";
});

document.getElementById('byLocation').addEventListener('click', () =>{
    searchCriteria = "eventLocation";
    document.getElementById('searchInput').type = "text";
});
//SEARCH CRITERIA LISTENERS

//ADD BUTTON
document.getElementById('btnAdd').addEventListener('click', () =>{
    let eventName = document.getElementById('eventNameAdd').value.trim();
    let eventDate = formatDate(document.getElementById('eventDateAdd').value);
    let eventTime = document.getElementById('eventTimeAdd').value;
    let eventLocation = {Street: document.getElementById('eventStreetAdd').value.trim(), City: document.getElementById('eventCityAdd').value.trim(), State: document.getElementById('eventStateAdd').value.trim(), Post: document.getElementById('eventPostAdd').value.trim(), Country: document.getElementById('eventCountryAdd').value.trim()};
    let eventLocationFinal = processString(eventLocation.Street + " " + eventLocation.City + " " + eventLocation.State + " " + eventLocation.Post + " " + eventLocation.Country);
    console.log(eventLocationFinal);
    let eventNotes = document.getElementById('eventNotesAdd').value.trim();
    if(eventName == ''){
        displayActionFailure("add", "Please enter a name for the event");
        return;
    } else if(document.getElementById('eventDateAdd').value == ''){
        displayActionFailure("add", "Please enter a date for the event");
        return;
    } else if(addWithLocation == "yes"){
        if(document.getElementById('eventCityAdd').value == ''){
            displayActionFailure("add", "Please enter a city for the event");
            return;
        } else if(document.getElementById('eventCountryAdd').value == ''){
            displayActionFailure("add", "Please enter a country for the event");
            return;
        } else {
            addEventWithLocation(eventName, eventDate, eventTime, eventLocation, eventLocationFinal, eventNotes);
        };
    } else {
        addEvent(eventName, eventDate, eventTime, eventLocation, eventLocationFinal, eventNotes);
    };
});
//ADD BUTTON

//EDIT BUTTON
document.getElementById('btnEdit').addEventListener('click', () =>{
    let oldName = document.getElementById('eventNameEdit').value.trim();
    let oldDate = formatDate(document.getElementById('eventDateEdit').value);
    if(oldDate == "undefined,"){
        oldDate = '';
    };
    let oldTime = document.getElementById('eventTimeEdit').value;
    let newName = document.getElementById('eventNameNew').value.trim();
    let newDate = formatDate(document.getElementById('eventDateNew').value);
    if(newDate == "undefined,"){
        newDate = '';
    };
    console.log(newDate);
    let newTime = document.getElementById('eventTimeNew').value;
    let newLocation = '';
    if(editWithLocation == "yes"){
        newLocation = {Street: document.getElementById('eventStreetNew').value.trim(), City: document.getElementById('eventCityNew').value.trim(), State: document.getElementById('eventStateNew').value.trim(), Post: document.getElementById('eventPostNew').value.trim(), Country: document.getElementById('eventCountryNew').value.trim()};
    };
    let newNotes = document.getElementById('eventNotesNew').value;

    if(oldName == ''){
        displayActionFailure("edit", "Please enter the name of the event to edit");
    } else{
        editEvent(oldName, oldDate, oldTime, newName, newDate, newTime, newLocation, newNotes);
    };
});
//EDIT BUTTON

//DELETE BUTTON
document.getElementById('btnDelete').addEventListener('click', () =>{
    let deleteName = document.getElementById('eventNameDelete').value;
    let deleteDate = '';
    let deleteDateInit = document.getElementById('eventDateDelete').value;
    if(deleteDateInit !== ''){
        deleteDate = formatDate(deleteDateInit);
    };
    let deleteTime = document.getElementById('eventTimeDelete').value;
    if(deleteName !== ""){
        deleteEvent(deleteName, deleteDate, deleteTime);
    } else {
        displayActionFailure("delete", "Please enter a name for the event to delete");
        return;
    };
    document.getElementById('eventNameDelete').value = '';
    document.getElementById('eventDateDelete').value = '';
    document.getElementById('eventTimeDelete').value = '';
});
//DELETE BUTTON

//USE CUSTOM LISTENER
document.getElementById('useCustom').addEventListener('click', () =>{
    useCustom = !useCustom;
});
//USE CUSTOM LISTENER

//SHARE BUTTON
document.getElementById('btnShare').addEventListener('click', () =>{
    let shareEventObject = {
        title: "Here is an event for you to put on your calendar:\n\n",
        text: shareName + '\n' + shareTimeDate + '\n' + shareStreet + shareCityState + '\n\n(' + shareNotes + ')',
    };
    console.log(shareEventObject);

    if(!navigator.share || !useCustom){
        console.log("Web Share API not supported");
        modal.style.display = "block";
        let shareEventTitle = formatMailto(shareEventObject.title);
        let shareEventText = formatMailto(shareEventObject.text);
        let mailtoLink = "mailto:?subject=New%20Event&body=";
        mailtoLink += shareEventTitle + shareEventText;
        let fbLink = "https://www.facebook.com/sharer/sharer.php?u=";
        fbLink += window.location.href;
        let xLink = "https://twitter.com/intent/tweet?text=";
        xLink += shareEventTitle + shareEventText;

        document.getElementById('clipboard').addEventListener('click', () =>{
            navigator.clipboard.writeText(shareEventObject.title + shareEventObject.text);
            displayActionSuccess("share", "Event copied to clipboard");
        });

        document.getElementById('email').addEventListener('click', () =>{
            window.open(mailtoLink);
            displayActionSuccess("share", "Event shared to mail application");
        });

        document.getElementById('fb').addEventListener('click', () =>{
            navigator.clipboard.writeText(shareEventObject.title + shareEventObject.text);
            window.open(fbLink);
            displayActionSuccess("share", "Facebook share link opened and event copied to clipboard");
        });

        document.getElementById('x').addEventListener('click', () =>{  
            navigator.clipboard.writeText(shareEventObject.title + shareEventObject.text);
            window.open(xLink);
            displayActionSuccess("share", "X share link opened and event copied to clipboard");
        });

    } else {
        console.log("Web Share API supported");
        document.getElementById("useCustom").style.display = "inline-block";
        document.getElementById("useCustomText").style.display = "inline-block";
        if(navigator.canShare(shareEventObject)){
            console.log("Event can be shared");
            navigator.share(shareEventObject)
            .then(() => {
                console.log('Sharing was successful');
                displayActionSuccess("view", "Event shared succcessfully");
            })
            .catch((error) => {
                console.error('Sharing failed:', error);
                displayActionFailure("view", "Event sharing failed");
            });

        } else {
            console.log("Error: Event cannot be shared");
            displayActionFailure("view", "Event cannot be shared with native sharing method, please use custom sharing panel");
        };
    };
});
//SHARE BUTTON

//CLEAR BUTTON
document.getElementById('btnClear').addEventListener('click', () =>{
    clearObjectStore();
});
//CLEAR BUTTON

//SEARCH BUTTON
document.getElementById('btnSearch').addEventListener('click', () =>{
    let searchInput = document.getElementById('searchInput').value;
    if(searchInput !== ''){
        if(searchCriteria !== ''){
            displayBySearch('', searchCriteria, searchInput);
        } else {
            displayActionFailure("search", "No search parameter selected");
        };
    } else {
        displayActionFailure("search", "Please enter a search value");
    };
});
//SEARCH BUTTON

//VIEW BUTTON
document.getElementById('btnShowFull').addEventListener('click', () =>{
    displayObjectStore();
});
//VIEW BUTTON

//ADDING EVENT LISTENERS

openDb();