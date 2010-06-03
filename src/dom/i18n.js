(function( exports ){
  
  var Dict = roka.core.dict.Dict;
  var NotFoundError = roka.errors.NotFoundError;
  var RequestSet = roka.async.requestset.RequestSet;
  var ObservationTask = roka.async.tasks.ObservationTask;

  var query = roka.dom.utils.query;
  var partial = roka.core.functional.partial;
  var superproto = roka.core.oop.superproto;
  var extend = roka.core.oop.extend;

  /**
   * I18N objects provide Roke applications an interface to define, store and manage localization documents.
   * It's a basic subclass of the RequestSet class. The most important difference is that
   * I18N objects' are documents that are being asynchronously fetched. Because of that reason, item names are
   * being altered from urls to language names when they are loaded.
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   * @see roka.async.requestset.RequestSet;
   */
  var I18N = exports.I18N = function()
  {
    superproto(I18N,this).constructor.apply(this,arguments);
    
    /**
     * Default language being used by get_text method
     * @member I18N 
     * @see I18N.get_text
     */
    var default_language = null;
    this.__defineGetter__('default_language',function()
    {
      return default_language;
    });
    this.__defineSetter__('default_language',function(value)
    {
      default_language = value;
    });

    /**
     * Item keys should be altered after loading documents. Create an event and set an observation task
     * referencing that.
     */
    this.events.create('alter-keys');
    this.tasks.set('alter-keys',new ObservationTask( this.events.subjects['alter-keys'] ));
    this.tasks.get('load').events.add_listener('success',partial(function(){
      
      roka.trace(this,'altering request keys');
      for(var i = -1, len=this.keys.length; ++i < len; ) 
      {
        var req = this.values[i];
        this.keys[i] = req.response.xml.query('//messages/@lang')[0].nodeValue;
      };
      
      roka.trace(this,'key alteration is done');

      this.events.fire( 'alter-keys' );

    },[],this));
    
  }

  extend( I18N, RequestSet );


  /**
   * Append new url to the url set of localization packages which will be fetched.
   *
   * @param url {String}
   */
  I18N.prototype.append = RequestSet.prototype.create;
  delete I18N.prototype.create;


  /**
   * Append new url to the url set of localization packages which will be fetched.
   *
   * @param url {String}
   */
  I18N.prototype.load = RequestSet.prototype.send;
  delete I18N.prototype.send;

  /**
   * Return text of the localization entry matching with specified msgid 
   *
   * @param msgid {String}  The key string to be translated
   * @return {String} The text matching with specified msgid
   * @throws roka.errors.NotFoundError
   */
  I18N.prototype.get_text = function(msgid)
  {
    if( !msgid || typeof msgid!='string')
    {
      throw new TypeError('Invalid msgid '+msgid);
    }

    if( !this.has( this.default_language ) )
    {
      roka.trace( this, 'Could not found any localization package matching with default language' );
      throw new NotFoundError('Invalid language '+this.default_language);
    }

    var found = this.get( this.default_language ).response.xml.query( '//msg[@id="'+msgid+'"]/text/text()');
    
    if( found.length==0 )
    {
      throw new NotFoundError('Could not found any message with given id:'+msgid);
    }

    return found[0].nodeValue;
  };

  I18N.prototype.toString = function()
  {
    return roka.core.utils.repr('roka.dom.i18n.I18N',this.id,{ 'keys':this.keys.toString(), 'default language':this.default_language }); 
  }

  /**
   * Find and replace content of the elements which have "i18n:key" attribute
   *
   * @param node {Node}
   * @param lcset {I18N}
   */
  var localize = exports.localize = function(node)
  {
    var found = query( node, ".//*[@*[name()='i18n:msgid']]" ); 
    for(var i = -1, len=found.length; ++i < len; ) 
    {
      var el = found[i];
      var msgid = el.getAttribute('i18n:msgid');
      var text = null;

      for(var n = 0, lcslen=arguments.length; ++n < lcslen; ) 
      {
        var lcset = arguments[n];
        try
        {
          text = lcset.get_text(msgid);
          break;
        }
        catch(exc)
        {
          switch(exc.constructor)
          {
            case NotFoundError: break;
            default:
              throw exc;
          }
        }
      };
      
      el.textContent = text || ('$'+msgid);
    };
  }


})( roka.dom.i18n = {} );
