var TaskSet = roka.async.taskset.TaskSet;
var Task = roka.async.task.Task;
var ObservationTask = roka.async.tasks.ObservationTask; 
var DOMTask = roka.async.tasks.DOMTask; 
var Subject = roka.async.observer.Subject; 


var test_subscription = function()
{
  var t1 = new Task();
  var t2 = new Task();
  var ts = new TaskSet();

  ts.subscribe(t1);  
  ts.subscribe(t1);  
  compare( t1.events.subjects.success.observers.indexOf( ts._successCallback_ ), 0 );
  compare( t1.events.subjects.error.observers.indexOf( ts._errorCallback_ ), 0 );

  ts.unsubscribe(t1);
  compare( t1.events.subjects.success.observers.indexOf( ts._successcallback_ ), -1 );
  compare( t1.events.subjects.error.observers.indexOf( ts._errorcallback_ ), -1 );

  ts.set( 't', t1 );
  compare( t1.events.subjects.success.observers.length, 1 );
  compare( t1.events.subjects.success.observers.indexOf( ts._successCallback_ ), 0 );
  compare( t1.events.subjects.error.observers.length, 1 );
  compare( t1.events.subjects.error.observers.indexOf( ts._errorCallback_ ), 0 );

  ts.set( 't', t2 );
  compare( t1.events.subjects.success.observers.indexOf( ts._successcallback_ ), -1 );
  compare( t1.events.subjects.error.observers.indexOf( ts._errorcallback_ ), -1 );
  compare( t2.events.subjects.success.observers.length, 1 );
  compare( t2.events.subjects.success.observers.indexOf( ts._successCallback_ ), 0 );
  compare( t2.events.subjects.error.observers.length, 1 );
  compare( t2.events.subjects.error.observers.indexOf( ts._errorCallback_ ), 0 );
}


var test_err = function()
{
  var ts = new TaskSet();
  try
  {
    ts.set(null);
  }catch(exc){
    compare( exc.name, 'TypeError' );
  }
}

var test_taskerr = function()
{
  var t1 = new Task();
  var t2 = new Task();
  var ts = new TaskSet();
  ts.set( 't1', t1 );
  ts.set( 't2', t2 );

  ts.events.add_listener('success',function()
  {
    test_taskerr.result = false;
  });

  ts.events.add_listener('error',function(taskset,task)
  {
    assert(task==t1);
    test_taskerr.result = true;
  });

  t2.events.fire('success');
  t1.events.fire('error',314);

}
test_taskerr.async = true;

var test_nested = function()
{
  /**
   *          t1
   *         /  \
   *        /    \
   *       t2    t3
   *            /  \
   *           t4  t5
   *                 \
   *                 t6
   */

  var t1 = new TaskSet();
  var t2 = new Task();
  var t3 = new TaskSet();
  var t4 = new Task();
  var t5 = new TaskSet();
  var t6 = new Task();

  t1.set( 't2', t2 );
  t1.set( 't3', t3 );
  t3.set( 't4', t4 );
  t3.set( 't5', t5 );
  t5.set( 't6', t6 );

  t1.events.add_listener('success',function()
  {
    try
    {
      compare( t1.state , 1 );
      compare( t2.state , 1 );
      compare( t3.state , 1 );
      compare( t4.state , 1 );
      compare( t5.state , 1 );
      compare( t6.state , 1 );
      test_nested.result = true;
    } catch(exc) {
      log('\nERROR: '+exc.message,'\n',exc.stack,'\n');
    }
  });

  t2.events.fire('success');
  t4.events.fire('success');
  t6.events.fire('success');

}
test_nested.async = true;
