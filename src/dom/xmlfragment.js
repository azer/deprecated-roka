(function( exports ){

  var superproto = roka.core.oop.superproto;
  var select = roka.dom.utils.select;
  var query = roka.dom.utils.query;
  
  var creation_counter = 0;
  var XMLFragment = exports.XMLFragment = function()
  {
    /**
     * @member XMLFragment
     */
    var id = 'XMLFragment#'+(++creation_counter);
    this.__defineGetter__('id',function()
    {
      return id;
    });
    this.__defineSetter__('id',function(value)
    {
      id = value;
    });

    /**
     * @member XMLFragment
     */
    var content = null;
    this.__defineGetter__('content',function()
    {
      return content;
    });
    this.__defineSetter__('content',function(value)
    {
      roka.trace(this,'set content',value);
      content = value;
    });

    roka.trace(this,'initialized');
  }

  /**
   * Evaluate CSS selector on root node
   * @param selector {String}
   * @return {roka.dom.utils.SelectionResult}
   */
  XMLFragment.prototype.select = function(selector) 
  {
    roka.trace( this, 'evaluating css selector', selector );
    return select( this.content, selector );
  };

  /**
   * Evaluate XPath query on root node
   * @param xpath_exp {String}
   * @return {roka.dom.utils.SelectionResult}
   */
  XMLFragment.prototype.query = function(xpath_exp) 
  {
    roka.trace( this, 'evaluating query', xpath_exp );
    return query( this.content, xpath_exp );
  };

  XMLFragment.prototype.toString = function() 
  {
    return roka.core.utils.repr('XMLFragment',this.id,{ content:this.content });
  };
  

})( roka.dom.xmlfragment = {} );

