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

program.parse();
