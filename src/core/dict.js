(function( exports ){

  var SubjectSet = roka.async.observer.SubjectSet;
  var NotFoundError = roka.errors.NotFoundError;
  var format = roka.core.utils.format;

  /**
   * Alternative key-value collection type providing extra features like events and keys in any types.
   * 
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var Dict = exports.Dict = roka.core.Dict = function()
  {
    /**
     * Instances of the Dict class have an event-manager to fire various events like set, del, clear..
     *
     * @member Dict
     */
    var events = new SubjectSet();
    this.__defineGetter__('events',function()
    {
      return events;
    });

    events.create('del');
    events.create('set');
    events.create('append');
    events.create('update');
    events.create('clear');

    /**
     * Store keys in an array.
     * @member Dict
     */
    var keys = [];
    this.__defineGetter__('keys',function()
    {
      return keys;
    });
    this.__defineSetter__('keys',function(value)
    {
      keys = value;
    });

    /**
     * Store values
     * @member Dict
     */
    var values = [];
    this.__defineGetter__('values',function()
    {
      return values;
    });
    this.__defineSetter__('values',function(value)
    {
      values = value;
    });

    /**
     * Return length of the dict by validating length properties of the arrays storing keys and values
     * @member Dict
     */
    this.__defineGetter__('length',function()
    {
      return keys.length;
    });

    roka.trace(this,'Initialized.');

  }

  /**
   * Remove all key-value pairs from the dict
   */
  Dict.prototype.clear = function() 
  {
    this.keys = [];
    this.values = [];
    this.events.fire('clear');
  };

  /**
   * Delete given key-value pair by passed key
   * @param key
   */
  Dict.prototype.del = function(key)
  {
    roka.trace(this,'Removing the item with key',key);
    var ind = -1;

    this.keys = this.keys.filter(function(el,elind,keys)
    {
      var match = el==key;

      if(match)
      {
        ind = elind;
      }

      return !match;
    });

    if(ind==-1) 
    {
      throw new NotFoundError('Could not find any pair with given key: ',key)
    }

    this.values = this.values.filter(function(el,elind,values)
    {
      return elind!=ind;
    });

    validate(this);
    
    this.events.fire('del',key);

  }

  /**
   * Call passed function for each key-value pair in the dict
   * @param fn {Function}
   */
  Dict.prototype.for_each = function(fn)
  {
    for(var i = -1, len=this.length; ++i < len; ) 
    {
      var key = this.keys[i];
      var value = this.values[i];
      fn(key,value,this);
    };
  }

  /**
   * Format each item in the dict by using specified format and join them with passed seperator or a comma
   * @param formatstr {String} The format string
   * @param seperator {String}  The string to seperate formatted items with. Default is comma mark with one space.
   * @return {String}
   * @see roka.core.utils.format
   */
  Dict.prototype.format = function(formatstr, seperator) 
  {
    var items = [];
    for(var i = -1, len=this.length; ++i < len; ) 
    {
      items.push( format( formatstr, { 'key':this.keys[i], 'value':this.values[i] } ) );
    };
    return items.join( seperator == undefined && ',\u0020' || seperator );
  };

  /**
   * Return value that matches with passed key
   * @param key 
   */
  Dict.prototype.get = function(key)
  {
    var ind = this.keys.indexOf( key );
    if(ind==-1)
    {
      throw new NotFoundError('Could not find any pair with given key '+key);
    }
    return this.values[ ind ];
  };

  /**
   * Test presence of passed key
   * @param key
   * @return {Boolean}
   */
  Dict.prototype.has = function(key)
  {
    return this.keys.indexOf( key )>-1;
  }

  /**
   * Append new or update existing key-value pair 
   *
   * @param key
   * @param value
   */
  Dict.prototype.set = function(key,value) 
  {
    roka.trace(this,'setting ',key,value);
    var ind = this.keys.indexOf( key );
    if(ind==-1)
    {
      this.keys.push( key );
      this.values.push( value );
      this.events.fire('append',key,value);
    }
    else
    {
      this.values[ ind ] = value;
      this.events.fire('update',key,value);
    }

    validate(this);

    this.events.fire('set',key,value);
  };

  Dict.prototype.toString = function()
  {
    return roka.core.utils.repr('Dict','',{ 'len':this.length, 'keys':this.keys, 'values':this.values });
  }

  /**
   * Check passed dict for mistakes
   * @param dict {Dict}
   */
  var validate = exports.validate = function(dict)
  {
    if(dict.keys.length!=dict.values.length)
    {
      throw Error('Lengths of the key&value arrays are not equal.');
    }
  }

  

})( roka.core.dict = {} );

