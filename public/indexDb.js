var db;
(async () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('budget-tracker', 1);
    request.onupgradeneeded = function (e) {
      db = e.target.result;
      db.createObjectStore("transactions", { keyPath: "id", autoIncrement: true });
    };

    request.onsuccess = function (e) {
      db = e.target.result;
      console.log('db connected');
      resolve();
    };
  });
})();

async function saveTransaction(newTransaction) {
  const trans = db.transaction("transactions", "readwrite");
  const transactions = trans.objectStore("transactions");
  transactions.add(newTransaction);

  await trans.done;

  console.log(`Saving new record offline: ` + JSON.stringify(newTransaction));
}
async function syncToServer() {
  if (db) {
    return new Promise((resolve,reject) =>{
      console.log('in db sync');

      var objectStore = db.transaction("transactions", "readonly").objectStore("transactions");
      var getObject = objectStore.getAll();
      getObject.onsuccess = (e)=>{
        var data = e.target.result;
        console.log('data length', data.length);
        if (data.length) {
          // sync it to server
          fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
            }
          }).then(response => {    
            return response.json();
          })
          .then(async (response) => {
            var os = db.transaction("transactions", "readwrite").objectStore("transactions");
            for (let ids of data) {
              
              await os.delete( ids.id);
             
            }
            resolve();
          });
         
        }
      };
     
    });
    
  }
}


function browserOffline() {
  console.log('browser is offline');
}
async function browserOnline() {
  console.log('online');
  await syncToServer();
  console.log('sync complete');
}

// listen for app coming back online
window.addEventListener("online", browserOnline);
window.addEventListener("offline", browserOffline);
