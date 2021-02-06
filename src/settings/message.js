const figlet = require('figlet');
const chalk = require('chalk');
const boxen = require('boxen');

const { log, clear } = console;

const mainTitle = (data) => {
  clear();
  log(chalk.magentaBright(figlet.textSync(data)));
};

const questionTitle = (data) => {
  log(chalk.yellow(data));
};

const debugMessage = (data) => {
  log(data);
};

const genericError = (error) => {
  log(chalk.red(error));
};

const readFileError = (data, error) => {
  log(
    chalk.red(`ERROR: The ${chalk.bold(data)} file is missing or not readable.`)
  );
  log(chalk.red(error));
};

const writeFileError = (data, error) => {
  log(chalk.red(`ERROR: Unable to generate the ${chalk.bold(data)} file.`));
  log(chalk.red(error));
};

const readFileSuccess = (data) => {
  log(chalk.green(`The ${data} file was successfully read`));
};

const writeFileSuccess = (data) => {
  log(
    chalk.green(
      boxen(
        `The ${chalk.bold.underline(data)} file is generated with success`,
        {
          padding: 1,
          margin: 1,
          borderStyle: 'classic',
        }
      )
    )
  );
};

export default {
  mainTitle,
  questionTitle,
  debugMessage,
  genericError,
  readFileError,
  writeFileError,
  readFileSuccess,
  writeFileSuccess,
};
