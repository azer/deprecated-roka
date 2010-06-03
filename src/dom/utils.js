(function(exports){

  var ParseError = roka.errors.ParseError;
  var TypeError = roka.errors.TypeError;
  var NotFoundError = roka.errors.NotFoundError;

  var partial = roka.core.functional.partial;

  var css = roka.dom.css;

  /**
   * Add given elements to specified parent node.
   *
   * @param parent_el {Element} Parent Node
   * @param element {Element} 
   * @return {Element}  Parent node
   */
  var add = exports.add = function(parent_el)
  {
    for(var i=0,len=arguments.length; ++i<len;)
    {
      parent_el.appendChild(arguments[i]);
    }
    return parent_el;
  }

  /**
   * Add given element(s) after specified node. Reference node is last argument.
   *
   * @param parent_el {Element} Parent element
   * @param element {Element} The element to be added
   * @param refnode {Element} The reference node element will be appended after
   * @return {Element} Parent element
   */
  var add_after = exports.add_after = function(parent_el)
  {
    var refnode = arguments.length>2 && arguments[ arguments.length -1 ] || null;

    if( refnode.nextSibling )
    {
      Array.prototype.splice.call(arguments,-1,1,refnode.nextSibling);
      return add_before.apply( null, arguments );
    }
    else
    {
      return add.apply(null, Array.prototype.slice.call(arguments, 0, arguments.length -1 ));      
    }
  }

  /**
   * Add given element(s) before specified node. Reference node is last argument.
   *
   * @param parent_el {Element} Parent element
   * @param element {Element} The element to be appended
   * @param refnode {Element} Reference Element
   * @return {Element} Parent element
   */
  var add_before = exports.add_before = function(parent_el)
  {
    var refnode = arguments[ arguments.length-1 ];
    for(var i=0,len=arguments.length-1; ++i<len;)
    {
      parent_el.insertBefore(arguments[i],refnode);
    }
    return parent_el; 
  }

  /**
   * @param obj {Object}
   * @param event {String}
   * @param listener {Function}
   * @param use_capture {Boolean}
   * @return {Object}
   */
  var add_event_listener = exports.add_event_listener = function(obj,event_name,listener,use_capture)
  {
    obj.addEventListener(event_name,listener,use_capture||false);
    return obj;
  }

  /**
   * Create a new, extended element
   *
   * @param tag {String}
   * @param doc {Document}  Optional
   * @return {Element}
   */
  var create = exports.create = function(doc,tag)
  {
    var el = doc.createElement(tag);
    return el;
  }

  /**
   * Empty XML Document
   */
  var empty_xml_str = exports.empty_xml_str = '<roka/>';
  var empty_xml_doc = null;
  exports.__defineGetter__('empty_xml_document',function()
  {
    if(!empty_xml_doc)
    {
      empty_xml_doc = parse( empty_xml_str );
    }
    return empty_xml_doc;
  });

  /**
   * @param el {Element}
   * @param name {String}
   */
  var getattr = exports.getattr = function(el,name)
  {
    return el.getAttribute(name);
  }

  /**
   * @param el {Element}
   * @param ind {Number}
   * @return {Element}  Childnode in specified index
   */
  var get_child = exports.get_child = function(el,ind)
  {
    return el.childNodes[ ind ];
  }

  /**
   * Insert given node to specified parent element.
   *
   * @param el {Element}  The element to be appended
   * @param parent_el {Element} Parent element
   * @return {Element}  The element to be appended
   */
  var insert = exports.insert = function(el,parent_el)
  {
    parent_el.appendChild(el);
    return el;
  }

  /**
   * Insert 'el' after 'refnode' to 'parent_el'
   *
   * @param el {Element}  The element to be appended
   * @param refnode {Element} Reference element
   * @param parent_el {Element} Parent element. Optional.
   * @return {Element}  The element to be appended
   */
  var insert_after = exports.insert_after = function(el,refnode,parent_el)
  {
    if( refnode.nextSibling )
    {
      insert_before(el,refnode.nextSibling);
    }
    else
    {
      insert( el, refnode.parentNode );
    }
    return el;
  }

  /**
   * Insert 'el' after 'refnode' to 'parent_el'
   *
   * @param el {Element}  The element to be appended
   * @param refnode {Element} Reference element
   * @param parent_el {Element} Parent element. Optional.
   * @return {Element}  The element to be appended
   */
  var insert_before = exports.insert_before = function(el,refnode,parent_el)
  {
    ( parent_el || refnode.parentNode ).insertBefore( el, refnode );
    return el;
  }

  /*
   * Evaluate XPath expression on passed node.
   *
   * @param found {Array} 
   * @param node {Element}
   * @param xpath_exp {String}
   * @return {Array}  The found array passed as first argument.
   *
   * @see roka.dom.utils.extend
   */
  var query = exports.query = function(node,xpath_exp)
  {
    var found = [];
    var xpe = new XPathEvaluator();
  
    var ns_resolver = xpe.createNSResolver( 
      node.ownerDocument == null && 
        node.documentElement || 
        node.ownerDocument.documentElement
    );

    var result = xpe.evaluate(xpath_exp, node, ns_resolver, 0, null);
    var n;
    while(n = result.iterateNext())
    {
      found.push(n);
    }
    return found;
  };

  /**
   * @param obj {Object}
   * @param event {String}
   * @param listener {Function}
   * @param use_capture {Boolean}
   * @return {Object}
   */
  var remove_event_listener = exports.remove_event_listener = function(obj,event_name,listener,use_capture)
  {
    obj.removeEventListener(event_name,listener,use_capture||false);
    return obj;
  }

  /**
   * Evaluate given CSS Selector by using querySelectorAll method of the specified DOM element.
   * 
   * @param element {Element}
   * @param selector {String} The CSS selector to be evaluated
   * @return {Array}
   * @see roka.dom.utils.query
   */
  var select = exports.select = function(element,selector)
  {
    return Array.prototype.slice.call( element.querySelectorAll( selector ) );
  }

  /**
   * Set given attribute and return back the element.
   *
   * @param el {Element}  The element to set attribute
   * @param name {String} Attribute name
   * @param value {String}  Attribute value
   * @return {Element}  The element to set attribute
   */
  var setattr = exports.setattr = function(el,name,value)
  {
    el.setAttribute(name,value);
    return el;
  }

  /**
   * Parse given string to DOM tree
   * @param str
   */
  var parse = exports.parse = function(str)
  {
    var parser = new DOMParser();
    var dom = parser.parseFromString(str,'text/xml');
    if(dom.documentElement.nodeName=='parsererror')
    {
      throw new ParseError('Could not parse given string to XML');
    }
    return dom;
  }

})( roka.dom.utils = {} );
