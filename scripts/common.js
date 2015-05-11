////////////////////////////////////////////////////
//Initialisation
////////////////////////////////////////////////////

init();
var debugFunctionCount = 0;



////////////////////////////////////////////////////
//Visuals
////////////////////////////////////////////////////

//tooltip
function tooltip(id, classes, y, x, contents)
{
    //remove existing one
    $("." + classes).remove();

    //Create div
    var style = "";
    style += "position:absolute;" // position absolute (moves)
    style += "top:" + y + "px;" // top position
    style += "left:" + x + "px;" // left position

    style += "background:rgba(200,200,200,0.8);" // background color
    style += "color:#000;" // font color
    style += "border:1px solid #000;" // background color

    style += "padding:5px;" // padding around the text

    style += "margin-top:15px;" // keep it just below the mouse
    style += "margin-left:15px;" // keep it to right of mouse

    style += "border-radius:5px;" // rounded corners

    style += "font-family:courier;" // monospaced font
    style += "font-size:12px;" // small writing

    var $newdiv1 = $("<div id='" + id + "' class='" + classes + "' style='" + style + "'>" + contents + "</div>");

    //Append newly created
    $("body").append($newdiv1);

    //Mouse over the div will remove it
    $("." + classes).mouseenter(function()
    {
        $("." + classes).remove();
    });
}




////////////////////////////////////////////////////
//Debugging Functions
////////////////////////////////////////////////////

var debugLineCount = 5;

//Debug
function debug(level, message)
{
    // 1 for useful
    // 2 for function flow (now tabbed!)
    // 3 

    if (level <= env.debugLevel)
    {
        var d = "-";
        
        d = repeatChar(" ",debugFunctionCount) ;
        
        //clog("debugFunctionCount is " + debugFunctionCount)
        
        for (var i = 1; i < d.length; i+= debugLineCount)
        {
            len = d.length;
            
            var newD = d.substring(0,(i-1)) + " " + d.substring(i,len)
            //var newD = d;
            d = newD
        }
        
        
        var functionChar = "";
        if (message.substring(0,1) == "{")
        {            
            functionChar  = "";                    
        }
        if (message.substring(0,1) == "}")
        {            
            functionChar  = "";                    
        }            
        clog("[" + level + "]: " + d + functionChar + " " + message);        
    }
}


function inFunction(s, debugLevel)
{        
    if (debugLevel == undefined)
    {
        debugLevel = 2;
    }
    debug(debugLevel,"FUNCTION " + s);
    debug(debugLevel ,"{");
    debugFunctionCount+=debugLineCount;     
}

function outFunction(s, debugLevel)
{
    if (debugLevel == undefined)
    {
        debugLevel = 2;
    }
    debugFunctionCount-=debugLineCount;
    debug(debugLevel ,"}");
    debug(debugLevel ,"");
    //debug(2,"LEAVING function " + s);
    
    
    //debugFunctionCount-=debugLineCount;
    
}

//A lazy shortcut to debug
function dbg(level, message)
{
    debug(level, message);
}

//Stubbing
function stub(s)
{
    debug(2, s);
}

//Console log
function clog(s)
{
    console.log(s)
}




////////////////////////////////////////////////////
//String/int Functions
////////////////////////////////////////////////////

//Add extra space to end of string
function fixLength(s, l, repeatChar)
{
    if (s == undefined)
    {
        s = '';
    }
    
    if (repeatChar == undefined)
    {
        repeatChar = " ";
    }
    var returnMe = s;
    var spaceCount = l - s.length;

    for (var i = 0; i < spaceCount; i++)
    {
        returnMe += repeatChar;
    }

    return returnMe;
}

//Repeat Chars
function repeatChar(s, n)
{
    var r = "";
    for (var i = 0; i < n; i++)
    {
        r += s;
    }

    return r;
}

//is a between b & c (INCLUSIVE)
function between(a, b, c)
{
    if (a >= b && a <= c)
    {
        return true;
    }
    else
    {
        return false;
    }
}


//replace undefined with somthing
function ifUnd(s,replaceWith)
{
    if (s == undefined)
    {
        s = replaceWith;
    }
    return s;
}




////////////////////////////////////////////////////
//Trigonometry Functions
////////////////////////////////////////////////////

//Find angle based on a pair of 2d points
function findAngle(x1,y1,x2,y2)
{
  //Assumes up (3oclock) is 0 - this is the same as the canvas arc method
  var dY = y2 - y1;
  var dX = x2 - x1;
  
  var y = Math.max(dY,0-dY);	//positive of y
  var x = Math.max(dX,0-dX);	//positive of x
  var q = (Math.PI/2);
  var a = 0;
  
  if (y2 < y1 && x2 >= x1)	// 12-3 oclock
  {
  	a = (3*q) + Math.atan(x/y);  
  }
  if (y2 >= y1 && x2 >= x1)	// 3-6 oclock
  {
		a = Math.atan(dY/x);  
  }
  if (y2 >= y1 && x2 < x1)	// 6-9 oclock
  {
		a = q + Math.atan(x/dY);    
  }
  if (y2 < y1 && x2 < x1)		// 9-12 oclock
  {
		a = (2*q) + Math.atan(dY/dX);    
  }
  
  // in this case, let's convert to degrees
  a = a/(Math.PI*2)*360;
  
  return a;
}

//Find distance between a pair of 2d points
function findLength(x1,y1,x2,y2)
{
  var dY = y2 - y1;
  var dX = x2 - x1;
  
  var len = Math.sqrt((dY*dY) + (dX*dX))
  
  return len;
}

//radians to degrees
function r2d(n)
{
    return n/(2*Math.PI)*360;
}

//degrees to radians
function d2r(n)
{
    return n/360*(2*Math.PI);
}


// is x near nearToAmount with a flexibility of nearToFlexibility
function near(x, nearToAmount, nearToFlexibility)
{
    if (between(x, nearToAmount - nearToFlexibility, nearToAmount + nearToFlexibility))
    {
        return true;
    }
    else
    {
        return false;
    }
}

////////////////////////////////////////////////////
//Timing functions
////////////////////////////////////////////////////

//current dateTime
function now()
{
    return new Date().getTime();
}




////////////////////////////////////////////////////
//INIT
////////////////////////////////////////////////////

//Initialisation definition
function init()
{
    console.clear();
    if (env.production)
    {
        env.debugLevel = 0;
    }
    else
    {
        clog("---Running in debug mode at level " + env.debugLevel + "---");
    }
}