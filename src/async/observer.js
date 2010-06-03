(function(exports){
  
  var partial = roka.core.functional.partial;

  /**
   * Instances of the Subject class maintain to notify state changes to observers.
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var Subject = exports.Subject = function()
  {
    this.name = 'Subject';
    this.observers = [];
  }
  
  /**
   * Emit given parameters to all observers
   */
  Subject.prototype.emit = function() 
  {
    roka.trace(this,'Emitting..',this.observers.length);
    var args = arguments;
    for(var i = -1, len=this.observers.length; ++i < len;) 
    {
      var observer = this.observers[i];
      setTimeout(partial(function(observer)
      {
        observer.apply(null,args);
      },[ this.observers[i] ]),0);
    };
  };

  /**
   * Add new subscriber
   * @param observer {Function}
   */
  Subject.prototype.subscribe = function(observer)
  {
    this.observers.push( observer );
  }

  /**
   * Remove given observer
   * @param observer {Function}
   */
  Subject.prototype.unsubscribe = function(observer)
  {
    this.observers = this.observers.filter(function(el){
      return el!=observer;
    });
  }

  Subject.prototype.toString = function()
  {
    return roka.core.utils.repr('Subject',this.name,{ observers:this.observers });
  }

  /**
   * Instances of the SubjectSet class provides managing a set of observation subjects
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var SubjectSet = exports.SubjectSet = function()
  {
    var subjects = {};
    this.__defineGetter__('subjects',function()
    {
      return subjects;
    });
  }

  /**
   * Make given listener to subscribe to specified subject
   * @param subject_name {String}
   * @param observer {Function}
   */
  SubjectSet.prototype.add_listener = function(subject_name,observer) 
  {
    this.get(subject_name).subscribe(observer);
  };

  /**
   * Create a new observation subject
   * @param subject_name {String}
   */
  SubjectSet.prototype.create = function(subject_name) 
  {
    var subject = new Subject();
    subject.name = subject_name;
    this.subjects[subject.name] = subject;
  };

  /**
   * Emit specified subject
   * @param subject_name {String}
   * @param args  The arguments will be passed to observers
   */
  SubjectSet.prototype.fire = function(subject_name) 
  {
    roka.trace(this,'firing subject',subject_name);
    var subj = this.get(subject_name);
    var args = Array.prototype.slice.call(arguments,1);
    subj.emit.apply( subj, args );
  };

  /**
   * Return specified subject
   * @param subject_name {String}
   */
  SubjectSet.prototype.get = function(subject_name) 
  {
    if(!this.has(subject_name))
    {
      throw new Error('Invalid subject: '+subject_name); 
    }
    return this.subjects[subject_name];
  };

  /**
   * Test presence of given subject name exists in the subjects
   * @param subject_name
   */
  SubjectSet.prototype.has = function(subject_name) 
  {
    return this.subjects.hasOwnProperty(subject_name);
  };
  
  /**
   * Remove specified subject
   * @param subject_name {String}
   */
  SubjectSet.prototype.remove = function(subject_name) 
  {
    delete this.subjects[subject_name];
  };

  /**
   * Make given listener to unsubscribe to specified subject
   * @param subject_name {String}
   * @param observer {Function}
   */
  SubjectSet.prototype.remove_listener = function(subject_name,observer) 
  {
    this.get(subject_name).unsubscribe(observer);
  };

  SubjectSet.prototype.toString = function()
  {
    return roka.core.utils.repr('SubjectSet','',{ subjects:this.subjects });
  }

})( roka.async.observer = {} );
