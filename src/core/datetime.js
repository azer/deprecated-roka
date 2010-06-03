(function(exports){

  var format = roka.core.utils.format;
  var ljust = roka.core.utils.ljust;

  /**
   * DAYS constant is an array containing english weekday names.
   */
  const DAYS = exports.DAYS = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

  /**
   * MONTHS constant is an array containing english weekday names.
   */
  const MONTHS = exports.MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

  /**
   * Store names of equivalent properties
   * http://en.wikipedia.org/wiki/Date_(Unix)
   */
  var format_specifiers = exports.format_specifiers =
  {
    // day
   'a':'weekday_name_abbr',
   'A':'weekday_name',
   'd':'day_zp',
   'e':'day',
   'u':'weekday',
   // month
   'm':'month_zp',
   'h':'month_name_abbr',
   'B':'month_name',
   // year
   'y':'year_abbr',
   'Y':'year',
   // hours
   'k':'hour',
   'H':'hour_zp',
   // minutes
   'M':'minute',
   // seconds
   's':'unixtime',
   'S':'second_zp',
    // date and time
   'F':'date',
   'T':'time',
   'c':'datetime'
  };
  
  /*
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var DateTime = exports.DateTime = function()
  {

    var dateobj = new Date();
    this.__defineGetter__('_date_',function()
    {
      return dateobj;
    });
    this.__defineSetter__('_date_',function()
    {
      dateobj = arguments[0];
    });

    /**
     * %Y-%m-%d
     * @member DateTime
     */
    this.__defineGetter__('date',function()
    {
      return strftime('%Y-%m-%d',this);
    });

    /**
     * Return Date and Time. E.g: Sat Nov 04 12:02:33 1989
     * @member DateTime
     */
    this.__defineGetter__('datetime',function()
    {
      return strftime('%a %h %d %H:%M:%S %Y',this);
    });

    /**
     * Between 1 and the number of days in the month of the year.
     * @member DateTime
     */
    this.__defineGetter__('day',function()
    {
      return dateobj.getDate();
    });

    /**
     * Return day zero-padded
     * @member DateTime
     */
    this.__defineGetter__('day_zp',function()
    {
      return zeropadded(this.day);
    });

    /**
     * Set day of the month
     * @member DateTime
     */
    this.__defineSetter__('day',function()
    {
      return dateobj.setDate(arguments[0]);
    });
    
    /**
     * In range between 0 and 23
     * @member DateTime
     */
    this.__defineGetter__('hour',function()
    {
      return dateobj.getHours();
    });

    /**
     * @member DateTime
     */
    this.__defineGetter__('hour_zp',function()
    {
      return zeropadded(this.hour);
    });

    /**
     * Set the hours
     * @member DateTime
     */
    this.__defineSetter__('hour',function()
    {
      return dateobj.setHours(arguments[0]);
    });

    /**
     * Miliseconds
     * @member DateTime
     */
    this.__defineGetter__('millisecond',function()
    {
      return dateobj.getMilliseconds();
    });

    this.__defineSetter__('millisecond',function()
    {
      return dateobj.setMilliseconds(arguments[0]);
    });

    /**
     * In range between 0 and 59
     * @member DateTime
     */
    this.__defineGetter__('minute',function()
    {
      return dateobj.getMinutes();
    });

    /**
     * Set the minutes
     * @member DateTime
     */
    this.__defineSetter__('minute',function()
    {
      return dateobj.setMinutes(arguments[0]);
    });

    /**
     * Return the minutes zeropadded
     * @member DateTime
     */
    this.__defineGetter__('minute_zp',function()
    {
      return zeropadded( this.minute );
    });

    /**
     * Return the month (1-12)
     * @member DateTime
     */
    this.__defineGetter__('month',function()
    {
      return dateobj.getMonth()+1;
    });

    /**
     * Return the month zeropadded (MM)
     * @member DateTime
     */
    this.__defineGetter__('month_zp',function()
    {
      return zeropadded( this.month );
    });


    /**
     * Return name of the month
     * @member DateTime
     */
    this.__defineGetter__('month_name',function()
    {
      return MONTHS[ this.month-1 ];
    });

    /**
     * Abbreviated name of the month
     * @member DateTime
     */
    this.__defineGetter__('month_name_abbr',function()
    {
      return this.month_name.substring(0,3);
    });

    /**
     * Set the month
     * @member DateTime
     */
    this.__defineSetter__('month',function()
    {
      return dateobj.setMonth(arguments[0]-1);
    });


    /**
     * In range between 0 and 59
     * @member DateTime
     */
    this.__defineGetter__('second',function()
    {
      return dateobj.getSeconds();
    });

    this.__defineGetter__('second_zp',function()
    {
      return zeropadded(this.second);
    });

    /**
     * Set the seconds
     * @member DateTime
     */
    this.__defineSetter__('second',function()
    {
      return dateobj.setSeconds(arguments[0]);
    });

    /**
     * HH:MM:SS
     * @member DateTime
     */
    this.__defineGetter__('time',function()
    {
      return strftime('%H:%M:%S');
    });

    /**
     * Return unixtime
     * @member DateTime
     */
    this.__defineGetter__('unixtime',function()
    {
      return new Number(dateobj);
    });

    /**
     * In range between 1 and 7
     * @member DateTime
     */
    this.__defineGetter__('weekday',function()
    {
      return dateobj.getDay()+1;
    });

    /**
     * Set day of the month
     * @member DateTime
     */
    this.__defineGetter__('weekday_zp',function()
    {
      return zeropadded(this.weekday);
    });

    /**
     * Return full name of the day
     * @member DateTime
     */
    this.__defineGetter__('weekday_name',function()
    {
      return DAYS[this.weekday-1];
    });

    /**
     * Return full name of the day
     * @member DateTime
     */
    this.__defineGetter__('weekday_name_abbr',function()
    {
      return this.weekday_name.substring(0,3);
    });

    /**
     * Return the year (YYYY)
     * @member DateTime
     */

    this.__defineGetter__('year',function()
    {
      return dateobj.getFullYear();
    });

    /**
     * Return two digit year
     * @member DateTime
     */
    this.__defineGetter__('year_abbr',function()
    {
      return dateobj.getYear();
    });

    /**
     * Set the year (YYYY)
     * @member DateTime
     */
    this.__defineSetter__('year',function()
    {
      return dateobj.setFullYear(arguments[0]);
    });

  }

  /**
   * Formats the datetime information by using given format string.
   * @param format {String} The format string
   */
  DateTime.prototype.format = function(format)
  {
    return strftime(format,this); 
  }

  DateTime.prototype.toString = function()
  {
    return roka.core.utils.repr('DateTime',this.datetime,{});
  }

  /**
   * Format date/time according to given datetime instance.
   *
   * @param format {String}
   * @param datetime {Date}
   */
  var strftime = function(formatstr,dtobj)
  {
    // replace specifiers with property names using format_specifiers dictionary
    formatstr = formatstr.replace(/(^|[^%])%(?:(\w{1})(?!\w))/g,function(match,lchar,key){
      return lchar+'%('+format_specifiers[key]+')s' 
    });
    return format(formatstr,dtobj);
  }

  /**
   * Make given number zero-padded
   * 
   * @param num {Number}
   * @param width {Number} optional. default is 2
   * @param fillchar {String}  optional. default is "0"
   */
  var zeropadded = exports.zeropadded = function(num,width,fillchar)
  {
    return ljust(String(num),width||2,'0');
  }

})( roka.core.datetime = {} );
