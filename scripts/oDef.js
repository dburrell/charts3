var f = 1;


function graph(type)
{
    inFunction("graph()");
    
    debug(1,"Setting graph defaults in template to return");
    var o = {};
    o.colors = ['#1abc9c', '#3498db', '#9b59b6', '#34495e', '#e67e22', '#e74c3c', '#95a5a6', '#27ae60', '#2980b9', '#d35400'];

    //Alice, Bob
    o.recordNames = {}; // hashtable of name to array index
    o.records = []; // array of records
    o.recordCount = 0;

    //Maths,History
    o.seriesNames = {}; // hashtable of name to array index
    o.series = []; // array of series
    o.seriesCount = 0;

    // 2d array of values
    o.values = array2d();

    o.settings = {}; //this will get filled in by the constructor

    o.objects = objectsCollection();
    
    
    o.init = function()
    {
        inFunction("graph init()");
        
        debug(1,"Generating canvas with random number " + o.settings.randomNumber);
        o.settings.ctx = makeCanvas("canvas" + o.settings.randomNumber, o.settings.bgCol, o.settings.height, o.settings.width, o.settings.position, o.settings.left, o.settings.top, o.settings.container);
        o.settings.ctx.translate(0.5, 0.5);
        
        
        debug(1,"Setting chart ID to canvas"+o.settings.randomNumber);
        o.id = '#canvas' + o.settings.randomNumber;
        
        debug(1,"Adding any classes as per settings");
        $( "#canvas" + o.settings.randomNumber).addClass(o.settings.addedClasses);
        
        debug(1,"Setting mouse movement catcher");
        //On mouse over of this canvas, 
        $( "#canvas" + o.settings.randomNumber).mousemove(function( event )
        {            
            var y = event.pageY;
            var x = event.pageX;
            o.mouseOver(y,x);                
        });
        
        $( "#canvas" + o.settings.randomNumber).mouseleave(function( event )
        {            
            //o.mouseExit();            
        });
        outFunction("o.init()");
    };
    
    
    // Safely destory
    o.destroy = function()
    {
        debug(1,"Removing '#canvas" + o.settings.randomNumber + "'")
        $("#canvas" + o.settings.randomNumber).hide();
        $("#canvas" + o.settings.randomNumber).remove();
    };
    
    
    
    
    //Add a series holder with name
    o.addSeries = function(s)
    {
        o.seriesNames[s] = o.seriesCount;
        //o.settings.labelTypes[o.seriesCount] = o.labelTypeDefault;
        o.series[o.seriesCount] = s;
        o.seriesCount++;
    };
    
    //Add a record holder with name (and optionally vals)
    o.addRecord = function(s, vals)
    {
        o.recordNames[s] = o.recordCount;
        o.records[o.recordCount] = s;
        o.recordCount++;

        if (typeof vals !== "undefined")
        {
            for (var i = 0; i < vals.length; i++)
            {                
                o.set(o.records[o.recordCount-1], o.series[i],vals[i]);             
            }
        }
    };

    //Get a value e.g. get("Alice","Maths")
    o.get = function(recordKey, seriesKey)
    {        
        try
        {
            var y = o.recordNames[recordKey];
            var x = o.seriesNames[seriesKey];
                        
            return o.values.get(x, y);
        }
        catch (e)
        {
            debug(1, "Could not return values from series '" + seriesKey + "' in record '" + recordKey + "'");
                        
            return false;
        }
        
    }

    //Set a value e.g. set("Alice","Maths",77)
    o.set = function(recordKey, seriesKey, val)
    {
        try
        {            
            var y = o.recordNames[recordKey];         
            var x = o.seriesNames[seriesKey];
            
            for (var i = 0; i < o.possibleCurrencies; i++)            
            {
                val = o.blankAndSetCurrency(val,o.possibleCurrencies[i]);    
            }
            val = val.replace("$","")
            
            o.values.set(x, y, val);           
            return true;
        }
        catch (e)
        {
            debug(1, "Could not add to series '" + seriesKey + "' in record '" + recordKey + "'");
            return false;
        }
    }

    o.blankAndSetCurrency = function(val,cur)
    {    
      if (val.indexOf(cur) >= 0)
      {
        o.currency = cur
        val = val.replace(cur,"");
        val = val * 1        
      }
        
      return val;
    };
    
    o.getTotalRecord = function(n)
    {
        var val = 0;
        for (var i = 0; i < o.seriesCount; i++)        
        {
            val += (o.get(o.records[n],o.series[i]))*1
        }
        return val;
    };
    
    o.getMaxRecord = function(n)
    {
        var val = 0;
        for (var i = 0; i < o.seriesCount; i++)        
        {
            val = Math.max(val,(o.get(o.records[n],o.series[i]))*1)
        }
        return val;
    }
    
    o.getTotalSeries = function(n)
    {
        var val = 0;
        for (var i = 0; i < o.recordCount; i++)        
        {
            val += (o.get(o.records[i],o.series[n]))*1
        }
        return val;
    };
    
    o.getMaxSeries = function(n)
    {
        var val = 0;
        for (var i = 0; i < o.recordCount; i++)        
        {
            val = Math.max(val,(o.get(o.records[i],o.series[n]))*1);
        }
        return val;
    };
    
    //Set values to stacked
    o.setStackedValues = function(trueOrFalse)
    {
        o.settings.stacked = trueOrFalse;
    }
    
    //Set a different series type
    o.setSeriesType = function(i,n)
    {
        inFunction("graph setSeriesType");
        
        debug(1,"setting seriesType[" + i + "] to '" + n + "'")
        o.settings.seriesTypes[i] = n;
        
        outFunction("graph setSeriesType");
    };
    
    //Set the entire chart to a certain type
    o.setChartType = function(n)
    {
        inFunction("graph setChartType")
        for (var i = 0; i < o.seriesCount;i++)
        {          
          o.setSeriesType(i,n);
        }
        outFunction("graph setChartType")
    };
    
    
    
    //Set animation speed
    o.setAnimationTime = function(n)
    {
        inFunction("graph setAnimationTime")
        if (n >= 0)
        {            
            o.settings.totalTime = n;
        }
        else
        {        
            o.settings.totalTime = 700;
        }
        
        debug(1,"setting totalTime to " + o.settings.totalTime);
        outFunction("graph setAnimationTime")
    };
    
    o.setContainer = function(s)
    {
        inFunction("graph setContainer()");
        
        if (s == '' || typeof s == 'undefined' || s == null)
        {
            s = 'body';
        }
        o.settings.container = s;
        debug(1,"setting container to '" + s + "'")
        
        $("#canvas" + o.settings.randomNumber).appendTo("#" + s);
        $("#canvas" + o.settings.randomNumber).css("position","")
        
        outFunction("graph setContainer()");
    }
    
    o.setToolTipContents = function(s)
    {
        inFunction("setToolTipContents");
        if (s == '' || typeof s == 'undefined' || s == null)
        {
            s = toolTipContentTypes.fullRecord;        
        }
        
        debug(1,"setting toolTipContents to " + s);
        o.settings.tooltipContents = s;
        
        
        outFunction("setToolTipContents");
    };
    
    o.setTheme = function(s, dir)
    {
        inFunction("graph setTheme()")
        
        debug(1,"Setting theme to '" + s + "'");
        
        var theme = env.themes[s];
        
        for(var propertyName in theme)
        {            
            var oldVal = g.settings[propertyName];
            var newVal = theme[propertyName];
            
            if (oldVal == undefined)
            {
                debug(1,"WARNING: Could not find property '" + propertyName + "' in settings.");
            }
            else
            {
                g.settings[propertyName] = newVal;             
            }
                        
         }
        
        outFunction("graph setTheme()");        
    };
    
    //Import data from a table
    o.convertTable = function(settings,tableSearchString)
    {
        
        inFunction("graph convertTable");
        
        debug(1,"")
        var table = $(tableSearchString);
        
        //pull data into a 2d data array
        var data = array2d();
        var y = 0;
        var x = 0;
        var maxY = 0;
        var maxX = 0;
        
        debug(1,"Adding data to 2d data array");
        table.find('tr').each(function(y)
        {                        
            $(this).find('td').each(function(x)
            {
                //findme
                var val = $(this).text();
                data.set(x,y,val);
                x++;
                maxX = x;
            });        
            y++;
            maxY = y;
        });        
        
        debug(1,"Looping 2d array")
        for (var y = 0; y < maxY; y++)
        {
            
            var record = '';
            var vals = [];
            for (var x = 0; x < maxX; x++)
            {
                var val = data.get(x,y);
                if (settings.inverseData)
                {                    
                    val = data.get(y,x);
                }
                if (x == 0)
                {
                    record = val;                    
                }
                else
                {
                    if (y == 0)
                    {
                        vals[x] = val;
                    }
                    else
                    {
                        vals[x - 1] = val;
                    }
                }
            }

            
            if (y == 0)
            {
                //Add the series collection                
                for (var i = 1; i < vals.length; i++)
                {                    
                    o.addSeries(vals[i]);
                }
                
            }
            else
            {
                debug(1,"Adding row " + y)
                //Add a new record                
                o.addRecord(record, vals);
            }
        };
        
        if (false)
        {
                
            
            table.find('tr').each(function(y)
            {            
                var record = '';
                var vals = [];
                $(this).find('td').each(function(x)
                {
                    var val = $(this).text();
                    if (x == 0)
                    {
                        record = val;
                    }
                    else
                    {
                        if (y == 0)
                        {
                            vals[x] = val;
                        }
                        else
                        {
                            vals[x - 1] = val;
                        }
                    }
                });
    
                
                if (y == 0)
                {
                    //Add the series collection
                    debug(1,"Adding series headers")
                    for (var i = 1; i < vals.length; i++)
                    {                    
                        o.addSeries(vals[i]);
                    }
                    
                }
                else
                {
                    debug(1,"Adding row " + y)
                    //Add a new record                
                    o.addRecord(record, vals);
                }
            });
        }
        outFunction("graph convertTable");
    };

    //Animated Draw Function
    o.draw = function(startTime, first, animated)
    {
        inFunction("graph DRAW",3);
        
        
        animated = ifUnd(animated,true);        // default animated to true;
        
        
        
        if (o.settings.totalTime == 0)
        {
            animated = false;
        }
        if (startTime == undefined)
        {
            o.draw(now(),true);
        }
        else
        {
            debug(3,"animation is " + animated);
            debug(3,"startTime is " + startTime);
            var stackLevels = [];                
            var barWidth = ((o.settings.width - (2 * o.settings.margin)) - (o.settings.gap * (o.recordCount + 1))) / o.recordCount; // calculate bar width based on total columns etc
            var ctx = o.settings.ctx;

            wipeCanvas("canvas" + o.settings.randomNumber);

            //Add borders and axis settings etc
            if (o.settings.seriesTypes[0] == types.bar                
                || o.settings.seriesTypes[0] == types.line
                || o.settings.seriesTypes[0] == types.scatter)
            {
                //Assumption is that we won't have combined incompatible types (a bar and a pie etc) so if first requires chartArea then go for it
            
                
                //Add the borders 
                drawLine(ctx, o.settings.borderCol, 1, point(o.settings.height - o.settings.margin, o.settings.margin), point(o.settings.height - o.settings.margin, o.settings.width - o.settings.margin));
                drawLine(ctx, o.settings.borderCol, 1, point(o.settings.height - o.settings.margin, o.settings.margin), point(o.settings.margin, o.settings.margin));
    
                //Add the x axis values (record values)
                for (var i = 0; i < o.recordCount; i++)
                {
                    var x = (barWidth / 2) + (o.settings.margin + (barWidth * i) + (o.settings.gap * (i + 1)));
                    canvasWrite(ctx, o.records[i], o.settings.height - o.settings.margin + 12, x, o.settings.fontSize, o.settings.font, o.settings.fontColour, hAlign.centre)
                }
            
            
                
                
                //Find the maximum value
                var maxVal = 0;
                var minVal = 0;
                var maxStack = 0;
                for (var r = 0; r < o.recordCount; r++)            
                {                
                    var val = 0;
                    var stackVal = 0;
                    for (var s = 0; s < o.seriesCount; s++)
                    {
                        val = Math.max(Number(o.get(o.records[r], o.series[s])), val);  // either taking highest rolling
                        var valToStack = Number(o.get(o.records[r], o.series[s]));      // or for stacking, add the current
                        
                        if (o.settings.stacked)
                        {
                            stackVal += valToStack;                        
                        }
                    }
       
                    if (val > maxVal)
                    {
                        maxVal = val;
                    }
                    if (val < minVal)
                    {
                        minVal = val                
                    }
                    
                    maxStack = Math.max(maxStack,stackVal);            
                }
    
                maxVal = Math.max(maxStack,maxVal);
                
                //Find pixels per value (i.e. ratio)
                var valRatio = (o.settings.height - (2 * o.settings.margin)) / maxVal;
    
                
    
                //Add the y axis values (just the bar and numbers)
                var yVals = (maxVal - minVal) / o.settings.yScale;
                for (var i = minVal; i <= yVals; i++)
                {
                    var val = minVal + (o.settings.yScale * i);
                    var y = ((o.settings.height - o.settings.margin) - (o.settings.height - o.settings.margin * 2) / yVals * i) + o.settings.fontSize / 2;
                    canvasWrite(ctx, val, y, o.settings.margin - 3, o.settings.fontSize - 1, o.settings.font, o.settings.fontColour,hAlign.right)
                }

            
            }
            o.settings.fadeTime = 0;
            
            var frac = 1;
            if (animated)
            {
                //Calculate the timing fraction
                frac = (now() - (startTime + (o.settings.fadeTime * 1.5))) / o.settings.totalTime;

                frac = Math.max(0, frac); // frac must not be below 0
                frac = Math.min(1, frac); // frac must not be above 1
            }
                                                        
                        
            if (frac > 0)
            {
                //Init stack levels - these will increase as stacked bars are added
                var stackLevels = [];
                for (var records = 0; records < o.recordCount; records++)
                {
                    stackLevels[records] = 0;
                }
                
                //Starting variables
                var stackCount = 0;
                var totalBarCount = 0;
                var totalBarsWide = 0;
                
                //Calculate individual bar widths
                var barShifts = [];
                var stackCounted = 0
                for (var series = 0; series < o.seriesCount; series++)
                {
                    if (o.settings.seriesTypes[series] == types.bar)
                    {
                        barShifts[series] = totalBarCount;
                        totalBarCount ++;
                                    
                        //This only applies to bar; non-stacked scatters still occur in the same x-space
                        if (o.settings.stacked && stackCounted == 0)
                        {
                            barShifts[series] = totalBarCount;
                            stackCounted = 1;
                            totalBarCount ++;
                        }
                    }
                }
                
                //Clear the current objects
                o.objects.clear();

                var angleC = [];
                var counter = 0;
                for (var i = 0; i < o.recordCount; i++)
                {
                    angleC[i] = 0;
                }
                
                for (var series = 0; series < o.seriesCount; series++)
                {
                    //previous point (0,0)
                    var oldPoint = null;                
                    var barCount = 0;
                    
                    
                    //Loop through values
                    for (var record = 0; record < o.recordCount; record++)
                    {
                        offSet = o.recordCount + (o.recordCount * series);
                        
                        var originalval = o.get(o.records[record], o.series[series]);
                        val = originalval * frac;
                        if (!animated)
                        {
                            val = originalval;
                        }


                        ///////////////////////////////////////////
                        //Add labels
                        ///////////////////////////////////////////
                        if (o.settings.labelTypes[series] != "none")
                        {
                            var displayVal = "";

                            //What value to show?
                            if (o.settings.labelTypes[series] == "value")
                            {
                                displayVal = originalval;
                            }
                            if (o.settings.labelTypes[series] == "name")
                            {
                                displayVal = o.records[record];
                            }

                            //Where to show it
                            var x = (o.settings.margin + (barWidth * record)) + (o.settings.gap * (record + 1)) + barWidth / 2 - (o.settings.fontSize - 1) / 2;
                            var y = (o.settings.height - o.settings.margin) - (val * valRatio);

                            var labelYOffset = o.settings.labelYOffset;
                            var newPoint = point(y + labelYOffset, x + o.settings.labelXOffset);

                            var newObject = labelObject(o.settings, newPoint, displayVal, o.objects.count)
                            o.objects.add(newObject);
                        }

                        ///////////////////////////////////////////
                        //barchart version
                        ///////////////////////////////////////////
                        if (o.settings.seriesTypes[series] == types.bar)
                        {
                    
                            var stackOffset = 0;    // for debugging, should be 0 in general
                            
                            var width = barWidth/totalBarCount;  //the actual width of each bar - barWidth will be used 
                            var p1 = point(o.settings.height - o.settings.margin, (barShifts[series] * width) + (o.settings.margin + ((barWidth * record)) + (o.settings.gap * (record + 1))));
                            var p2 = point((o.settings.height - o.settings.margin) - (val * valRatio), (barShifts[series]* width) + (o.settings.margin + (barWidth * record)) + ((o.settings.gap * (record + 1)) + width) );                                
                            
                            if (o.settings.stacked)
                            {                                
                                p1 = point((o.settings.height - o.settings.margin) - stackLevels[record], (o.settings.margin + (barWidth * record) + (o.settings.gap * (record + 1))) + stackCount * stackOffset );
                                p2 = point(((o.settings.height - o.settings.margin) - (val * valRatio)) - stackLevels[record], (o.settings.margin + (barWidth * record)) + (o.settings.gap * (record + 1)) + barWidth + stackCount * stackOffset);                            
                            }
                            
                            var id = (o.recordCount*series) + record;
                            id = o.objects.count;
                            var newObject = barObject(o.settings, series, p1, p2, id, series, record);
                            o.objects.add(newObject);
                            barCount++;
                        }
            
                        ///////////////////////////////////////////
                        //line version
                        ///////////////////////////////////////////
                        if (o.settings.seriesTypes[series] == types.line)
                        {
                            var y = (o.settings.height - o.settings.margin) - (val * valRatio);
                            var x = (o.settings.margin + (barWidth * record)) + (o.settings.gap * (record + 1)) + barWidth / 2;
                            var newPoint = point(y, x);

                            if (oldPoint == null)
                            {
                                oldPoint = newPoint;
                            }
                            var newObject = lineObject(o.settings, i, oldPoint, newPoint, series, record);
                            o.objects.add(newObject);
                        }

                        ///////////////////////////////////////////
                        //Scatter Graph
                        ///////////////////////////////////////////
                        if (o.settings.seriesTypes[series] == types.scatter)
                        {
                            
                            var y = (o.settings.height - o.settings.margin) - (val * valRatio);
                            if (o.settings.stacked)
                            {
                                y = ((o.settings.height - o.settings.margin) - (val * valRatio)) - stackLevels[record];
                            }
                            
                            var x = (o.settings.margin + (barWidth * record)) + (o.settings.gap * (record + 1)) + barWidth / 2;
                            var newPoint = point(y, x);
                            var id = (o.recordCount*series) + record;
                            id = o.objects.count;
                            
                            var newObject = dotObject(o.settings, i, oldPoint, newPoint, id, series, record);
                            o.objects.add(newObject);
                            
                            
                            if (oldPoint != null)
                            {
                                var newObjectLine = lineObject(o.settings,i,oldPoint,newPoint,id,series,record);
                                o.objects.add(newObjectLine);
                            }
                            oldPoint = newPoint;
                        }

                        ///////////////////////////////////////////
                        //pie chart version
                        ///////////////////////////////////////////
                        if (    o.settings.seriesTypes[series] == types.pie
                            ||  o.settings.seriesTypes[series] == types.donut
                            ||  o.settings.seriesTypes[series] == types.polar)
                        {
                            //Only donuts can handle multiple series & records, so check that first
                            if (record == 0 || o.settings.seriesTypes[series] == types.donut)
                            {
                                var donut = o.settings.seriesTypes[series] == types.donut;  // is this a donut?
                                var polar = o.settings.seriesTypes[series] == types.polar;  // is this a polar area chart?
                                
                                var id = (o.recordCount*series) + record;            // numeric id, as before
                                id = o.objects.count;
                                var deg = 0;                                    // the degrees this segment will take up
                                
                                if (polar)
                                {
                                    if (!animated)
                                    {
                                        deg = (360/o.seriesCount) ;           // for polar charts, each segment has SAME degree quantity
                                    }
                                    else
                                    {
                                        deg = (360/o.seriesCount) * frac;           // for polar charts, each segment has SAME degree quantity
                                    }
                                    
                                    
                                }
                                else
                                {
                                    deg = (360/o.getTotalRecord(record) * val);      // for pie or donut, this is a weighted fraction based on the value
                                }
                                
                                // Make the object
                                var newObject = pieSliceObject(o, record, angleC[record], angleC[record] + deg, id, val, donut, polar, series, record);
                                
                                // Add to cumulative degree for the record (REMEMBER: one circle is one record, one SEGMENT is a series in a record)
                                angleC[record] += deg;
                                
                                // Add to the object list
                                o.objects.add(newObject);                                
                            }
                        }
                        
                        
                        if (o.settings.stacked)
                        {
                            //Stack tracking
                            stackLevels[record] += (val * valRatio);         // The next stacked bar in this record will start from here
                            stackCount++;                               // The next stacked bar will shift over by 1
                            if (stackCount == 0)
                            {
                                barCount++;
                            }   
                        }
                        

                        //Push new point into old point
                        oldPoint = newPoint;

                        counter++;
                    }
                }
                
                //Draw all the objects
                o.objects.drawAll();
                if (o.settings.seriesTypes[0] == types.donut)
                {
                    //findme
                    
                    //g.settings.ctx.stroke();
                }
            }

            //clog("testing frac < 1")
            if (frac < 1)
            {
                //clog("testing first == true")
                if (first == true)
                {                    
                    $("#" + "canvas" + o.settings.randomNumber).fadeIn(o.settings.fadeTime);
                    setTimeout(function()
                    {
                        requestAnimationFrame(function()
                        {                            
                            o.draw(startTime, false,animated)
                        });
                    }, o.settings.fadeTime)
                }
                else
                {
                    requestAnimationFrame(function()
                    {
                        if (animated)
                        {
                            o.draw(startTime, false)
                        }                        
                    });
                }

            }
        }
        outFunction("graph DRAW",3);    
    }

    //Show data in console for analysis 
    o.showData = function()
    {
        var maxLength = 15 * (o.seriesCount + 1);


        clog(repeatChar("-", maxLength)); //top line

        //add headers
        var line = "";
        line += fixLength('', 14);
        for (x = 0; x < o.seriesCount; x++)
        {
            line += fixLength(o.series[x], 15);
        }

        clog(line);

        //add values
        for (y = 0; y < o.recordCount; y++)
        {
            //add left headers
            line = "";
            line += fixLength(o.records[y], 15);

            //Add values
            for (x = 0; x < o.seriesCount; x++)
            {
                line += fixLength(o.values.get(x, y), 15);
            }

            clog(line);
        }

        clog(repeatChar("-", maxLength)); //bottom line

        return null;
    };
    
    //Mouse over the graph object
    o.mouseOver = function(y,x)
    {        
        var obj = $("#canvas" + o.settings.randomNumber)        
        y -= obj.offset().top;
        x -= obj.offset().left;
        
        var trueY = y + obj.offset().top;
        var trueX = x + obj.offset().left;
        
        
        var currentlyTouching = o.settings.touchedObject;        
        var touchingSomething = -1;
        
        for (var i = 0; i < o.objects.count; i++)
        {
            var shape = o.objects.objects[i];
            if (shape.touching(y,x))
            {
                touchingSomething = shape.id;                
            }            
        }
        
        var enableTooltips = true;
        
        //////////////////////////////////////////////////////
        //Tooltips
        //////////////////////////////////////////////////////
        
                        
            if (touchingSomething < 0)
            {
                o.settings.touchedObject = -1;
                if (enableTooltips)
                {
                    $('.tooltip' + o.settings.randomNumber).remove();
                }
            }
            else
            {
                o.settings.touchedObject = touchingSomething;
                        
                
                var shape = o.objects.objects[touchingSomething];
                //Alter display point if the object requires it
                if (shape.staticTooltips)
                {
                    trueX = shape.tipX + obj.offset().left;
                    trueY = shape.tipY + obj.offset().top;
                    //+ obj.offset().top;
                }
                
                var series = o.objects.objects[touchingSomething].series;
                var record = o.objects.objects[touchingSomething].record;
                     
                if (enableTooltips)
                {
                    var contents = "";
                    
                    switch (o.settings.tooltipContents)
                    {
                        case toolTipContentTypes.record:
                            contents = "" + o.records[record] + ": " + o.values.get(series,record)+ "<br>";
                            break;
                        case toolTipContentTypes.series:
                            contents = "" + o.series[series] + ": " + o.values.get(series,record)+ "<br>";
                            break;
                        case toolTipContentTypes.recordSeries:
                            contents = "" + o.records[record] + "/" + o.series[series] + ": " + o.values.get(series,record)+ "<br>";
                            break;
                        case toolTipContentTypes.fullRecord:
                            
                            var totalRecord = 0;
                            if (o.settings.tooltipPercentages)
                            {
                                for (var i = 0; i < o.seriesCount;i++)                        
                                {
                                    totalRecord += (o.values.get(i,record))*1;
                                }
                            }
                            
                            //Add the contents
                            var contents = "<b><u>" + o.records[record] + "</u></b><br>";
                            
                            var maxSeriesLength = 0;
                            for (var i = 0; i < o.seriesCount;i++)
                            {
                                maxSeriesLength = Math.max(maxSeriesLength,o.series[i].length)
                            }
                            for (var i = 0; i < o.seriesCount;i++)
                            {
                                if (i == series)
                                {
                                    contents += "&gt; ";
                                }
                                else
                                {
                                    contents += "&nbsp; ";
                                }
                                contents += fixLength((o.series[i] + ":"),maxSeriesLength + 2,'&nbsp;');
                                contents += fixLength(o.values.get(i,record),3,'&nbsp;');
                                
                                if (o.settings.tooltipPercentages)
                                {
                                    contents += "(" + Math.floor((100/totalRecord)*o.values.get(i,record)) + "%)";                            
                                }
                                
                                contents += "<br>";
                            }
                            break;
                        case toolTipContentTypes.fullSeries:
                            
                            var totalSeries= 0;
                            
                            if (o.settings.tooltipPercentages)
                            {
                                for (var i = 0; i < o.recordCount;i++)                        
                                {
                                    totalSeries += (o.values.get(series,i))*1;
                                }
                            }
                            
                            //Add the contents
                            var contents = "<b>" + o.series[series] + "</b><br>";
                            for (var i = 0; i < o.recordCount;i++)
                            {
                                if (i == record)
                                {
                                    contents += "&gt; ";
                                }
                                else
                                {
                                    contents += "&nbsp; ";
                                }
                                contents += fixLength((o.records[i] + ":"),10,'&nbsp;');
                                contents += fixLength(o.values.get(series,i),3,'&nbsp;');
                                
                                if (o.settings.tooltipPercentages)
                                {
                                    contents += "(" + Math.floor((100/totalSeries)*o.values.get(series,i)) + "%)";                            
                                }
                                
                                contents += "<br>";
                            }   
                            
                            break;
                        default:
                            //same as "record"
                            contents = "" + o.records[record] + "/" + o.series[series] + ": " + o.values.get(series,record)+ "<br>";
                            break;
                    }
                      
                    tooltip('tooltip' + o.settings.randomNumber, 'tooltip' + o.settings.randomNumber,trueY,trueX,contents)
                }
            }
        
        if (o.settings.touchedObject != currentlyTouching)
        {
            debug(4,"currentlyTouching " + currentlyTouching + ", touched is " + o.settings.touchedObject + " SO DRAWING");
            o.draw(now(), false, false);
        }
        else
        {
            debug(4,"currentlyTouching " + currentlyTouching + ", touched is " + o.settings.touchedObject);
        }
    }
    
    
    o.mouseExit = function()
    {
        $('#tooltip' + o.settings.randomNumber).remove();
    }
       
    //20150511 - commented this as seems redundant
    //o.init();
    
    outFunction("graph()");
    return o;
}


