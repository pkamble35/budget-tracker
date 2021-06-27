
class IndexDb {

  
   useIndexedDb() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('BudgetTracker', 1);
      let db,
        tx,
        store;
      request.onsuccess = function (e) {
        console.log('db connected');
        resolve();
      };
    });
  }
  browserOnline() {
    syncOfflineToServer();
  }

  browserOffline() {
     this.useIndexedDb();
  }



}
export default new IndexDb;

