let alerts_erorr = document.getElementById('alerts-error');
let alerts_success = document.getElementById('alerts-success');
let listAlert = document.getElementById('listAlert');
let listOutput = document.getElementById('listOutput');

const databaseName = "UserToDoList";
const databaseVersion = 1;
const databaseStoreName = "ToDoList";
let db;

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
        displayActionFailure("Please give To-Do List Builder permission to open a database in order to continue.");
    };
    request_open.onupgradeneeded = function(event){
        console.log("openDb.onupgradeneeded");
        db = event.target.result;
        const objectStore = db.createObjectStore(databaseStoreName, {keyPath: 'itemName'});
        objectStore.createIndex('itemName', 'itemName', {unique: true});
        objectStore.createIndex('itemDetails', 'itemDetails', {unique: false});
        objectStore.createIndex('itemCompleted', 'itemCompleted' , {unique: false});
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
        displayActionSuccess("List cleared");
        displayObjectStore(objectStore);
    };
    request_clear.onerror = function(event){
        console.error("clearObjectStore:", event.target.errorCode);
        displayActionFailure(event.target.error);
    };
};
//FUNCTION CLEAR OBJECT STORE

//FUNCTION DISPLAY OBJECT STORE
function displayObjectStore(objectStore){
    console.log("displayObjectStore");
    objectStore = getObjectStore(databaseStoreName, 'readonly');
    listAlert.innerHTML = '';
    listOutput.innerHTML = '';
    let request_count = objectStore.count();
    request_count.onsuccess = function(event){
        listAlert.innerHTML = `You have <b>${event.target.result}</b> items on your to-do list.`;
    };
    request_count.onerror = function(event){
        console.error("itemCount error", event.target.error);
        displayActionFailure(event.target.error);
    };
    request_display = objectStore.openCursor();
    request_display.onsuccess = function(event){
        let cursor = event.target.result;
        if(cursor){
            console.log("displayObjectStore cursor:", cursor);
            request_key = objectStore.get(cursor.key);
            request_key.onsuccess = function(event){
                let keyValue = event.target.result;
                let listItem = document.createElement('li');
                listItem.innerHTML = "<b>" + keyValue.itemName + "<b>";
                if(keyValue.itemDetails !== ''){
                    listItem.innerHTML += "<em> (" + keyValue.itemDetails + ")</em>";
                }
                if(keyValue.itemCompleted == "no"){
                    listItem.innerHTML += ' - <output class="incomplete">Incomplete</output>';
                };
                if(keyValue.itemCompleted == "yes"){
                    listItem.innerHTML += ' - <output class="completed">Completed</output>';
                };
                listOutput.appendChild(listItem);
            };
            request_key.onerror = function(event){
                console.error("retrieveItem error", event.target.error);
                displayActionFailure(event.target.error);
            };
            cursor.continue();
            
        } else{
            console.log("No more items");
            document.getElementById('list').style.display = "block";
            document.getElementsByClassName('markCompleted')[0].setAttribute("id", "markCompletedHalved");
        };
    };
    request_display.onerror = function(event){
        console.error("displayObjectStore error", event.target.error);
        displayActionFailure(event.target.error);
    };
};
//FUNCTION DISPLAY OBJECT STORE

//FUNCTION ADD LIST ITEM
function addListItem(itemName, itemDetails, itemCompleted){
    console.log("addListItem arguments:", arguments);
    let object = {itemName: itemName, itemDetails: itemDetails, itemCompleted: itemCompleted};

    let objectStore = getObjectStore(databaseStoreName, 'readwrite');
    let request_add = objectStore.add(object);
    request_add.onsuccess = function(event){
        console.log("insertion in DB successful");
        displayActionSuccess(`${itemName} added`);
        displayObjectStore(objectStore);
    };
    request_add.onerror = function(event){
        console.error("addListItem error", event.target.error);
        displayActionFailure(event.target.error);
    };
};
//FUNCTION ADD LIST ITEM

//FUNCTION DELETE LIST ITEM
function deleteListItem(key){
    console.log("deleteListItem", arguments);
    let objectStore = getObjectStore(databaseStoreName, 'readwrite');
    let request_get = objectStore.get(key);
    request_get.onsuccess = function(event){
        let record = request_get.result;
        console.log("Record:", record);
        if(typeof record == 'undefined'){
            displayActionFailure("No matching item found")
            return;
        };
        let request_delete = objectStore.delete(key);
        request_delete.onsuccess = function(event){
            console.log("event:", event);
            console.log("event.target:", event.target);
            console.log("event.target.result", event.target.result);
            console.log("delete successful");
            displayActionSuccess(`${key} deleted`);
            displayObjectStore(objectStore);
        };
        request_delete.onerror = function(event){
            console.error("deleteListItem:", event.target.errorCode);
            displayActionFailure(event.target.error);
        };
    };
    request_get.onerror = function(event){
        console.error("deleteListItem:", event.target.errorCode);
    };
}            
//FUNCTION DELETE LIST ITEM

