var mssql = require("./mssql.js");

Factory = function(program) {
  switch (program.type) {
    case 'mssql':
        return new mssql(program);
      break;
    default:
      throw new Error("DB Type not known (or Implemented): " + program.type);
  }
}


module.exports = Factory;