// 2d Array object with set and get functions
function array2d()
{
    var o = {};
    o.vals = [];   

    
    //Set a value
    o.set = function(xPos, yPos, val)
    {
        var yArray = [];
        if (o.vals[xPos] != null)
        {
            yArray = o.vals[xPos];
        }
        yArray[yPos] = val;
        o.vals[xPos] = yArray;
    };

    //Get a value
    o.get = function(xPos, yPos)
    {
        if (o.vals[xPos] == undefined)
        {
            return null;
        }
        if (o.vals[xPos][yPos] == undefined)
        {
            return null;
        }
        return o.vals[xPos][yPos];
    }


    return o;
}


///////////////////////////////////////////
//Custom static objects
///////////////////////////////////////////

//Types of chart for each series
 var types = $.extend(
 {
     bar: 1,     
     line: 2,
     scatter: 3,
     pie: 4,
     donut: 5,
     polar: 6
 });

//Horizontal Alignment
 var hAlign = $.extend(
 {
     left: 1,
     centre: 2,
     right: 3     
 });

 var toolTipContentTypes = $.extend(
 {
     record: 1,
     series: 2,
     recordSeries: 3,
     fullRecord: 4,
     fullSeries: 5     
 });

//Types line options
 var lineType = $.extend(
 {
     none: 1,     
     line: 2,
     curve: 3     
 });


