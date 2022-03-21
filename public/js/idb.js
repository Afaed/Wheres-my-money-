//the ability to enter deposits offline
let db;

//create a new dv request for a budget dtabase

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    const db =event.target.result;
    db.createObjectStore("pending", { autoIncrement: true})
}

request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable

    db = event.target.result;
    //check if app is online and to check the database
    if (navigator.onLine) {
        checkDatabase();
    }
}

request.onerror = function(event) {
    //error log
    console.log("Error: " + event.target.errorCode)
}

function saveRecord(record) {
    const transaction =db.transaction(["pending"], "readWrite");
    const store = transaction.objectStore("pending");
   store.add(record)
}

function checkDatabase() {
    const transaction =db.transaction(["pending"], "readWrite");
    const store = transaction.objectStore("pending");
    store.add(record)
    
    getAll.onsuccess = function(){
        if (getAll.result.length >0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = db.transaction.objectStore(["pending"])
                store.clear()
            })
        }
    }
}

window.addEventListener("online", checkDatabase);
//the ability to enter expenses offline.

//offline entries should be added to the tracker when the application is bought back online