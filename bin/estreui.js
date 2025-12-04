#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const packageJson = require('../package.json');

// Commands
const initCommand = require('../lib/commands/init');
const updateCommand = require('../lib/commands/update');
const devCommand = require('../lib/commands/dev');
const addCommand = require('../lib/commands/add');
const removeCommand = require('../lib/commands/remove');

program
  .name('estreui')
  .description('CLI for EstreUI - The No-Build Javascript Framework')
  .version(packageJson.version);

program.addCommand(initCommand);
program.addCommand(updateCommand);
program.addCommand(devCommand);
program.addCommand(addCommand);
program.addCommand(removeCommand);

// If no args, default to init
const args = process.argv.slice(2);
if (!args.length) {
    program.parse([...process.argv, 'init']);
} else {
    const knownCommands = ['init', 'update', 'dev', 'add', 'remove', 'help'];
    const firstArg = args[0];
    
    // If first arg is not a known command and not a flag, assume it's a project name for init
    if (!knownCommands.includes(firstArg) && !firstArg.startsWith('-')) {
        program.parse([...process.argv.slice(0, 2), 'init', ...args]);
    } else {
        program.parse(process.argv);
    }
}
