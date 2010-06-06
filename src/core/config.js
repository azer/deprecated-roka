(function( exports ){
  
  var Request = roka.async.request.Request;
  var NotFoundError = roka.errors.NotFoundError;
  var SubjectSet = roka.async.observer.SubjectSet;
  var get_url = roka.core.utils.get_url;
  var get_dir = roka.core.utils.get_dir;
  var superproto = roka.core.oop.superproto;

  /**
   * Instances of the Config class represent and provide an API to the configuration documents consist of an XML file.
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var Config = exports.Config = function()
  {
    superproto(Config,this).constructor.call( this );

    /**
     * @member Config
     */
    var events = new SubjectSet();
    this.__defineGetter__('events',function()
    {
      return events;
    });

    /**
     * @member Config
     */
    this.__defineGetter__('document',function()
    {
      return request.response.xml;
    });

    /**
     * Request object to fetch document 
     * @member Config
     */
    var request = new Request();
    this.__defineGetter__('request',function()
    {
      return request;
    });

    request._xhr_.overrideMimeType('text/xml');
    request.url = get_dir( get_url(2) )+'/config.xml';
    events.subjects.load = request.events.subjects.load;
  }

  /**
   * Send request to load configuration document
   */
  Config.prototype.load = function() 
  {
    this.request.send();
  };

  /**
   * Get the value for the configuration specified.
   * @param key {String}  The configuration name (key)
   */
  Config.prototype.get = function(key) 
  {
    var res = this.request.response.xml.query('//'+key+'/text()');
    if( res.length == 0 )
    {
      throw new NotFoundError('Could not found any configuration matching with given key '+key);
    }
    return res[0].nodeValue;
  };

  Config.prototype.toString = function()
  {
    return roka.core.utils.repr('Config',this.request.url,{ state:this.request.state });
  }

})( roka.core.config = {} );

