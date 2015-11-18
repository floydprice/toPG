function ParseBase(opts){
    console.log("BASE : Not Implemented : ", opts);
    this._options = {};
}

ParseBase.prototype.parse = function parse(opts){
  console.log("BASE : Not Implemented : ", opts);
}

ParseBase.prototype.options = function(){
  return this._options;
}



module.exports = ParseBase;
