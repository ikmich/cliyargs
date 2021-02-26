import chalk = require("chalk");

function yes(o: any) {
  if (typeof 0 === "boolean") {
    return o;
  }

  let b = o !== undefined && o !== null;
  if (b && typeof o === "string") {
    b = b && o !== "";
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
    if (typeof msg === "string") {
      if (msg.length > 0) {
        console.log(chalk.red(msg));
      }
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
  },
};

import inquirer from "inquirer";

const askInput = async (
  name: string = "input",
  message: string = "Enter input"
) => {
  const result = await inquirer.prompt({
    type: "input",
    name,
    message,
  });

  return result[name];
};

const askSelect = async (
  name: string = "choice",
  message: string = "Select choice",
  choices: any[],
  multiple = false
) => {
  if (choices && choices.length > 0) {
    const result = await inquirer.prompt({
      type: yes(multiple) ? "checkbox" : "list",
      name,
      message,
      choices,
    });

    return result[name] || "";
  }
  return "";
};

const askSelectMultiple = async (
  name: string = "choice",
  message: string = "Select choice",
  choices: any[]
) => {
  return await askSelect(name, message, choices, true);
};

function isYesInput(value: any) {
  return (
    value &&
    value.length &&
    (value === "yes" ||
      value === "y" ||
      value === "1")
  );
}

export {
  yes,
  no,
  isYesInput,
  conprint,
  askInput,
  askSelect,
  askSelectMultiple,
};
