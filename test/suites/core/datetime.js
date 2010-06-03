var DateTime = roka.core.datetime.DateTime;

var test_types = function(){
  
  var now = new DateTime();
  
  assert( typeof now.day == 'number' );
  assert( typeof now.day_zp == 'string' );

  assert( typeof now.month == 'number' );
  assert( typeof now.month_zp == 'string' );

  assert( typeof now.year == 'number' );

  assert( typeof now.hour == 'number' );
  assert( typeof now.hour_zp == 'string' );

  assert( typeof now.hour == 'number' );
  assert( typeof now.hour_zp == 'string' );

  assert( typeof now.minute == 'number' );
  assert( typeof now.minute_zp == 'string' );

  assert( typeof now.second == 'number' );
  assert( typeof now.second_zp == 'string' );

  assert( typeof now.weekday == 'number' );
  assert( typeof now.weekday_zp == 'string' );
}

var test_container = function(){
  
  var dateobj = new Date();
  var now = new DateTime();
  now._date_ = dateobj;

  compare( now.day, dateobj.getDate() );
  compare( now.month, dateobj.getMonth()+1 );
  compare( now.year, dateobj.getFullYear() );
  compare( now.weekday, dateobj.getDay()+1 );
  compare( now.hour, dateobj.getHours() );
  compare( now.minute, dateobj.getMinutes() );
  compare( now.second, dateobj.getSeconds() );

}

var test_setters = function(){
  var bd = new DateTime(); // my birthdate
  bd.day = 15;
  bd.month = 6;
  bd.year = 1987;

  assert(bd.weekday == 2);
  assert(bd.day == 15);
  assert(bd.month == 6);
  assert(bd.year == 1987);
}

var test_format = function(){
  var bd = new DateTime();
  bd.day = 15;
  bd.month = 6;
  bd.year = 1987;
  bd.hour = 7;
  bd.minute = 30;
  bd.second = 0;

  compare(bd.datetime, 'Mon Jun 15 07:30:00 1987'); 
}
