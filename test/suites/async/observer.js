var Subject = roka.async.observer.Subject;
var SubjectSet = roka.async.observer.SubjectSet;

var test_subject = function()
{
  var foo = new Subject();

  foo.subscribe(function(state)
  {
    compare(state,'done');
  });

  assert( foo.observers.length == 1 );

  //
  var tmpfn = new Function();

  foo.subscribe(tmpfn);
  foo.unsubscribe(tmpfn);

  assert( foo.observers.length == 1 );

  foo.subscribe(function(state)
  {
    compare(state,'done');
    test_subject.result = true;
  });

  assert( foo.observers.length == 2 );

  foo.emit('done');

}

test_subject.async = true;

var test_subjectset = function()
{
  var events = new SubjectSet();

  events.create('foo');

  events.add_listener('foo',function(){ exc++; });
  events.add_listener('foo', function(){
    try {
      assert( arguments[0] == 1 );
      assert( arguments[1] == 2 );
      assert( arguments[2] == 3 );
      test_subjectset.result = true;
    } catch(e){
      log(e.stack);
      test_subjectset.result = false;
    }
  });
  
  compare( events.subjects.foo.observers.length, 2 );

  events.fire('foo',1,2,3);
}
test_subjectset.async = true;
