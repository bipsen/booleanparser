import nearley from "nearley";
import grammar from "./grammar.js";
import assert from 'assert';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Due to ESM, __dirname is not defined, so we have to calculate it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the test cases from the JSON file.
const testCases = JSON.parse(fs.readFileSync(`${__dirname}/testCases.json`, 'utf-8'));

let passedCount = 0;
let failedCount = 0;

console.log(chalk.underline('Starting tests\n'));

// Loop through the test cases and parse each one.
for (let testCase of testCases) {
    // Create a new Parser object for each test case
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    try {
        parser.feed(testCase.original);
        const parserOutput = parser.results[0];

        console.log(`Test case: ${chalk.blue(testCase.original)}`);
        console.log(`Expected outcome:   ${chalk.green(testCase.expected)}`);
        console.log(`Parser outcome:     ${chalk.yellow(parserOutput)}`);

        assert.strictEqual(parserOutput, testCase.expected);
        console.log(chalk.green('Test passed\n'));
        passedCount++;

    } catch (error) {
        if (error instanceof assert.AssertionError) {
            console.log(chalk.red('Test failed\n'));
            failedCount++;
        } else {
            console.log(chalk.red(error));
            failedCount++;
        }
    }
}

console.log(chalk.underline(`\nFinished tests\n`));
console.log(`Total test cases: ${chalk.blue(testCases.length)}`);
console.log(`Passed: ${chalk.green(passedCount)}`);
console.log(`Failed: ${chalk.red(failedCount)}`);
