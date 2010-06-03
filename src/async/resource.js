(function( exports ){

  var Request = roka.async.request.Request;
  var SubjectSet = roka.async.observer.SubjectSet;
  
  /**
   * Instances of the Resource class represent an external resource to load. 
   * 
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   * @see roka.async.resource.Resource;
   */
  var creation_counter = 0;
  var Resource = exports.Resource = function()
  {
    
    /**
     * A string representing the resource.
     * @member Resource
     */
    var name = "Resource#"+(++creation_counter);
    this.__defineGetter__('name',function()
    {
      return name;
    });
    this.__defineSetter__('name',function(value)
    {
      name = value;
    });

    /**
     * An interface providing to create, remove events and attach/detach listeners.
     * @member Resource
     */
    var events = new SubjectSet();
    this.__defineGetter__('events',function()
    {
      return events;
    });
    
    /**
     * The mimetype of the resource. Default is text/plain.
     * @member Resource
     */
    this.mimetype = 'text/plain';

    /**
     * The request to be performed 
     * @member Resource
     */
    var request = new Request();
    this.__defineGetter__('request',function()
    {
      return request;
    });

    /**
     * The resource url
     * @member Resource
     */
    var url = null;
    this.__defineGetter__('url',function()
    {
      return request.url;
    });
    this.__defineSetter__('url',function(newurl)
    {
      this.request.url = newurl;
    });

    // set observation subjects
    events.subjects.error = request.events.subjects.error;
    events.subjects.load = request.events.subjects.load;

  }
  
  /**
   * Start loading the resource
   */
  Resource.prototype.load = function() 
  {
    this.request.send();
  };

  Resource.prototype.toString = function()
  {
    return roka.core.utils.repr(
      'roka.async.resource.Resource',
        this.name,
        {
          'url':this.url,
          'mimetype':this.mimetype
        });
  }

})( roka.async.resource = {} );
