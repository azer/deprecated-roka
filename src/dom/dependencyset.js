(function( exports ){
  
  var SubjectSet = roka.async.observer.SubjectSet;
  var TaskSet = roka.async.taskset.TaskSet;
  var DOMTask = roka.async.tasks.DOMTask;
  var ObservationTask = roka.async.tasks.ObservationTask;
  var XMLFragment = roka.dom.xmlfragment.XMLFragment;
  var Request = roka.async.request.Request;

  var partial = roka.core.functional.partial;
  var each = roka.core.functional.each;

  var get_dir = roka.core.utils.get_dir;
  var get_url = roka.core.utils.get_url;

  /**
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var creation_counter = 0;
  var DependencySet = exports.DependencySet = function()
  {

    /**
     * Immutable ID
     * @member DependencySet
     */
    var id = "DependencySet#"+( ++creation_counter );
    this.__defineGetter__('id',function()
    {
      return id;
    });

    /**
     * The document containing dependency info
     * @member dependencySet
     */
    var document = null;
    this.__defineGetter__('document',function()
    {
      return document;
    });
    this.__defineSetter__('document',function(value)
    {
      document = value;
    });

    /**
     * Child dependency sets
     * @member DependencySet
     */
    var children = [];
    this.__defineGetter__('children',function()
    {
      return children;
    });
    this.__defineSetter__('children',function(value)
    {
      children = value;
    });
    

    /**
     * @member DependencySet
     */
    var events = new SubjectSet();
    this.__defineGetter__('events',function()
    {
      return events;
    });

    /**
     * Javascript modules
     * @member DependencySet
     */
    var modules = [];
    this.__defineGetter__('modules',function()
    {
      return modules;
    });
    this.__defineSetter__('modules',function(value)
    {
      modules = value;
    });
    

    /**
     * CSS dependencies
     * @member DependencySet
     */
    var stylesheets = [];
    this.__defineGetter__('stylesheets',function()
    {
      return stylesheets;
    });
    this.__defineSetter__('stylesheets',function(value)
    {
      stylesheets = value;
    });

    /**
     * The tasks that has to be done to fire load event
     * @member DependencySet
     */
    var tasks = new TaskSet();
    this.__defineGetter__('tasks',function()
    {
      return tasks;
    });
    this.__defineSetter__('tasks',function(value)
    {
      tasks = value;
    });

    /**
     * Working Directory
     * @member DependencySet
     */
    var wd = "";
    this.__defineGetter__('wd',function()
    {
      return wd;
    });
    this.__defineSetter__('wd',function(value)
    {
      roka.trace(this,'setting wd',value);
      wd = value;
    });
    
    
    // set events and tasks
    events.create('import-document');
    events.subjects.load = tasks.events.subjects.success;

    events.add_listener('import-document',partial(this.load,[],this));

    roka.trace(this,'initialized');
    
  }

  /**
   * Load and parse dependency information from specified document
   * @param path {String}
   */
  DependencySet.prototype.import_document = function(path) 
  {
    roka.trace(this,'importing document from ',path);

    this.wd = get_dir(path);

    if(path.substring(0,1)!='/')
    {
      roka.trace(this,'relative url');
      var sd = get_dir( get_url(2) ); // directory of the script called this function
      this.wd = sd+'/'+this.wd; // the directory in which the dependencyset document is placed
      path = sd+'/'+path;
      roka.trace(this,'script dir:',sd,' path',path);
    }

    var req = new Request();
    req.url = path;
    req.events.add_listener('load',partial(function()
    {
      this.document = req.response.xml;

      roka.trace(this,'parsing document');

      var wd = this.wd;
      var filter = function(attr)
      {
        return wd+'/'+attr.nodeValue;
      };

      each(this.document.query('//Dependencies/Module/@path').map(filter))
        (partial(Array.prototype.push, [], this.modules));

      each(this.document.query('//Dependencies/Stylesheet/@path').map(filter))
        (partial(Array.prototype.push, [], this.stylesheets));

      each(this.document.query('//Dependencies/*[local-name()="Widget" or local-name()="Application" or local-name()="DependencySet"]/@path').map(filter))
        (partial(Array.prototype.push, [], this.children));

      this.events.fire('import-document');
    },[],this));
    req.send();
  };

  /**
   * Import dependencies
   */
  DependencySet.prototype.load = function() 
  {
    var container_id = 'dependencyset_'+this.id.match(/\d+$/)[0];
    var container = document.querySelector('#'+container_id);

    roka.trace(this,'loading.. container:',container_id,container);

    if(!container)
    {
      container = document.createElement('section');
      container.setAttribute('id',container_id);
      ( document.querySelector('head') || document.documentElement ).appendChild( container );
    }

    this.modules.forEach(partial(function(path)
    {
      roka.trace(this,'importing module ',path);

      var script = document.documentElement.hasAttribute('xmlns') && document.createElementNS(document.documentElement.getAttribute('xmlns'),'script') || document.createElement('script');
      script.setAttribute('type','text/javascript');
      script.setAttribute('src',path);
      script.async = true;

      this.tasks.set(path,new DOMTask( script, 'load' ));

      container.appendChild( script );
    },[],this));

    this.stylesheets.forEach(partial(function(path)
    {
      roka.trace(this,'loading stylesheet',path);

      var link = document.createElement('link');
      link.setAttribute('rel','stylesheet');
      link.setAttribute('href',path);

      container.appendChild( link );
    },[],this));

    // load subdependencysets
    this.children.forEach(partial(function(path)
    {
      roka.trace(this,'loading child dpset ',path,'wd',this.wd);
      var dpset = new DependencySet();
      dpset.import_document(path);
      this.tasks.set( path, new ObservationTask( dpset.events.subjects.load ) );
    },[],this));

    if( this.tasks.length == 0 && this.tasks.state == -1 )
    {
      this.tasks.events.fire('success');
    }

  };

  DependencySet.prototype.toString = function()
  {
    return roka.core.utils.repr('DependencySet',this.id,{ document:this.document, modules:this.modules, stylesheets:this.stylesheets });
  }

  /**
   * A short way to import a dependency document and load its content.
   * @param path {String}
   * @param callback {Function}
   * @param {DependencySet}
   */
  var load = exports.load = roka.dom.load = function(path,callback)
  {
    
    if(path.substring(0,1)!='/')
    {
      var sd = get_dir( get_url(2) ); // directory of the script called this function
      path = sd+'/'+path;
    }

    roka.trace('loading dependencyset, ',path,'<-',arguments[0]);

    var dpset = new DependencySet();
    dpset.events.add_listener('load',callback);
    dpset.import_document(path);
    return dpset;
  }
  

})( roka.dom.dependencyset = {} );
