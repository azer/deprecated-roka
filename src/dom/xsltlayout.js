(function(exports){

  var ObservationTask = roka.async.tasks.ObservationTask;
  var Layout = roka.dom.layout.Layout;
  var TaskSet = roka.async.taskset.TaskSet;
  var RequestSet = roka.async.requestset.RequestSet;
  var Request = roka.async.request.Request;

  var empty_xml_document = roka.dom.utils.empty_xml_document;
  var partial = roka.core.functional.partial;
  var extend = roka.core.oop.extend;
  var superproto = roka.core.oop.superproto;

  /**
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   * @see roka.async.documentset.DocumentSet
   */
  var XSLTLayout = exports.XSLTLayout = function(widget)
  {
    superproto( XSLTLayout, this ).constructor.call(this,widget);

    /**
     * @member XSLTLayout
     */
    var subresources = new RequestSet();
    this.__defineGetter__('subresources',function()
    {
      return subresources;
    });

    /**
     * XSL Document 
     * @member XSLTLayout
     */
    this.__defineGetter__('template',function()
    {
      return subresources.get('template').response.xml.content;
    });

    subresources.set('template',new Request());
    subresources.get('template')._xhr_.overrideMimeType('application/xml');

    /**
     * Content Document
     * @member XSLTLayout
     */
    
    subresources.set('content',new Request());
    subresources.get('content')._xhr_.overrideMimeType('application/xml');
    this.__defineGetter__('content',function()
    {
      return subresources.get('content').response.xml.content;
    });

    this.__defineSetter__('content',function(value)
    {
      subresources.get('content').response.xml.content = value;
    });

    // set events
    this.events.create('refresh');

    // arrange build task
    this.events.create('transform');
    this.tasks.set('build',new TaskSet());
    this.tasks.get('build').set('transform',new ObservationTask( this.events.subjects.transform ));

    // load task
    this.tasks.set('load',new TaskSet());
    this.tasks.get('load').set('subresources',new ObservationTask( subresources.events.subjects.load ));
    this.events.subjects.load = this.tasks.get('load').events.subjects.success;

    this.events.add_listener('load',partial(this.transform, [], this));

    roka.trace(this,'initialized');
  }

  extend(XSLTLayout,Layout);

  /**
   * Retransform output and append under the current parent node
   */
  XSLTLayout.prototype.refresh = function() 
  {
    roka.trace(this,'refreshing..');
    var parentnode = this.output.content.parentNode;
    var prootnode = this.output.content;

    this.transform();

    parentnode.removeChild( prootnode );
    this.insert( parentnode );

    this.events.fire('refresh');
  };

  /**
   * Process defined xslt template and content
   * @throws TransformError
   */
  XSLTLayout.prototype.transform = function()
  {
    roka.trace(this,'transforming..');

    var xslt_processor = new XSLTProcessor();
    xslt_processor.importStylesheet(this.template);
    var fragment = xslt_processor.transformToFragment(this.content || empty_xml_document,document);
    this.output.content = fragment.firstChild; 

    this.events.fire('transform');
  }

  XSLTLayout.prototype.toString = function()
  {
    return roka.core.utils.repr('XSLTLayout',this.id,{ tasks:this.tasks });
  }

})( roka.dom.xsltlayout = {} );
