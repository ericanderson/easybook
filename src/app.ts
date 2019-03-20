import commands from "./cli";
import program from "commander";

interface CommandPart {
    name: string;
    description: string;
    options: Array<{
        name: string;
        description: string;
        values: string[];
        defaults: string;
    }>;
    exec: (...args: any[]) => void;
}

for (const cmd of commands as CommandPart[]) {
    const command = program
        .command(cmd.name)
        .description(cmd.description)
        .action((...args: any[]) => {
            console.log("wat " + cmd.name);
            cmd.exec(...args);
        });

    for (const o of cmd.options) {
        command.option(`--${o.name}`, o.description, undefined, o.defaults);
    }
}

export default program;
