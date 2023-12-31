// Background script to handle messages and store data in IndexedDB

const DB_NAME = "neopets_transactions";
const STORE_NAME = "transactions";
let db;

// Open IndexedDB
const request = indexedDB.open(DB_NAME, 1);

// Create or upgrade database
request.onupgradeneeded = function (event) {
  db = event.target.result;
  db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
};

// Success callback
request.onsuccess = function (event) {
  db = event.target.result;
};

// Error callback
request.onerror = function (event) {
  console.error("Error opening IndexedDB:", event.target.errorCode);
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "storeTransactions") {
    storeTransactions(request.transactions).then(sendResponse);
  } else if (request.action === "clearHistory") {
    clearHistory();
  } else if (request.action === "getTransactions") {
    getTransactions().then(sendResponse);
  } else if (request.action === "deleteTransaction") {
    deleteTransaction(request.id)
      .then(sendResponse)
      .catch((error) => {
        console.error(error);
      });
  }
  return true; // Required for asynchronous response
});

async function getTransactions() {
  const transaction = db.transaction([STORE_NAME], "readonly");
  const objectStore = transaction.objectStore(STORE_NAME);
  const transactions = await new Promise((resolve) => {
    const result = [];
    const cursor = objectStore.openCursor();
    cursor.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        result.push(cursor.value);
        cursor.continue();
      } else {
        resolve(result);
      }
    };
  });
  return transactions;
}

async function storeTransactions(transactions) {
  const transaction = db.transaction([STORE_NAME], "readwrite");
  const objectStore = transaction.objectStore(STORE_NAME);

  await Promise.all(
    transactions.map((transaction) => {
      return new Promise((resolve) => {
        const request = objectStore.add(transaction);
        request.onsuccess = () => resolve();
      });
    })
  );
  return { success: true };
}

async function deleteTransaction(transaction_id) {
  return new Promise((resolve, reject) => {
    const idToDelete = Number(transaction_id); // Assuming id is a number; adjust if it's a string or another type
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);
    const deleteRequest = objectStore.delete(idToDelete);

    deleteRequest.onsuccess = () => {
      resolve({success: true});
    };
    deleteRequest.onerror = () => {
      reject({success: true, error: deleteRequest.error});
    };
  });
}

function clearHistory() {
  const transaction = db.transaction([STORE_NAME], "readwrite");
  const objectStore = transaction.objectStore(STORE_NAME);
  const clearRequest = objectStore.clear();

  clearRequest.onsuccess = function (event) {
    console.log("Transaction history cleared.");
    return { success: true };
  };

  clearRequest.onerror = function (event) {
    console.error(
      "Error clearing transaction history:",
      event.target.errorCode
    );
    return { success: false };
  };
}