///////////////////////////////////////////
//Custom object templates
///////////////////////////////////////////

//Bar object template
function barObject(settings, i, p1, p2, id, series, record, stacked)
{
    var o = {};
    o.p1 = p1;
    o.p2 = p2;
    o.drawOrder = 0;
    o.staticTooltips = true;
    o.tipY = p2.y ;
    o.tipX = p1.x + (p2.x - p1.x)/2;
    o.series = series;
    o.record = record;
    o.type = types.bar;
    if (stacked)
    {
        o.type = types.stackedBar
    }
    o.id = id;
    o.draw = function()
    {
        var y1 = Math.min(p1.y, p2.y);
        var y2 = Math.max(p1.y, p2.y);

        var x1 = Math.min(p1.x, p2.x);
        var x2 = Math.max(p1.x, p2.x);

        y2 = y2 - y1;
        x2 = x2 - x1;
        
        settings.ctx.beginPath();
        
        if (id == settings.touchedObject)
        {                        
            settings.ctx.globalAlpha=settings.highlightedOpacity;
        }
        else
        {            
            settings.ctx.globalAlpha=settings.defaultOpacity;
        }
        
        
        settings.ctx.lineWidth = settings.lineWidth;        
        settings.ctx.strokeStyle = settings.lineColor;         
        settings.ctx.fillStyle = settings.colours[i];
        
        settings.ctx.moveTo(x1, y1);
        
        settings.ctx.fillRect(x1, y1, x2, y2);
        settings.ctx.rect(x1, y1, x2, y2);
        settings.ctx.globalAlpha=1;
        settings.ctx.stroke();
        settings.ctx.lineWidth = 0;  
    };

    
    o.touching = function(y,x)
    {
        var y1 = Math.min(p1.y, p2.y);
        var y2 = Math.max(p1.y, p2.y);

        var x1 = Math.min(p1.x, p2.x);
        var x2 = Math.max(p1.x, p2.x);
        
        if (between(y,y1,y2) && between (x,x1,x2))
        {
            o.touched = true;
            return true;
        }
        else
        {
            o.touched = false;
            return false;
        }
    };
    
    return o;
}



