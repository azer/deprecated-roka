(function(exports){

  var Dict = roka.core.dict.Dict;
  var SubjectSet = roka.async.observer.SubjectSet;
  var TypeError = roka.errors.TypeError;
  var XHRResponse = roka.async.xhrresponse.XHRResponse;

  var partial = roka.core.functional.partial;
  var is_instance = roka.core.oop.is_instance;

  const UNINITIALIZED = roka.async.task.UNINITIALIZED;
  const FAILED = roka.async.task.FAILED;
  const SUCCESS = roka.async.task.SUCCESS;

  const GET = exports.GET = new String('GET');
  const POST = exports.POST = new String('POST');

  /**
   * An event-driven proxy of XMLHttpRequest class.
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var creation_counter = 0;
  var Request = exports.Request = function()
  {
    /**
     * Immutable ID of the request
     * @member Request
     */
    var id = 'Request#'+(++creation_counter);
    this.__defineGetter__('id',function()
    {
      return id;
    });

    /**
     * The request state. 
     * @member Request
     */
    var state = UNINITIALIZED;
    this.__defineGetter__('state',function()
    {
      return state;
    });
    this.__defineSetter__('state',function(value)
    {
      state = value;
    });

    /**
     * The XMLHttpRequest object to send the request
     * @member Request
     */
    var xhr = new XMLHttpRequest();
    this.__defineGetter__('_xhr_',function()
    {
      return xhr;
    });

    /**
     * Manage events that is being used to create callbacks
     * @member Request
     */
    var events = new SubjectSet();
    events.create('abort');
    events.create('error');
    events.create('load');
    events.create('loadstart');
    events.create('progress');
    events.create('uploadprogress');
    events.create('readystatechange');
    this.__defineGetter__('events',function()
    {
      return events;
    });

    /**
     * Whether the request is synchronous or asynchronous
     * @member Request
     */
    var async = true;
    this.__defineGetter__('async',function()
    {
      return async;
    });

    /**
     * The HTTP method of the request
     * @member Request
     */
    var method = GET;
    this.__defineGetter__('method',function()
    {
      return method;
    });
    this.__defineSetter__('method',function(value)
    {
      if( value!=GET && value!=POST )
      {
        throw new TypeError('Invalid request method.');
      }
      method = value;
    });

    /**
     * A Dict instance containing parameters of the request
     * @member Request
     */
    var params = new Dict();
    this.__defineGetter__('params',function()
    {
      return params;
    });
    
    /**
     * Return ready state
     * @member Request
     */
    this.__defineGetter__('load_state',function()
    {
      return xhr.readyState;
    });

    /**
     * A proxy object linking response information of the XHR object
     * @member Request
     * @see roka.async.request.XHRResponse
     */
    var response = new XHRResponse();
    response.request = this;
    this.__defineGetter__('response',function()
    {
      return response;
    });

    /**
     * Parse numerical value of the xhr object's status to object and bind a new method named
     * toString returning statusText value of the xhr object.
     *
     * @member Request 
     */
    this.__defineGetter__('status',function()
    {
      var status = 0;
      try
      {
        status = new Number(xhr.status);
      }
      catch(exc)
      {}
      
      status.toString = function()
      {
        return xhr.statusText; 
      }
      return status;
    });

    /**
     * The url to which to send the request
     * @member Request
     */
    var url = null;
    this.__defineGetter__('url',function()
    {
      return url;
    });
    this.__defineSetter__('url',function(value)
    {
      url = value;
    });

    xhr.onabort = partial( events.subjects.abort.emit, [ response, this ], events.subjects.abort );
    xhr.onerror = partial( events.subjects.error.emit, [ response, this ], events.subjects.error );
    xhr.onprogress = partial( events.subjects.progress.emit, [ response, this ], events.subjects.progress ); 
    xhr.onreadystatechange = partial( events.subjects.readystatechange.emit, [ response, this ], events.subjects.readystatechange ); 

    xhr.addEventListener('readystatechange',partial(function()
    {
      roka.trace(this,'readystatechange');
      if( this.load_state == 4 && this.status!=200 )
      {
        roka.trace(this,' firing error event');
        this.state = FAILED;
        this.events.fire('error',this);
      }
      else if( this.load_state == 4 && this.status==200 )
      {
        roka.trace(this,' firing success event');
        this.state = SUCCESS;
        this.events.fire('load',this);
      }

    },[],this),false);

    roka.trace( this, 'initialized' );

  }

  /**
   * Prepare parameters that will be sent and start the transfer
   */
  Request.prototype.send = function()
  {
    roka.trace(this,'Sending..');
    var params = null;
    var url = this.url;

    if( this.params.length > 1 )
    {
      params = this.params.format('%(key)s=%(value)s','&');
    }

    if( this.method == GET && params )
    {
      url += ( url.indexOf('?')>-1 && '' || '?' )+params;
    }

    this._xhr_.open( this.method, url, this.async );
    this._xhr_.send( this.method == POST && params || null );
  }

  Request.prototype.toString = function()
  {
    return roka.core.utils.repr('Request',this.id,{ url:this.url, state:this.state, status:this.status, load_state:this.load_state });
  }

})( roka.async.request = {} );
