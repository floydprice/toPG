var inherits = require("util").inherits;
var ParseBase = require('./base.js');
var sql = require('mssql');
var fs = require('fs');
var path = require('path');

var ALL_TABLE_QUERY = 'SELECT * FROM information_schema.tables order by TABLE_NAME asc';

// Constructor
ParseMsSql = function(opts) {
  this._options = {
    server: opts.host,
    database: opts.database,
    user: opts.user,
    password: opts.password,
    port: opts.port
  }
  this._projectHome = path.resolve(opts.projecthome);
}

inherits(ParseMsSql, ParseBase);

// Override the parse method
ParseMsSql.prototype.parse = function(callback) {
  var self = this;
  self._parseCount = 0;
  sql.connect(this._options).then(function() {
    var request = new sql.Request();

    request.query(ALL_TABLE_QUERY)
      .then(function(recordset) {self._processTables(recordset, callback)})
      .catch(function(err) {
        if (err) {
          callback(err);
          throw (err);
        }
      });
  });

}


ParseMsSql.prototype._processTables = function(recordset, callback) {
  var self = this;
  self.tableDefs = recordset;

  recordset.forEach(function(record, i) {
    var tableDef = {
      name: record.TABLE_NAME,
      columns: []
    };

    var request = new sql.Request();

    request.input('table_name', tableDef.name);

    request.execute('sp_columns')
      .then(function(recordsets, returnValue) {
        recordsets[0].forEach(function(record) {
          tableDef.columns.push({
            name: record.COLUMN_NAME,
            type: record.TYPE_NAME,
            precision: record.PRECISION,
            length: record.LENGTH,
            scale: record.SCALE,
            nullable: record.IS_NULLABLE,
            defaultValue: record.COLUMN_DEF
          });
        });

        fs.writeFile(self._projectHome + '/' + tableDef.name + '.tabledef', JSON.stringify(tableDef, null, 2), function(err) {
          if (err) throw err;
          self._parseCount =   self._parseCount + 1;
          if (self._parseCount >= recordset.length) {
            callback(null, "DONE");
          }
        });
      })
      .catch(function(err) {
        if (err) {
          callback(err);
          throw err;
        }
      });

  });

}

module.exports = ParseMsSql;
