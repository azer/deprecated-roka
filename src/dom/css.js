(function(exports){

  /**
   * Apply properties in given CSS object to the specified element.
   *
   * @param el {Element}  The element to apply the properties to
   * @param css {Object}  The properties to apply
   * @return {Element} Passed Element
   */
  var apply = exports.apply = function(el,css)
  {
    for(var pname in css)
    {
      set( el, pname, css[ pname ] ); 
    }
    return el;
  }

  /**
   * Add a class name to given element
   *
   * @param el {Element}  The element to add the classname to
   *
   * @param class_name {String} The class name to add to the class attribute
   * @return {Element}  Passed element
   */
  var add_class = exports.add_class = function(el,class_name)
  {
    if(!has_class( el, class_name ))
    {
      set_class(el, get_class(el)+' '+class_name );
    }
    return el;
  }

  /**
   * Return value of the class name attribute
   *
   * @param el {Element}  The element to get class
   * @param {String}
   */
  var get_class = exports.get_class = function(el)
  {
    return el.className;
  }

  /**
   * Return a RegExp instance to match given class name
   *
   * @param class_name {String} The class to match
   * @return {RegExp}
   */

  var get_class_pattern = exports.get_class_pattern = function(class_name)
  {
    return ( new RegExp('(?:^|\\s+)'+class_name+'(?:\\s+|$)','gi') );
  }

  /**
   * Test presence of given class in an HTML element 
   *
   * @param el {Element}  The element to test
   * @param class_name {String}  The class name to search for
   * @return {Boolean}
   */
  var has_class = exports.has_class = function(el,class_name)
  {
    return get_class_pattern( class_name ).test( get_class( el ) ); 
  }

  /**
   * Remove specified class from given element.
   *
   * @param el {Element}  The element to remove the class from
   * @param class_name {String}  The class name to remove from the class attribute
   * @return {Element} Passed element
   */
  var remove_class = exports.remove_class = function(el,class_name)
  {
    if(!has_class( el, class_name ))
    {
      throw new Error('Given element has not got specified class already.');
    }
    replace_class( el, class_name, ''); 
    return el
  }

  /**
   * Replace a class with given class for specified element 
   *
   * @param el {Element}  The element to replace class from
   * @param class_name {String} The class to be replaced
   * @param replacement {String}  The class that will be replacement of the class_name
   * @return {Element}  Passed element
   */
  var replace_class = exports.replace_class = function(el,class_name,replacement)
  {
    set_class( el, get_class( el ).replace( get_class_pattern( class_name ), ' '+replacement+' ' ) );
    return el;
  }

  /**
   * Set value of the className attribute of given element
   *
   * @param el {Element}  The element to set class name attribute of
   * @param value {String}  New value of the className attribute 
   * @return {Element}  Passed element
   */
  var set_class = exports.set_class = function(el,value)
  {
    el.className = value.trim();
    return el;
  }

  /*
   * Toggle given class on specified element 
   *
   * @param el {Element}  The element to toggle class on
   * @param class_name {String} A class name to be toggled for the element
   * @return {Element}
   */
  var toggle_class = exports.toggle_class = function(el,class_name)
  {
    if( has_class( el, class_name ) )
    {
      remove_class(el,class_name);
    }
    else
    {
      add_class( el, class_name );
    }
    return el;
  }

  /**
   * Return absolute value of given CSS property by using getComputedStyle of window object.
   *
   * @param el {Element}  The element to get CSS info
   * @param pname {String}  The property name to get the CSS value of
   * @return {String}
   */
  var get = exports.get = function(el,pname)
  {
    var style = el.ownerDocument.defaultView.getComputedStyle( el, null );
    var value = style.getPropertyCSSValue( pname );
    return value&&value.cssText||null;
  }

  /**
   * Set given CSS property on the specified HTML element.
   *
   * @param el {Element}  The element to set CSS property
   * @param pname {String}  Property name
   * @param pvalue {String} Value
   * @return {String} Specified Element
   */
  var set = exports.set = function(el,pname,pvalue)
  {
    pname = pname.replace(/\-(\w)/g,function(){ return arguments[1].toUpperCase() });
    el.style[ pname ] = pvalue;
    return el;
  }

})( roka.dom.css = {} );
