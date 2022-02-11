var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";
import os from "os";
const COMMANDS = {
    help: { description: "Shows all valid commands" },
    project: { description: "Project management", aliases: ["proj", "p"] },
    "help-alias": {
        description: "shows all command aliases",
        aliases: ["help-aliases"],
    },
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let cliStore = yield JSON.parse(fs.readFileSync(`${os.homedir()}/.DevDashCliStore.json`, "utf8"));
        const command = {
            name: process.argv[2] ? process.argv[2].toLowerCase() : null,
            args: process.argv.slice(3),
            getArg(name) {
                let out = "";
                this.args.forEach((arg, index) => {
                    if (arg.toLowerCase() === name.toLowerCase()) {
                        out = this.args[index + 1];
                    }
                });
                return out;
            },
        };
        switch (command.name) {
            case "help-aliases":
            case "help-alias":
                console.log(chalk.yellow("----- DevDash CLI Aliases -----"));
                Object.keys(COMMANDS).map(command => {
                    if (COMMANDS[command].aliases) {
                        console.log(`${chalk.blueBright(command)}: ${COMMANDS[command].description}`);
                        COMMANDS[command].aliases.map(alias => {
                            console.log(`${chalk.green(alias)}: ${COMMANDS[command].description}`);
                        });
                        console.log(chalk.yellow(`-------------------------------`));
                    }
                });
                break;
            case "help":
                if (COMMANDS[command.args[0]]) {
                    console.log(chalk.yellow("----- DevDash CLI Help -----"));
                    console.log(chalk.whiteBright.bold("Command: ") +
                        chalk.whiteBright(command.args[0]));
                    if (COMMANDS[command.args[0]].aliases) {
                        console.log(chalk.yellow("--------- Aliases ----------"));
                        COMMANDS[command.args[0]].aliases.map(alias => {
                            console.log(chalk.whiteBright('"' + alias + '"'));
                        });
                    }
                    console.log(chalk.yellow("----------------------------"));
                }
                else {
                    let loop = Object.keys(COMMANDS);
                    console.log(chalk.yellow("----- DevDash CLI Help -----"));
                    loop.map(key => {
                        console.log(`${chalk.whiteBright.bold(key)} - ${chalk.white(COMMANDS[key].description)}`);
                    });
                    console.log(chalk.yellow("----------------------------"));
                }
                break;
            case "proj":
            case "p":
            case "project":
                switch (command.args[0]) {
                    case "create":
                        let project = {
                            name: command.getArg("name"),
                            description: command.getArg("description"),
                            path: command.getArg("path"),
                        };
                        if (project.name === "") {
                            let res = yield inquirer.prompt({
                                type: "input",
                                name: "name",
                                message: "What is the name of the project?",
                            });
                            project.name = yield res.name;
                        }
                        if (project.description === "") {
                            let res = yield inquirer.prompt({
                                type: "input",
                                name: "description",
                                message: "What is the description of the project?",
                            });
                            project.description = yield res.description;
                        }
                        if (project.path === "") {
                            let res = yield inquirer.prompt({
                                type: "input",
                                name: "path",
                                message: "What is the path of the project? (enter . for current directory)",
                            });
                            project.path = yield res.path;
                        }
                        break;
                    default:
                        console.log(chalk.gray("Please enter a valid command"));
                }
                break;
            default:
                console.log(chalk.white('DevDashCLI - Command not found. use "devdash-cli help" to see all valid commands'));
        }
        fs.writeFile(`${os.homedir()}/.DevDashCliStore.json`, JSON.stringify(cliStore), err => {
            if (err) {
                console.log(chalk.gray("Store write error."));
                console.log(err);
            }
        });
    });
}
if (fs.existsSync("~/.DevDashCliStore.json")) {
    main();
}
else {
    fs.writeFile(`${os.homedir()}/.DevDashCliStore.json`, "{}", err => {
        if (err) {
            console.log(err.toString());
            console.log(chalk.gray("Store write error."));
        }
        else {
            main();
        }
    });
}
