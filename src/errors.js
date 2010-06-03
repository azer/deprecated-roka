(function(exports){
  
  var ExcType = roka.core.exctype.ExcType;

  exports.DuplicationError = new ExcType('DuplicationError');
  exports.HTTPError = new ExcType('HTTPError');
  exports.IndexError = new ExcType('IndexError');
  exports.InterfaceError = new ExcType('InterfaceError');
  exports.NotFoundError = new ExcType('NotFoundError');
  exports.NotImplementedError = new ExcType('NotImplementedError');
  exports.ParseError = new ExcType('ParseError');
  exports.RequestError = new ExcType('ParseError');
  exports.TypeError = new ExcType('TypeError');
  exports.TransformError = new ExcType('TransformError');

})( roka.errors = {} );
