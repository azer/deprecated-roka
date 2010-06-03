<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
  <head>
    <style type='text/css'>
      <![CDATA[
      html, body { width:100%; height:100%; overflow:hidden; background:#f2f2f2; font:12px Arial,sans-serif; color:#111; padding:0px; margin:0; }
      fieldset { background:#fff; }
      fieldset legend { background:#ffff00; color:#ff0000; font-weight:bold; text-transform:uppercase;  }

      table { width:100%; height:100%; }
      table .Listwrapper { width:30%; }

      .ModuleList { height:100%; }
      .ModuleList select { width:100%; background:#fff; padding:5px; }
      .ModuleList select option { display:block; padding:4px; font:12px Arial,sans-serif; }
      .ModuleList .Failure { background-color:rgb(255,150,150); } 
      .ModuleList .Success { background-color:rgb(150,255,150); } 
      .ModuleList .InProgress { font-weight:bold; font-style:italic; background-color:rgb(220,220,220); } 

      .Log { height:100%; }
      .Log textarea { width:100%; border:1px dotted #ccc; background-color:rgb( 240,250,250 ); color:#333; }
      .Log .TestWindow { display:block; width:100%; height:60%; margin:0; background:#ddd; margin-top:5px;  }

      .TestWindow { display:block; }
      ]]>
    </style>
    <script>
      <![CDATA[

      const DEBUG = false;
      
      function init(){
        document.getElementById('run_sel').addEventListener('click',run_selected,false);
        document.getElementById('run_all').addEventListener('click',run_all,false);
        resize();
      }

      function killWindows(){
        var openWin = document.getElementsByClassName('TestWindow');
        for(var i=-1,len=openWin.length; ++i<len; )
        {
          openWin[i].parentNode.removeChild( openWin[i] );
        }
      }

      function load(option,run_single,callback){

        log('Loading '+option.value+'..');
        option.className = 'InProgress';
        var id = option.value.replace(/[^\w]/g,'_');

        var frame = document.createElement('iframe');
        frame.setAttribute('id',id);
        frame.setAttribute('class','TestWindow');

        var layoutView = run_single&&option.hasAttribute('display');
        var firebug = layoutView&&option.hasAttribute('firebug');

        var dependencies = option.getAttribute('dependencies').split(';').filter(function(el){ return /\w/.test(el) }).map(function(el){ 
          return el.trim();
        });

        if(layoutView){
          document.getElementsByClassName('Log')[0].appendChild( frame );
        } else {
          document.documentElement.appendChild(frame);
        }
        resize();

        var start_test = function(){
          var contentWindow = document.getElementById(id).contentWindow;
          contentWindow.assert = function(expr){ if(!expr){ throw Error('Assertion Error: '+expr); }  };
          contentWindow.compare = function(){ if(arguments[0]!=arguments[1])throw Error('Comparison Error ('+arguments[0]+' != '+arguments[1]+')')  };
          contentWindow.log = log;

          var footer = document.createElement('div');
          footer.innerHTML='<center>'+option.value+'<br><strong>testrunner.xsl</strong></center>';
          contentWindow.document.documentElement.appendChild( document.createElement('hr') );
          contentWindow.document.documentElement.appendChild( footer );

          if(firebug)
            load_fblite( contentWindow );

          trace('load dependencies');
          if(dependencies.length){

            var dlindex = 0;
            var dlhandler = function(){
              if(++dlindex<dependencies.length){
                load_script( contentWindow, getabsurl( dependencies[ dlindex ] ), dlhandler  );
              } else {
                load_testcase( contentWindow, option, id, run_single, callback );
              }
            }
            load_script( contentWindow, getabsurl( dependencies[ dlindex ] ), dlhandler);
          } else {
            load_testcase( contentWindow, option, id, run_single, callback );
          }
        };

        if(option.hasAttribute('document')){
          frame.onload = function(){
            start_test();
          }; 
          frame.src = option.getAttribute('document');
        } else {
          setTimeout(start_test,10);
        }

      }

      var getabsurl = function(uri){
        var dir = document.location.href.replace(/[^\/]+$/,'');
        var uplvl = (uri.match(/(\.\.\/)/g) || []).length;
        var path = dir.replace(new RegExp("([^\\/]+\\/){"+( uplvl )+"}$",'g'),'');
        var url = path+uri.replace(/\.\.\//g,'');
        return url;
      }

      var load_testcase = function(win,option,id,run_single,callback){
        trace('load testcase',option.value);

        load_script( win, getabsurl(option.value), function(){
          trace('testcase is loaded.',option.value);
          execute(document.getElementById(id),option,callback);
        }); 
      }

      var load_script = function(win,uri,onload){
        trace('load script',uri);
        var el = document.createElement('script');   
        el.async = true;
        el.src = uri+'?_cacheForce_='+Math.round(Math.random()*999)+'#';
        if(window.opera){
          (function(){})(uri,el.src);
        }
        el.onload = onload;
        win.document.documentElement.appendChild(el);
      }

      function execute(frame_el,option,callback){
        trace( 'execute', option.value );
        // store errors
        var errors = [];
        var win = frame_el.contentWindow;
        var functions = [];

        var async_tests_done = 0;
        var async_tests_count = 0;
        var async_result = true;
        var set_async_result = function(testname){ 
          return function(res){

            log( option.value+'['+testname+']: '+ (res&&'OK'||'FAILED')  + ' (Asynchronous Report '+(async_tests_done+1)+','+async_tests_count+' )' );

            if(!res)
              async_result = false;

            if(++async_tests_done>=async_tests_count){
              trace('Asynchronous Tests are completed.Running callback');
              option.className = !async_result&&'Failure'||'Success';
              if(callback)
              callback();
            }

          }
        }

        // collect functions whose name starts width 'test' (e.g: testSomething)
        for(var key in win){
          if(key.substring(0,5)=='test_' && typeof win[ key  ] == 'function' ){
            var fn = [ win[key], key ];
            functions.push(fn);
            if(win[key].async){
              win[key].__defineSetter__('result',set_async_result(key));
              async_tests_count++;
            }
          }
        }

        // execute found functions
        var start_date=Number(new Date());
        for(var i=-1,len=functions.length; ++i<len;){
          var fn = functions[i];
          try {
            fn[0]();
          } catch(e){
            errors.push( [ fn[1], e ] );
          }
        }
        var testduration = ((Number(new Date())-start_date)/1000)+'s';
        
        if(async_tests_count<=async_tests_done)
          option.className = functions.length? errors.length?'Failure':'Success' : '';
        
        async_result = errors.length==0;
        
        // print errors
        for(var i=-1,len=errors.length; ++i<len;){
          var error = errors[i];
          log_error(option.value,error[0],error[1]);
        }

        // print test result
        log(option.value+': Ran '+functions.length+' tests in '+testduration);
        if(errors.length){
          log(option.value+': FAILED(errors='+errors.length+')');
          if(callback)
          callback();
        }
        else if(async_tests_count>async_tests_done)
          log(option.value+': Waiting For Asynchronous Results('+async_tests_done+','+async_tests_count+')');
        else {
          log(option.value+': OK.');
          if(callback)callback();
        }
        
      }

      function load_fblite(win){
        (function(F,B,L,i,t,e){
          e=F[B]('script');
          e.id='FirebugLite';
          e.src=L+t;
          F.getElementsByTagName('head')[0].appendChild(e);
          e=F[B]('img');
          e.src=L+i;
        })(
          win.document,'createElement','http://getfirebug.com/releases/lite/beta/','skin/xp/sprite.png','firebug.jgz#startOpened'
        ); 
      }

      function log_error(url,test,error){
        log('\n================================');
        log('ERROR: ' + test + ' ('+url+')');
        log(error.name+': '+error.message)
        log( '-------------------------------');
        log( error.stack );
        log( '-------------------------------');
        log('================================\n');
      }

      function run_selected(){
        killWindows();
        document.getElementById('logview').value='';
        var list = document.getElementById('module_list');
        var option = list.options[list.selectedIndex];
        load(option,true);
      }

      function run_all(){
        document.getElementById('logview').value='';

        var list = document.getElementById('module_list')
        list.selectedIndex = -1;
        var options = list.options;
        var ind = 0;

        var run = function(){
        killWindows();
          trace('Run',ind);
          setTimeout(function(){
            load(options[ind++],false,run);
          },/firefox/i.test(navigator.userAgent)&&1000||10);
        }

        run();

      }

      function log(){
        var rec = Array.prototype.join.call( arguments, ' ');
        var logview = document.getElementById('logview');
        logview.value+=rec+'\n';
      }

      function trace(){
        if(DEBUG)
          log.apply(window,arguments);
      }

      function resize(){
        var vpheight=Math.max( document.body.clientHeight, document.documentElement.clientHeight );
        var modlist = document.getElementById('module_list');
        var monitor = document.getElementById('logview');
        var frame = document.getElementsByTagName('iframe')[0];
        var display_frame = frame&&frame.parentNode==monitor.parentNode;

        if(display_frame){
          monitor.style.height=Math.round((vpheight-62)/2)+'px'
          frame.style.height=Math.round((vpheight-72)/2)+'px'
        } else
          monitor.style.height=vpheight-62+'px';
        modlist.style.height=vpheight-70+'px';
      }
     
      window.addEventListener('DOMContentLoaded',init,false);
      window.addEventListener('resize',resize,false);
      ]]>
    </script>
  </head>
  <body>
    <table>
      <tr>
        <td class='ListWrapper' style='width:30%'>
          <fieldset class='ModuleList'>
            <legend>Test Cases</legend>
            <select id='module_list' multiple='true'>
              <xsl:for-each select="testcases/case">
              <option>
                <xsl:attribute name="dependencies">
                  <xsl:for-each select="dependency">
                    <xsl:value-of select="@src" />;
                  </xsl:for-each>
                </xsl:attribute>
                <xsl:if test='@document'>
                  <xsl:attribute name='document'>
                    <xsl:value-of select='@document' />
                  </xsl:attribute>
                </xsl:if>
                <xsl:if test='@display'>
                  <xsl:attribute name='display'>true</xsl:attribute>
                </xsl:if>
                <xsl:if test='@firebug'>
                  <xsl:attribute name='firebug'>true</xsl:attribute>
                </xsl:if>
                <xsl:value-of select='file/@src' />
              </option>
              </xsl:for-each>
            </select>
            <button id='run_sel'>Run Selected</button>
            <button id='run_all'>Run All</button>
          </fieldset>
        </td>
        <td>
          <fieldset class='Log'>
            <legend>MONITOR</legend>
            <textarea id='logview'></textarea>
          </fieldset>
        </td>
      </tr>
    </table>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet>