function pieSliceObject(g, i, sAngle, eAngle, id, val, donut, polar, series, record)
{
    var settings = g.settings;
    donut = ifUnd(donut,false);     // by default, NOT a donut
    polar= ifUnd(polar,false);      // by default, NOT a polar area chart
    
    var o = {};
    o.drawOrder = 0;
    o.innerRadius = 0;
    o.outerRadius = 0;
    o.startAngle = 0;
    o.endAngle = 0;
    o.centreX = 0;
    o.centreY = 0;
    o.touched = false;
    o.staticTooltips = false;
    o.series = series;
    o.record = record;
    o.type = types.pie;
    if (donut)
    {
        o.type = types.donut;
    }
    if (polar)
    {
        o.type = types.polar;
    }
    o.id = id;
    o.draw = function()
    {
        var deg = eAngle - sAngle;
        var a = deg;
        
        var totalRadius = settings.width/4;
        var radius = totalRadius;
        
        var innerRadius = 0;
        
        if (donut)
        {                                                
            innerRadius = (record * Math.floor(totalRadius /g.recordCount));
            radius = ((record + 1) * Math.floor(totalRadius /g.recordCount)) - settings.donutGap;            
        }
        if (polar)
        {            
            innerRadius = 0;
            radius = totalRadius / g.getMaxRecord(record) * val;
        }
        
        
        var x1 = settings.width/2;                  // Centre X
        var y1 = settings.height/2;                 // Centre Y
        var x2 = (radius * Math.cos(a)) + (x1);     // Finishing X
        var y2 = (radius * Math.sin(a)) + (y1);     // Finishing Y
       
       
        //Track everything for later
        o.centreX = x1;
        o.centreY = y1;
        o.startAngle = sAngle;
        o.endAngle = eAngle;
        o.innerRadius = innerRadius;
        o.outerRadius = radius;
        
        //Aesthetics        
        settings.ctx.fillStyle = settings.colours[series] ;
        settings.ctx.lineWidth = settings.lineWidth;        
        settings.ctx.strokeStyle = settings.lineColor;
                
        
        if (id == settings.touchedObject)
        {                        
            settings.ctx.globalAlpha=g.settings.highlightedOpacity;
        }
        else
        {            
            settings.ctx.globalAlpha=g.settings.defaultOpacity;
        }
        
        //Drawing
        var innerX = (innerRadius * Math.cos(d2r(eAngle))) + x1;
        var innerY = (innerRadius * Math.sin(d2r(eAngle))) + y1;               
                  
        
        settings.ctx.beginPath();        
        settings.ctx.arc(x1, y1, radius, d2r(sAngle), d2r(eAngle));
        settings.ctx.lineTo(innerX,innerY); 
        settings.ctx.arc(x1, y1, innerRadius, d2r(eAngle), d2r(sAngle), true);
        
        if (settings.lineColor > 0)
        {
            settings.ctx.stroke();    
        }
        
        
        settings.ctx.closePath();
        
        settings.ctx.fill();
        
        
        settings.ctx.globalAlpha=1;
    };
    o.touching = function(y,x)
    {
        var len = findLength(o.centreX,o.centreY,x,y);
        var touching = false;
        
        if (between(len,o.innerRadius,o.outerRadius))
        {
            var angle = findAngle(o.centreX,o.centreY,x,y);
            if (between(angle,o.startAngle,o.endAngle))
            {             
                touching = true;    
            }
            else
            {                
                touching = false;
            }
            
        }
        else
        {                        
            touching = false;
        }
        
        
        return touching;
    }
    
    return o;
}


