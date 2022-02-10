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
import fs from "fs";
import os from "os";
const COMMANDS = {
    help: "Shows all valid commands",
    project: "Project management",
    "help-alias": "shows all command aliases",
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let cliStore = yield JSON.parse(fs.readFileSync(`${os.homedir()}/.DevDashCliStore.json`, "utf8"));
        const command = {
            name: process.argv[2] ? process.argv[2].toLowerCase() : null,
            args: process.argv.slice(3).map(arg => arg.toLowerCase()),
            getArg(name) {
                this.args.forEach((arg, index) => {
                    if (arg.toLowerCase() === name.toLowerCase()) {
                        return this.args[index + 1];
                    }
                });
            },
        };
        switch (command.name) {
            case "help":
                let loop = Object.keys(COMMANDS);
                console.log(chalk.yellow("----- DevDash CLI Help -----"));
                loop.map(key => {
                    console.log(`${chalk.whiteBright.bold(key)} - ${chalk.white(COMMANDS[key])}`);
                });
                console.log(chalk.yellow("----------------------------"));
                break;
            case "project":
                switch (command.args[0]) {
                    case "create":
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
