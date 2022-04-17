import chalk = require('chalk');

function yes(o: any) {
  if (typeof o === 'boolean') {
    return o;
  }

  let b = o !== undefined && o !== null;
  if (b && typeof o === 'string') {
    b = b && o !== '';
  }

  return b;
}

function no(o: any) {
  return !yes(o);
}

/**
 * Print to console.
 */
const conprint = {
  info: (msg: string) => {
    if (msg && msg.length > 0) {
      console.log(chalk.blueBright(msg));
    }
  },
  error: (msg: string | Error) => {
    if (typeof msg === 'string') {
      console.log(chalk.red(msg));
    } else {
      console.log(chalk.red(msg.message));
    }
  },
  notice: (msg: string) => {
    if (msg && msg.length > 0) {
      console.log(chalk.yellow(msg));
    }
  },
  success: (msg: string) => {
    if (msg && msg.length > 0) {
      console.log(chalk.greenBright(msg));
    }
  },
  plain: (msg: string) => {
    if (msg && msg.length > 0) {
      console.log(msg);
    }
  }
};

export { yes, no, conprint };

/**
 * Check if the result of an 'ask user input' is a yes.
 *
 * @param value
 */
export function isYesInput(value: any) {
  return value && value.length && (value === 'yes' || value === 'y' || value === '1');
}