//FUNCTION EDIT LIST ITEM
function editListItem(key, newName, newDetails){
    console.log("editListItem", arguments);
    let objectStore = getObjectStore(databaseStoreName, 'readwrite');
    let nameEdited = "no";
    let request_edit = objectStore.get(key);
    request_edit.onsuccess = function(event){
        let record = request_edit.result;
        console.log("Record:", record);
        if(typeof record == 'undefined'){
            displayActionFailure("No matching item found")
            return;
        };
        if(newName !== ''){
            record.itemName = newName;
            nameEdited = "yes";
            console.log("Name replaced");
        };
        if(newDetails !== ''){
            record.itemDetails = newDetails;
            console.log("Details replaced");
        };
        if(newName == '' && newDetails == ''){
            displayActionFailure("Please input information to be replaced");
            return;
        };
        let request_replace = objectStore.put(record);
        request_replace.onsuccess = function(event){
            console.log("replacement successful");
            if(nameEdited == "yes"){
                let request_delete_dup = objectStore.delete(key);
                request_delete_dup.onsuccess = function(event){
                    console.log("event:", event);
                    console.log("event.target:", event.target);
                    console.log("event.target.result", event.target.result);
                    console.log("delete duplicate successful");
                };
                request_delete_dup.onerror = function(event){
                    console.error("deleteDuplicateListItem:", event.target.errorCode);
                };
                displayActionSuccess(`${key} edited, new name: ${newName}`);
            } else{
                displayActionSuccess(`${key} edited`);
            }
            displayObjectStore(objectStore);
        };
        request_replace.onerror = function(event){
            console.error("replaceListItem:", event.target.errorCode);
            displayActionFailure(event.target.error);
        };
    };
    request_edit.onerror = function(event){
        console.error("editListItem:", event.target.errorCode);
    };
}
//FUNCTION EDIT LIST ITEM

//FUNCTION MARK ITEM COMPLETED
function markItemCompleted(key){
    console.log("markItemCompleted", arguments);
    let objectStore = getObjectStore(databaseStoreName, 'readwrite');
    let request_mark = objectStore.get(key);
    request_mark.onsuccess = function(event){
        let record = request_mark.result;
        console.log("Record:", record);
        if(typeof record == 'undefined'){
            displayActionFailure("No matching item found")
            return;
        };
        record.itemCompleted = "yes";
        console.log("item marked completed");
        let request_replace_comp = objectStore.put(record);
        request_replace_comp.onsuccess = function(event){
            console.log("replacement successful");
            displayActionSuccess("Item marked completed");
        };
        request_replace_comp.onerror = function(event){
            console.error("re-storeMarkedItem:", event.target.errorCode);
        };
        displayObjectStore(objectStore);
    };
    request_mark.onerror = function(event){
        console.error("markItemCompleted:", event.target.errorCode);
    };
};
//FUNCTION MARK ITEM COMPLETED

//FUNCTION DISPLAY INCOMPLETE ONLY
function displayIncompleteOnly(objectStore){
    console.log("displayIncompleteOnly");
    objectStore = getObjectStore(databaseStoreName, 'readonly');
    listAlert.innerHTML = '';
    listOutput.innerHTML = '';
    let request_count = objectStore.count();
    request_count.onsuccess = function(event){
        listAlert.innerHTML = `You have <b>${event.target.result}</b> items on your to-do list.`;
    };
    request_count.onerror = function(event){
        console.error("add error", event.target.error);
        displayActionFailure(event.target.error);
    };
    request_display = objectStore.openCursor();
    request_display.onsuccess = function(event){
        let cursor = event.target.result;
        if(cursor){
            console.log("displayIncompleteOnly cursor:", cursor);
            request_key = objectStore.get(cursor.key);
            request_key.onsuccess = function(event){
                let keyValue = event.target.result;
                if(keyValue.itemCompleted == "no"){
                    let listItem = document.createElement('li');
                    listItem.innerHTML = "<b>" + keyValue.itemName + "<b>";
                    if(keyValue.itemDetails !== ''){
                    listItem.innerHTML += "<em> (" + keyValue.itemDetails + ")</em>";
                    };
                    listItem.innerHTML += ' - <output class="incomplete">Incomplete</output>';
                    listOutput.appendChild(listItem);
                };
            };
            request_key.onerror = function(event){
                console.error("retrieveItem error", event.target.error);
                displayActionFailure(event.target.error);
            };
            cursor.continue();
            
        } else{
            console.log("No more items");
            document.getElementById('list').style.display = "block";
            document.getElementsByClassName('markCompleted')[0].setAttribute("id", "markCompletedHalved");
        };
    };
    request_display.onerror = function(event){
        console.error("displayObjectStore error", event.target.error);
        displayActionFailure(event.target.error);
    };
};
//FUNCTION DISPLAY INCOMPLETE ONLY

