var g = null;
//writeCode();


function writeCode()
{
    inFunction("writeCode()");
    debug(1,"Generating graph & applying properties as set by UI")
    var code = "";
    
    ////////////////////////////////////////////////////////////////
    //Create the new chart object
    ////////////////////////////////////////////////////////////////
    
    if (g != null)
    {
        g.destroy();    
    }        
    
    
    
    var inverseData = $("#inverseData")[0].checked;
    
    if (inverseData != true)
    {                
        code += "var g = $('#dataTable').jChart(); // Generate from data, can override defaults" + "<br>";        
        g = $('#dataTable').jChart({inverseData: false});
    }
    else
    {
        code += "var g = $('#dataTable').jChart({inverseData: true}); // Generate from data, can override defaults" + "<br>";        
        g = $('#dataTable').jChart({inverseData: true});
    }
    
    
    ////////////////////////////////////////////////////////////////
    //Set position
    ////////////////////////////////////////////////////////////////
    code += "g.setContainer('container');   // Set parent object (optional)" + "<br>";            
    g.setContainer('container');
    
    
    
    ////////////////////////////////////////////////////////////////
    //Stack Data
    ////////////////////////////////////////////////////////////////
    var stacked = $("#stackValues")[0].checked;
    if (stacked)
    {
        code += "g.setStackedValues(true);   // Stack values (for bar/scatter)" + "<br>";            
        g.setStackedValues(true);    
    }
    else
    {
        code += "g.setStackedValues(false);   // Don't stack values" + "<br>";            
        g.setStackedValues(false);    
    }
    
    
    
    
    ////////////////////////////////////////////////////////////////
    //Set type
    ////////////////////////////////////////////////////////////////
    var seriesType = $("input[name=chartType]:checked").val();
    if (seriesType != "DEFAULT")
    {        
        code += "g.setChartType(types." + seriesType + ");  // Set the chart type" + "<br>";
        
        g.setChartType(types[seriesType]);                
    }
    
    
    
    
    ////////////////////////////////////////////////////////////////
    //Set animation speed
    ////////////////////////////////////////////////////////////////
    var animationTime = $("#animationTimeRange")[0].value;                
    
    code += "g.setAnimationTime(" + (animationTime * 100) + ");";
    
    if (animationTime > 0)
    {
        code += "  // Animation will take " + (animationTime * 100) + " ms" + "<br>";            
    }
    else
    {
        code += "  // Animation will be disabled" + "<br>";
    }
    g.setAnimationTime(animationTime*100);          
    
    
    ////////////////////////////////////////////////////////////////
    //Set tooltip contents
    ////////////////////////////////////////////////////////////////
    var tipContents = $("input[name=tipContent]:checked").val();
    
    if (tipContents != "DEFAULT")
    {
        
        code += "g.setToolTipContents(toolTipContentTypes." + tipContents + "); // Set the tooltip content  " + "<br>";
        
        g.setToolTipContents(toolTipContentTypes[tipContents]);            
    }
    
    
    
    ////////////////////////////////////////////////////////////////
    //Set theme
    ////////////////////////////////////////////////////////////////
    var theme = $("input[name=themeList]:checked").val();
    
    if (theme == "noTheme")
    {
        code += "<br>";
        code += "// Don't set a theme, set details manually" + "<br>"
        code += "g.settings.colours = ['#e67e22','#16a085','#34495e','#e74c3c','#95a5a6','#1abc9c','#f1c40f']; " + "<br>";
        code += "g.settings.lineColor = #777;" + "<br>";
        code += "g.settings.lineWidth = 1;" + "<br>";
        code += "g.settings.defaultOpacity = 1;" + "<br>";
        code += "g.settings.highlightedOpacity = 0.4;" + "<br>";
        code += "g.settings.fontColour = '#111';" + "<br>";
        code += "g.settings.font = 'arial';" + "<br>";
        code += "<br>";
        
        g.settings.colours = ['#e67e22','#16a085','#34495e','#e74c3c','#95a5a6','#1abc9c','#f1c40f'];
        
        g.settings.lineColor = '#777';
        g.settings.lineWidth = 1;

        g.settings.defaultOpacity = 1;
        g.settings.highlightedOpacity = 0.4;
        g.settings.fontColour = '#111';
        g.settings.font = 'arial';            
    }
    else
    {            
        code += "g.setTheme('" + theme + "');  // Set the theme from js file." + "<br>";
        
        g.setTheme(theme, 'scripts');
    }
    
    
    ////////////////////////////////////////////////////////////////
    //Draw the chart & write the code
    ////////////////////////////////////////////////////////////////
    
    if (env.debugLevel < 3)
    {
        inFunction("graph DRAW");
        debug(1,"Not going to recurse debug here, for that increase env.debugLevel to 3");
    }
    
   
   
   
   
    //CHANGEME
   if (false)
   {    
    $( g.id).appendTo('body');
    $( g.id).css('position','absolute');
    $( g.id).css('top','200px');
    $( g.id).css('left','40%');
   }
   
    
    g.draw();
    
    if (env.debugLevel < 3)
    {
        outFunction("graph DRAW");
    }
   
    //code += "//Draw the chart" + "<br>"
    code += "g.draw();  // Draw the chart";
    
    debug(1,"Placing code into div onscreen");
    $("#codeGen").html(equalComments(code));
    
    ////////////////////////////////////////////////////////////////
    //reprettify everything (see http://stackoverflow.com/questions/16127015/how-to-re-apply-prettyprint-after-run-prettify-js-has-been-loaded)
    ////////////////////////////////////////////////////////////////
    debug(1,"Prettying up html")
    
    $(".prettyprinted").removeClass("prettyprinted");            
    PR.prettyPrint();
    $(".prettyprinted").css("borderWidth",0);
    outFunction("writeCode()");
}

function equalComments(s)
{
    var br = "<br>";
    var comment = "//"
    var arr = s.split(br);
    var commentStart = -1;
    
    //Find the most left comment location
    for (var i = 0 ; i < arr.length; i++)
    {
        var newCommentStart = arr[i].indexOf(comment);
        if (newCommentStart > 0)
        {
            commentStart = Math.max(commentStart,newCommentStart);
        }        
    }
    
    clog("commentStart is " + commentStart);
    
    //Put them back in with comments in the right place
    for (var i = 0; i < arr.length; i++)
    {
        var a = arr[i];
        var rightLoc = a.indexOf(";") + 1;
        a = a.substring(0,rightLoc) ;
        
        a += repeatChar(" ", commentStart - rightLoc);
        
        a += arr[i].substring(arr[i].indexOf("//"), arr[i].length);
        
        if (rightLoc > 0 && arr[i].indexOf("//") > 0)
        {
            arr[i] = a;    
        }
        
        
    }
    
    //Build the return string
    var returnMe = "";
    for (var i = 0; i < arr.length; i++)
    {
        returnMe += arr[i] + "<br>";
    }
    return returnMe;
}