//Line object template
function lineObject(settings, i, p1, p2, id, series, record)
{
    
    var o = {};
    o.p1 = p1;
    o.p2 = p2;
    o.drawOrder = 0;
    o.series = series;
    o.record = record;
    o.id = id;
    o.draw = function()
    {        
        drawLine(settings.ctx, settings.colours[series], settings.lineWidth, p1, p2);
    };
    
    o.touching = function(y,x)
    {
        return false;
    }

    return o;

}

//Dot object template
function dotObject(settings, i, oldPoint, p, id, series, record)
{
    var lines = settings.lines;
    var o = {};
    o.p1 = p;
    o.drawOrder = 1;
    o.staticTooltips = true;
    o.series = series;
    o.record = record;
    o.id = id;
    
    lines = false;
    o.draw = function()
    {        
        clog("drawing!")
        settings.ctx.fillStyle = settings.bgCol;
        settings.ctx.beginPath();
        settings.ctx.arc(p.x, p.y, settings.lineWidth * 3, 0, 2 * Math.PI, false);        
        
        if (id == settings.touchedObject)
        {
            settings.ctx.fillStyle = settings.colours[series] ;
            
            //settings.ctx.fillStyle = '#000';
        }
        else
        {
            settings.ctx.fillStyle = '#FFF';
            
        }
        
        
        
        settings.ctx.fill();        
        settings.ctx.lineWidth = settings.lineWidth;
        settings.ctx.strokeStyle = settings.colours[series] ;
        clog("applying colour " + settings.colours[series] + " with lineWidth of " + settings.lineWidth)
        settings.ctx.stroke();        
        
        settings.ctx.fillStyle = settings.bgCol;
        settings.ctx.globalAlpha=1;
       
        
        
    };
    
    
    
    
    o.touching = function(y,x)
    {
        
        var y1 = p.y;
        var x1 = p.x;
        
        if (near(y,y1,5) && near(x,x1,5))
        {
            o.touched = true;
            return true;
        }
        else
        {
            o.touched = false;
            return false;
        }
    };
    return o;
}