//FUNCTION DISPLAY COMPLETED ONLY
function displayCompletedOnly(objectStore){
    console.log("displayCompletedOnly");
    objectStore = getObjectStore(databaseStoreName, 'readonly');
    listAlert.innerHTML = '';
    listOutput.innerHTML = '';
    let request_count = objectStore.count();
    request_count.onsuccess = function(event){
        listAlert.innerHTML = `You have <b>${event.target.result}</b> items on your to-do list.`;
    };
    request_count.onerror = function(event){
        console.error("add error", event.target.error);
        displayActionFailure(event.target.error);
    };
    request_display = objectStore.openCursor();
    request_display.onsuccess = function(event){
        let cursor = event.target.result;
        if(cursor){
            console.log("displayCompletedOnly cursor:", cursor);
            request_key = objectStore.get(cursor.key);
            request_key.onsuccess = function(event){
                let keyValue = event.target.result;
                if(keyValue.itemCompleted == "yes"){
                    let listItem = document.createElement('li');
                    listItem.innerHTML = "<b>" + keyValue.itemName + "<b>";
                    if(keyValue.itemDetails !== ''){
                    listItem.innerHTML += "<em> (" + keyValue.itemDetails + ")</em>";
                    };
                    listItem.innerHTML += ' - <output class="completed">Completed</output>';
                    listOutput.appendChild(listItem);
                };
            };
            request_key.onerror = function(event){
                console.error("retrieveItem error", event.target.error);
                displayActionFailure(event.target.error);
            };
            cursor.continue();
            
        } else{
            console.log("No more items");
            document.getElementById('list').style.display = "block";
            document.getElementsByClassName('markCompleted')[0].setAttribute("id", "markCompletedHalved");
        };
    };
    request_display.onerror = function(event){
        console.error("displayObjectStore error", event.target.error);
        displayActionFailure(event.target.error);
    };
};
//FUNCTION DISPLAY COMPLETED ONLY

//FUNCTION DISPLAY ACTION SUCCESS
function displayActionSuccess(msg){
    userAlert = "Success: " + msg;
    alerts_success.innerHTML = userAlert;
    alerts_success.style.display = "block";
    alerts_erorr.style.display = "none";
};
//FUNCTION DISPLAY ACTION SUCCESS

//FUNCTION DISPLAY ACTION FAILURE
function displayActionFailure(msg){
    userAlert = "Failure: " + msg;
    alerts_erorr.innerHTML = userAlert;
    alerts_erorr.style.display = "block";
    alerts_success.style.display = "none";
};
//FUNCTION DISPLAY ACTION FAILURE

//FORMALLY OPENING DATABASE
openDb();
//FORMALLY OPENING DATABASE


//ADDING EVENT LISTENERS
document.getElementById('btnAddItem').addEventListener('click', () =>{
    let itemName = document.getElementById('itemName').value;
    let itemDetails = document.getElementById('itemDetails').value;
    let itemCompleted = "no";
    if(itemName == ''){
        displayActionFailure("Please enter an item name");
        return;
    } else{
        addListItem(itemName, itemDetails, itemCompleted);
        document.getElementById('itemName').value = '';
        document.getElementById('itemDetails').value = '';
    };
});

document.getElementById('btnRemoveItem').addEventListener('click', () =>{
    let key = document.getElementById('removeItemName').value;
    if(key == ''){
        displayActionFailure("Please enter an item name");
    } else{
        deleteListItem(key);
        document.getElementById('removeItemName').value = '';
    }
});

document.getElementById('btnEditItem').addEventListener('click', () =>{
    let editItemName = document.getElementById('editItemName').value;
    let newName = document.getElementById('editItemNewName').value;
    let newDetails = document.getElementById('editItemNewDetails').value;
    if(editItemName == ''){
        displayActionFailure("Please enter an item name");
    } else{
        editListItem(editItemName, newName, newDetails);
        document.getElementById('editItemName').value = '';
        document.getElementById('editItemNewName').value = '';
        document.getElementById('editItemNewDetails').value = '';
    }
});

document.getElementById('btnClearList').addEventListener('click', () =>{
    clearObjectStore();
});

document.getElementById('btnShowList').addEventListener('click', () =>{
    displayObjectStore();
});

document.getElementById('btnShowIncomplete').addEventListener('click', () =>{
    displayIncompleteOnly();
});

document.getElementById('btnShowCompleted').addEventListener('click', () =>{
    displayCompletedOnly();
});

document.getElementById('btnMarkCompleted').addEventListener('click', () =>{
    let markCompletedName = document.getElementById('markCompletedName').value;
    if(markCompletedName == ''){
        displayActionFailure("Please enter an item name");
    } else{
        markItemCompleted(markCompletedName);
        document.getElementById('markCompletedName').value = '';
    }
});
// ADDING EVENT LISTENERS