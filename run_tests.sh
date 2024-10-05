#!/bin/bash

# Run the tests
npm run test

# Generate the Allure report
npm run allure:generate

# Open the Allure report
npm run allure:open
