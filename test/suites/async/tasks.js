var Task = roka.async.task.Task;
var ObservationTask = roka.async.tasks.ObservationTask; 
var DOMTask = roka.async.tasks.DOMTask; 
var SchedTask = roka.async.tasks.SchedTask;
var Subject = roka.async.observer.Subject; 

const SUCCESS = roka.async.task.SUCCESS;
const FAILED = roka.async.task.FAILED;
const UNINITIALIZED = roka.async.task.UNINITIALIZED;

var test_task = function()
{
  var t = new Task();
  t.state = UNINITIALIZED;

  t.events.add_listener('success',function()
  {
    assert(t.state == SUCCESS);
    test_task.result = true;
  });

  t.events.add_listener('error',function()
  {
    assert(t.state == FAILED);
    t.events.fire('success');
  });

  t.events.fire('error');

}
test_task.async = true;

var test_domtask = function()
{
  var inc_foobar = document.createElement('script');
  inc_foobar.src = "../misc/foobar.js";

  var t = new DOMTask(inc_foobar,'load');
  t.events.add_listener('success',function(eventobj)
  {
    assert(t.state == SUCCESS);
    test_domtask.result = true;
  });

  document.documentElement.appendChild( inc_foobar );
}

test_domtask.async = true;

var test_obsrvtask = function()
{
  var success = new Subject();
  var error = new Subject();

  var ot = new ObservationTask();
  ot.success_subject = success;
  ot.error_subject = error;

  ot.events.add_listener('success',function(){
    assert(ot.state == SUCCESS);
    test_obsrvtask.result = true;
  });

  ot.events.add_listener('error',function(){
    assert(ot.state == FAILED);
    success.emit();
  });

  error.emit();

}
test_obsrvtask.async = true;

var test_schedtask = function()
{

  var fl = false;

  var st = new SchedTask();
  st.func = function()
  {
    compare( Array.prototype.join.call(arguments,''), '314159265' );
    fl = true;
  }
  
  st.events.add_listener('success',function()
  {
    assert(st.state == SUCCESS);
    assert(fl); 
    test_schedtask.result = true;
  });

  st.run( 314, 159, 265 );

}
test_schedtask.async = true;

var test_schedtask_err = function()
{
  var st = new SchedTask();
  st.func = function()
  {
      err++;
  }
  
  st.events.add_listener('success',function()
  {
    assert(st.state == SUCCESS);
    test_schedtask_err.result = false;
  });
  
  st.events.add_listener('error',function()
  {
    assert(st.state == FAILED);
    test_schedtask_err.result = true;
  });

  st.run();

}
test_schedtask_err.async = true;
