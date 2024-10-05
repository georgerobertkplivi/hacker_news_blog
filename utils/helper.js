const fs = require('fs');
const path = require('path');

function saveAllureResults(results) {
  const allureResultsDir = path.join(__dirname, '../allure-results');
  if (!fs.existsSync(allureResultsDir)) {
    fs.mkdirSync(allureResultsDir);
  }
  fs.writeFileSync(
    path.join(allureResultsDir, `${Date.now()}-result.json`),
    JSON.stringify(results)
  );
}

module.exports = {
  saveAllureResults
};
