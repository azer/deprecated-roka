(function( exports ){

  var RequestSet = roka.async.RequestSet;
  var SubjectSet = roka.async.observer.SubjectSet;
  var Struct = roka.oop.Struct;
  var Dict = roka.core.dict.Dict;
  var NotFoundError = roka.errors.NotFoundError;
  var DuplicationError = roka.errors.DuplicationError;
  var partial = roka.core.functional.partial;
  var extend = roka.core.oop.extend;
  var superproto = roka.core.oop.superproto;
  
  const XML_MIME_TYPES = exports.XML_MIME_TYPES = [ 'text/xml', 'text/xsl', 'application/xml' ];
  const JSON_MIME_TYPES = exports.JSON_MIME_TYPES = [ 'text/json' ];

  /**
   * Instances of the DocumentSet class extending Dict class in the core package, provide to 
   * store, manage Document objects defined and also load the documents not fetched.
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   * @see roka.async.documentset.Document;
   */
  var DocumentSet = exports.DocumentSet = function()
  {
    superproto( DocumentSet, this ).constructor.call( this );
    this.events.create('load');

    /**
     * @member DocumentSet
     */
    var requests = new RequestSet();
    this.__defineGetter__('requests',function()
    {
      return requests;
    });

    this.events.subjects.error = requests.events.subjects.error;
  }

  extend( DocumentSet, Dict );

  /**
   * Create a new document and append 
   * @param name {String}
   * @param type {String}
   * @param url {String}
   * @param fetched {Boolean}
   * @param content Optional.
   */
  DocumentSet.prototype.create = function(name,type,url,fetched,content)
  {
    if(this.has(name))
    {
      throw new DuplicationError("Duplicate registeration was attempted. Given key:",name);
    }
    type = type || 'text/plain';
    url = url || '';
    fetched = Boolean(fetched);
    content = content || null;
    var doc = new Document(name,type,url,fetched,content);
    this.set( name, doc );
    return doc;
  }

  /**
   * Fetch not loaded documents by sending request to defined urls
   */
  DocumentSet.prototype.load = function()
  {
    var docstoload = this.values.filter(partial(function(doc)
    {
      if(!doc.fetched && doc.url.length>0)
      {
        this.requests.create( doc.url ); 

        if( doc.type )
        {
          this.requests.get(doc.url)._xhr_.overrideMimeType( doc.type );
        }
      }
      return !doc.fetched && doc.url.length>0;
    },this));

    if(docstoload.length)
    {
      this.requests.events.add_listener('load', partial(function()
      {
        for(var i = -1, len=docstoload.length; ++i < len; ) 
        {
          var doc = docstoload[i];
          var req = this.requests.get( doc.url );
          var content = req.response.text;

          doc.request = req;

          if( XML_MIME_TYPES.indexOf( doc.type )>-1 )
          {
            content = req.response.xml; 
          }
          else if( JSON_MIME_TYPES.indexOf( doc.type )>-1 )
          {
            content = JSON.parse( req.response.text );
          }

          doc.content = content;
          doc.fetched = true;
        };
        this.events.fire('load');
      },this));

      this.requests.send();
    }
    else 
    {
      this.events.fire('load');
    }
  }
  
  /**
   * Document struct. 
   */
  var Document = exports.Document = new Struct(
    'name','type','url','fetched','content'
  );

})( roka.async.documentset = {} );
