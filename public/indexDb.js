var db;

async function saveTransaction(newTransaction) {
  const trans = db.transaction("transactions", "readwrite");
  const pendingTable = trans.objectStore("transactions");
  pendingTable.add(newTransaction);

  await trans.done;

  console.log(`Saving new record offline: ` + JSON.stringify(newTransaction));
}

function useIndexedDb() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('budget-tracker', 1);
    request.onupgradeneeded = function(e) {
      db = e.target.result;
       db.createObjectStore("transactions", { keyPath: "id" , autoIncrement: true });
    };

    request.onsuccess = function (e) {
      db = e.target.result;
      console.log('db connected');
      resolve();
    };
  });
}


function browserOffline() {
  this.useIndexedDb();
}