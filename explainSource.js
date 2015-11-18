#!/usr/bin/env node

var program = require('commander');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var parseFactory = require('./parse/factory.js');

program
  .version('1.0.0')
  .description("Examine a data source and produce a schema config file for use with the parse program")
  .option('-p --projecthome <projecthome>', 'location of your project')
  .option('-c --createhome', 'Create the project home directory')
  .option('-t --type <type>', 'Data Source type (mssql, access, csv or fixedcsv)', /^(mssql|access|cvs|fixedcsv)$/i, 'csv')
  .option('--host <hostname>', 'Data source hostname (if applicable)')
  .option('--user <username>', 'Data souce user name (if applicable)')
  .option('--password <password>', 'Data source password (if applicable)')
  .option('--database <database>', 'Data source specific database (if applicable)')
  .option('--port <port>', 'Data source specific port (if applicable)')
  .option('')
  .parse(process.argv);

// Must have a project home.
if (program.projecthome === undefined) {
  process.exit(1);
}

var projectHome = path.resolve(program.projecthome);

// Check the projecthome exists and create it if instructed too.
fs.exists(projectHome, function(exists) {
  if (!exists) {
    if (program.createhome) {
        mkdirp(projectHome, function() {
          console.log('Project directory created');
        });
    } else {z
      console.log("Project home directory '%s' doesn't exists, add the -c (--createhome) option to create the project home.", projectHome);
      process.exit(1);
    }
  }
});



var db = parseFactory(program);

db.parse(function(err, msg){
  if (err){
    console.log(err);
    process.exit(1);
  }
  console.log(msg);
  process.exit(0);
});