//Label object template
function labelObject(settings, p, text, id)
{
    var o = {};
    o.text = text;
    o.p1 = p;
    o.drawOrder = 99;
    o.id = id;
    
    o.draw = function()
    {
        canvasWrite(settings.ctx, text, o.p1.y, o.p1.x, settings.fontSize - 1, settings.font, settings.fontColour,hAlign.le)
    }
    return o;
}

//Objects collection
function objectsCollection()
{
    var o = {};
    o.maxOrder = 0;
    o.objects = [];
    o.count = 0;
    
    o.add = function(child)
    {
        o.objects[o.count] = child;
        o.count++;
        o.maxOrder = Math.max(o.maxOrder, child.drawOrder);        
    };
    o.clear = function()
    {
        o.count = 0;
        o.objects = [];
    };
    o.get = function(i)
    {
        if (i < o.count)
        {
            return o.objects[i];
        }
        else
        {
            return null;
        }
    };
    
    o.drawAll = function()
    {
        o.maxOrder = 1;
        for (var d = 0; d <= o.maxOrder; d++)
        {
            for (var i = 0; i < o.count; i++)
            {

                var child = o.get(i);
                if (child.drawOrder == d)
                {
                    child.draw();
                }
            }
        }        
    }


    o.clear();
    return o;
}


function seriesRecord(series, record)
{
    var o = {};
    o.series = series;
    o.record = record;
    return o;
}