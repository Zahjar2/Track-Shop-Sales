// Function to check if the specific text is present in the DOM
function checkForSpecificText() {
  const specificText =
    "Please clear your Sales History regularly to save space on the Neopets servers! :)";
  if (document.body.innerText.includes(specificText)) {
    return true;
  } else {
    return false;
  }
}

// Extract transaction data from the Neopets page
function extractTransactions() {
  const transactions = [];

  // Add your logic here to extract data from the Neopets page
  // Example:
  const rows = document.querySelectorAll(
    "td.content table:nth-child(12) tr:not(:first-child):not(:last-child)"
  );
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const date = cells[0].textContent.trim();
    const item = cells[1].textContent.trim();
    const buyer = cells[2].querySelector("a > b").textContent.trim();
    const price = parseInt(
      cells[3].textContent.trim().replace(/[^0-9]/g, ""),
      10
    );

    transactions.push({ date, item, buyer, price });
  });
  return transactions;
}

function displayTransactions(transactions) {
  const content = document.querySelector("td.content");
  const transactionTable = document.createElement("table");
  transactionTable.setAttribute("align", "center");

  if (transactions.length === 0) {
    transactionTable.innerHTML = "<tr><td>No transactions stored.</td></tr>";
    return;
  }
  11;

  transactionTable.innerHTML = `
          <tr>
            <th bgcolor="#dddd77" align="center"><b>Date</b></th>
            <th bgcolor="#dddd77" align="left"><b>Item</b></th>
            <th bgcolor="#dddd77" align="left"><b>Buyer</b></th>
            <th bgcolor="#dddd77" align="right"><b>Price</b></th>
            <th bgcolor="#dddd77" align="right"><b>Remove</b></th>
          </tr>
        `;

  transactions.forEach((transaction) => {
    const row = transactionTable.insertRow();
    row.setAttribute("data-transaction-id", transaction.id); // Add the id as a data attribute to the row
    row.innerHTML = `
              <td bgcolor="#ffffcc" align="center">${transaction.date}</td>
              <td bgcolor="#ffffcc" align="left">${transaction.item}</td>
              <td bgcolor="#ffffcc" align="left"><a href="www.neopets.com/randomfriend.phtml?randomfriend=${
                transaction.buyer
              }">${transaction.buyer}</a></td>
              <td bgcolor="#ffffcc" align="right">${formatCoinValue(
                transaction.price
              )} NP</td>
              <td bgcolor="#ffffcc" align="right"><a href="#" class="remove-link" data-id="${
                transaction.id
              }">X</a></td>
            `;
    row.querySelector(".remove-link").addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default behavior of the anchor link
      const transactionId = e.target.getAttribute("data-id");
      chrome.runtime.sendMessage(
        { action: "deleteTransaction", id: transactionId },
        function (response) {
          // Handle the response if necessary
          if (response && response.success) {
            row.remove(); // Removes the row from the table if deletion is successful
          }
        }
      );
    });
  });

  const row = transactionTable.insertRow();
  row.style = "height: 17px;";

  content.appendChild(transactionTable);
}

function deleteSalesHistory() {
  let button = document.querySelector(
    'input[type="submit"][value="Clear Sales History"]'
  );
  if (button) {
    button.click();
  }
}

function formatCoinValue(value) {
  // Ensure value is a number
  if (typeof value !== "number") {
    return "Invalid input";
  }

  // Create Intl.NumberFormat object for formatting as currency
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 0,
  });

  // Format the value using the formatter
  return formatter.format(value);
}

if (checkForSpecificText()) {
  chrome.runtime.sendMessage(
    { action: "getTransactions" },
    displayTransactions
  );
  chrome.runtime.sendMessage(
    {
      action: "storeTransactions",
      transactions: extractTransactions(),
    },
    deleteSalesHistory
  );
} else {
  console.error("Not found");
}
