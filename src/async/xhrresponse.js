(function( exports ){
  
  var XMLFragment = roka.dom.xmlfragment.XMLFragment;
  var TransformError = roka.errors.TransformError;
  var TypeError = roka.errors.TypeError;
  var is_instance = roka.core.oop.is_instance;
  var query = roka.dom.utils.query;
  var select = roka.dom.utils.select;

  /**
   * XHRResponse is a proxy class linking response information of XMLHttpRequest objects.
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var creation_counter = 0;
  var XHRResponse = exports.XHRResponse = function()
  {
    
    /**
     * Immutable XHRResponse Id
     */
    var id = "XHRResponse#"+( ++creation_counter );
    this.__defineGetter__('id',function()
    {
      return id;
    });
    
    /**
     * Request Object
     * @member XHRResponse
     */
    var request = null;
    this.__defineGetter__('request',function()
    {
      return request;
    });
    this.__defineSetter__('request',function(value)
    {
      request = value;
    });
    
    /**
     * Contains all response headers
     * @member XHRResponse
     */
    this.__defineGetter__('headers',function()
    {
      return request._xhr_.getAllResponseHeaders();
    });

    /**
     * @member XHRResponse
     */
    this.__defineGetter__('text',function()
    {
      return request._xhr_.responseText;
    });

    /**
     * @member XHRResponse
     * @throws roka.errors.TransformError
     */
    var xml = new XMLFragment();
    this.__defineGetter__('xml',function()
    {
      if( xml.content == null )
      {
        xml.content = request._xhr_.responseXML;  
      }
      return xml;
    });

  }

  /**
   * Return the value of specified header name
   * @param name {String} The name of the header to retrieve
   */
  XHRResponse.prototype.get_header = function(name) 
  {
    return this.request._xhr_.getResponseHeader(name);
  };

  XHRResponse.prototype.toString = function() 
  {
    return roka.core.utils.repr('XHRResponse',this.id);
  };
  

})( roka.async.xhrresponse = {} );

