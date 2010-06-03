(function( exports ){

  var SubjectSet = roka.async.observer.SubjectSet;
  var TypeError = roka.errors.TypeError;
  var IndexError = roka.errors.IndexError;
  var NotFoundError = roka.errors.NotFoundError;
  var DuplicationError = roka.errors.DuplicationError;

  var is_instance = roka.core.oop.is_instance;
  var partial = roka.core.functional.partial;

  /**
   * Instances of the List class store data like arrays with extra 
   * functionalities.
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @param cttype  Define a type for the elements
   * @version 1.0
   * @class
   * @constructor
   */
  var List = exports.List = roka.core.List = function(cttype)
  {
    
    /**
     * List class includes an instance of native Array class and store 
     * all data in this object.
     *
     * @member List
     */
    var items = [];
    this.__defineGetter__('items',function()
    {
      return items;
    });
    this.__defineSetter__('items',partial(function(value)
    {
      items = value;
      set_index_accessors(this);
    },[],this));
    
    
    /**
     * List objects emit operations upon itself to subscribers by including 
     * an instance of the SubjectSet.
     *
     * @member List
     */
    var events = new SubjectSet();
    events.create('update');
    events.create('append');
    events.create('remove');
    events.create('set');
    events.create('del');
    this.__defineGetter__('events',function()
    {
      return events;
    });
    
    /**
     * List objects may be used to store objects in just one type. "append" method
     * validates passed elements by using 'is_instance' function when it's defined.
     *
     * @member List
     */
    var type = cttype || null;
    this.__defineGetter__('type',function()
    {
      return type;
    });

    /**
     * Return initial length of the list.
     * @member List
     */
    this.__defineGetter__('length',function()
    {
      return items.length;
    });

    /**
     * Set a boolean to allow or deny duplications of elements
     * @member List
     */
    this.allow_duplication = true;
    
    set_index_accessors(this);
  }

  /**
   * Return the item in specified index
   * @param index {Number}
   * @throws IndexError
   */
  List.prototype._getItem_ = function(ind)
  {
    if(ind<0||ind>=this.items.length)
    {
      throw new IndexError('Index out of range');
    }

    return this.items[ ind ];
  }

  /**
   * Assign given value to specified index of the list by verifying whether given
   * value is an instance of the type if defined. Fires set event finally.
   *
   * @param index {Number}
   * @param value
   * @throws TypeError
   * @throws DuplicationError
   * @throws IndexError
   */
  List.prototype._setItem_ = function(index,value) 
  {
    if(index<0 || index>this.items.length)
    {
      throw new IndexError('Index out of range');
    }
    
    if(this.type!=null && !is_instance( value, this.type ))
    {
      throw new TypeError('Invalid type.');
    }

    var curind = this.items.indexOf( value );
    if( !this.allow_duplication && curind>-1 )
    {
      throw new DuplicationError('Duplicate registeration was attempted.'); 
    }

    var append = true;

    if(index<this.items.length)
    {
      append = false;
      this.events.fire('del',index,this.items[index]);
    }

    this.items[ index ] = value;

    this.events.fire('set',index,value);

    if(append)
    {
      set_index_accessors(this);
      this.events.fire('append',value);
    }

    this.events.fire('update');
  };

  /**
   * Distract specified index from the list and fire "del" event.
   * @param index {Number}
   * @throws IndexError
   */
  List.prototype._delItem_ = function(index)
  {
    if(index<0||index>=this.items.length)
    {
      throw new IndexError('Index out of the range');
    }


    var value = this.items[index];
    this.items = this.items.filter(function(el,ind,arr)
    {
      return ind!=index;
    });

    if( index==this.items.length )
    {
      delete this[index];
    }

    set_index_accessors( this );
    this.events.fire('del',index,value);
    this.events.fire('update');
  }

  /**
   * @param item
   * @see _setItem_
   */
  List.prototype.append = function(el) 
  {
    this._setItem_( this.length, el );
    this.events.fire('append',el);
  };

  /**
   * Returns true if every element in this list satisfies 
   * the provided testing function.
   *
   * @param fn {Function}
   * @return {Boolean}
   */
  List.prototype.every = function(fn)
  {
    return this.items.every(fn);
  }

  /**
   * Creates a new list with all of the elements of this list 
   * for which the provided filtering function returns true. 
   *
   * @param fn {Function}
   * @return {List}
   */
  List.prototype.filter = function(fn)
  {
    var res = new List( this.type );
    res.items = this.items.filter( fn );
    return res;
  }

  /**
   * Call passed function for each item in the list
   * @param fn {Function}
   */
  List.prototype.for_each = function(fn)
  {
    return this.items.forEach(fn);
  }
  
  /**
   * Returns the first (least) index of an element within the array equal to the specified value, or -1 if none is found.
   * @param item
   * @return {Number}
   */
  List.prototype.index = function(item)
  {
    return this.items.indexOf(item); 
  }

  /**
   * Creates a new list with the results of calling a provided 
   * function on every element in this list.
   *
   * @param fn {Function}
   * @return {List}
   */
  List.prototype.map = function(fn)
  {
    var res = new List( this.type );
    res.items = this.items.map(fn);
    return res;
  }
   
  /**
   * Remove specified item and fire remove and update events.
   * @param item
   * @throws NotFoundError
   */
  List.prototype.remove = function(el)
  {
    var ind = this.items.indexOf(el);
    if(ind==-1)
    {
      throw new NotFoundError('Could not found specified item'); 
    }
    this._delItem_( ind );
  }

  List.prototype.toString = function()
  {
    return roka.core.utils.repr('List',this.items.join(','),{ len:this.length });
  }
  
  /**
   * Index accessors are aliases that provide accessing items by using index numbers.
   *
   * @param list {List}
   */
  var set_index_accessors = exports.set_index_accessors = function(list) 
  {
    // init lacking accessors by checking through back

    for(var i = list.length+1, len=list.length; --i > -1; ) 
    {
      var ind = i;
      var has_getter = list.__lookupGetter__(ind)!=undefined;
      var has_setter = list.__lookupSetter__(ind)!=undefined;

      if(has_getter&&has_setter)
      {
        break;
      }

      delete list[i];

      if( i!=list.length )
      {
        list.__defineGetter__( i, partial(function(ind)
        {
          return list._getItem_(ind);
        },[i]));
      }

      list.__defineSetter__(i, partial(function(ind,value)
      {
        list._setItem_(ind,value);
      },[i]));

    };

    // remove invalid accessors by checking through next 
    for(var i = list.items.length; ++i; ) 
    {
      var has_getter = list.__lookupGetter__(i)!=undefined;
      var has_setter = list.__lookupSetter__(i)!=undefined;

      if(!has_getter&&!has_setter)
      {
        break;
      }
      delete list[i];
    };

  };



  /**
   * Make passed function a chainable method of specified list class.
   *
   * @param cls {Function}
   * @param name {String}
   * @param fn {Function}
   */
  var bind = exports.bind = function(cls,name,fn)
  {
    cls.prototype[name] = function()
    {
      if(this.length==0)
      {
        return;
      }

      var obj = this;
      var args = [null];

      Array.prototype.push.apply( args, arguments );

      this.for_each(function(el,ind)
      {
        args[0] = el;
        fn.apply( obj, args );
      });

      return this;
    };
  }

})( roka.core.list = {} );
