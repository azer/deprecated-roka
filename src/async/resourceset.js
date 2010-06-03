(function( exports ){

  var Dict = roka.core.dict.Dict;
  var SubjectSet = roka.async.observer.SubjectSet;
  var TaskSet = roka.async.taskset.TaskSet;
  var Resource = roka.async.resource.Resource;
  var ObservationTask = roka.async.tasks.ObservationTask;

  var superproto = roka.core.oop.superproto;
  var extend = roka.core.oop.extend;
  var partial = roka.core.functional.partial;

  const UNINITIALIZED = roka.async.task.UNINITIALIZED;
  const FAILED = roka.async.task.FAILED;
  const SUCCESS = roka.async.task.SUCCESS;
  
  /**
   * ResourceSet objects provide store and manage a set of Resource objects. 
   * 
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   * @see roka.async.documentset.Document;
   */
  var ResourceSet = exports.ResourceSet = function()
  {
    superproto(ResourceSet, this).constructor.call( this );

    /**
     * The ResourceSet state
     * @member ResourceSet
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
     * The tasks which have to be completed to load event
     * @member ResourceSet
     */
    var tasks = new TaskSet();
    this.__defineGetter__('tasks',function()
    {
      return tasks;
    });

    // set events
    this.events.create('load');
    this.events.create('error');

    tasks.events.add_listener('success', partial( function()
    {
      state = SUCCESS;
      this.events.fire('load');
    },this));

    tasks.events.add_listener('error', partial( function()
    {
      state = FAILED;
      this.events.fire('error');
    },this));
  }

  extend( ResourceSet, Dict );

  /**
   * Set new resource with specified properties
   * @param name {String}
   * @param url {String}
   * @param mimetype {String}
   */
  ResourceSet.prototype.create = function(name,url,mimetype)
  {
    var r = new Resource();
    r.name = name;
    r.mimetype = mimetype||r.mimetype;
    r.url = url;
    this.set( name, r );
    return r;
  };

  ResourceSet.prototype.set = function(key, resource) 
  {
    superproto( ResourceSet, this ).set.call( this, key, resource );
    roka.trace(this,'setting new resource.', 'key:'+key, 'request:',resource);
    this.tasks.set( key, new ObservationTask( resource.events.subjects.load, resource.events.subjects.error ) ); 
  };

  ResourceSet.prototype.del = function(key) 
  {
    this.tasks.del( key );
    superproto( ResourceSet, this ).del.call( this, key );
  };

  /**
   * Start to load resources.
   */
  ResourceSet.prototype.load = function() 
  {
    for(var i = -1, len=this.length; ++i < len; )
    {
      var resource = this.get( this.keys[i] );
      resource.load();
    };
  };

  ResourceSet.prototype.toString = function() 
  {
    return roka.core.utils.repr(
      'roka.async.resourceset.ResourceSet',
      this.id,
      {
        len:this.length
      }
    );
  };

})( roka.async.resourceset = {} );

