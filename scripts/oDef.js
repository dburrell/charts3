function graph(type)
{
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
    
    //Add a series holder with name
    o.addSeries = function(s)
    {
        o.seriesNames[s] = o.seriesCount;
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
                o.values.set(i, o.recordCount - 1, vals[i]);
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
            o.values.set(x, y, val);
            return true;
        }
        catch (e)
        {
            debug(1, "Could not add to series '" + seriesKey + "' in record '" + recordKey + "'");
            return false;
        }
    }

    //Set a different series type
    o.setSeriesType = function(i,n)
    {
        o.settings.seriesTypes[i] = n;
    };
    
    //Import data from a table
    o.convertTable = function(tableSearchString)
    {
        var table = $(tableSearchString);

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
                for (var i = 1; i < vals.length; i++)
                {
                    o.addSeries(vals[i]);
                }
            }
            else
            {
                //Add a new record
                o.addRecord(record, vals);
            }
        });
    };

    //Animated Draw Function
    o.draw = function(startTime, first, animated)
    {        
        if (animated == undefined)
        {
            animated = true;            
        }
        
        if (startTime == undefined)
        {
            o.draw(now(),true);
        }
        else
        {
            var stackLevels = [];                
            var barWidth = ((o.settings.width - (2 * o.settings.margin)) - (o.settings.gap * (o.recordCount + 1))) / o.recordCount; // calculate bar width based on total columns etc
            var ctx = o.settings.ctx;

            wipeCanvas("canvas" + o.settings.randomNumber);

            //Add the borders 
            drawLine(ctx, o.settings.borderCol, 1, point(o.settings.height - o.settings.margin, o.settings.margin), point(o.settings.height - o.settings.margin, o.settings.width - o.settings.margin));
            drawLine(ctx, o.settings.borderCol, 1, point(o.settings.height - o.settings.margin, o.settings.margin), point(o.settings.margin, o.settings.margin));

            //Add the x axis values (record values)
            for (var i = 0; i < o.recordCount; i++)
            {
                var x = (barWidth / 2) + (o.settings.margin + (barWidth * i) + (o.settings.gap * (i + 1)));
                canvasWrite(ctx, o.records[i], o.settings.height - o.settings.margin + 12, x, o.settings.fontSize, o.settings.font, o.settings.fontColor, hAlign.centre)
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
                    val = Math.max(Number(o.get(o.records[r], o.series[s])), val);
                    if (o.settings.seriesTypes[s] == types.stackedBar)
                    {
                        stackVal += val;
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
                canvasWrite(ctx, val, y, o.settings.margin - 3, o.settings.fontSize - 1, o.settings.font, o.settings.fontColor,hAlign.right)
            }

            o.settings.fadeTime = 0;
            
            //Calculate the timing fraction
            var frac = (now() - (startTime + (o.settings.fadeTime * 1.5))) / o.settings.totalTime;

            frac = Math.max(0, frac); // frac must not be below 0
            frac = Math.min(1, frac); // frac must not be above 1

            if (!animated)
            {                
                frac = 1;
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
                
                //Calcualte individual bar widths
                var barShifts = [];
                var stackCounted = 0
                for (var series = 0; series < o.seriesCount; series++)
                {
                    if (o.settings.seriesTypes[series] == types.bar)
                    {
                        barShifts[series] = totalBarCount;
                        totalBarCount ++;
                    }
                    if (o.settings.seriesTypes[series] == types.stackedBar && stackCounted == 0)
                    {
                        barShifts[series] = totalBarCount;
                        stackCounted = 1;
                        totalBarCount ++;
                    }
                }
                
                //Clear the current objects
                o.objects.clear();

                for (var series = 0; series < o.seriesCount; series++)
                {
                    //previous point (0,0)
                    var oldPoint = null;                
                    var barCount = 0;
                    
                    //Loop through values
                    for (var i = 0; i < o.recordCount; i++)
                    {
                        offSet = o.recordCount + (o.recordCount * series);
                        
                        var originalval = o.get(o.records[i], o.series[series]);
                        val = originalval * frac;


                        ///////////////////////////////////////////
                        //Add labels
                        ///////////////////////////////////////////
                        if (o.settings.labels[series] != "none")
                        {
                            var displayVal = "";

                            //What value to show?
                            if (o.settings.labels[series] == "value")
                            {
                                displayVal = originalval;
                            }
                            if (o.settings.labels[series] == "name")
                            {
                                displayVal = o.records[i];
                            }

                            //Where to show it
                            var x = (o.settings.margin + (barWidth * i)) + (o.settings.gap * (i + 1)) + barWidth / 2 - (o.settings.fontSize - 1) / 2;
                            var y = (o.settings.height - o.settings.margin) - (val * valRatio);

                            var labelYOffset = o.settings.labelYOffset;
                            var newPoint = point(y + labelYOffset, x + o.settings.labelXOffset);

                            var newObject = labelObject(o.settings, newPoint, displayVal)
                            objects.add(newObject);
                        }

                        ///////////////////////////////////////////
                        //barchart version
                        ///////////////////////////////////////////
                        if (o.settings.seriesTypes[series] == types.bar)
                        {
                            var width = barWidth/totalBarCount;  //the actual width of each bar - barWidth will be used 
                            var p1 = point(o.settings.height - o.settings.margin, (barShifts[series] * width) + (o.settings.margin + ((barWidth * i)) + (o.settings.gap * (i + 1))));
                            var p2 = point((o.settings.height - o.settings.margin) - (val * valRatio), (barShifts[series]* width) + (o.settings.margin + (barWidth * i)) + ((o.settings.gap * (i + 1)) + width) );
                            var id = (o.recordCount*series) + i;
                            var newObject = barObject(o.settings, series, p1, p2, id);
                            o.objects.add(newObject);
                            barCount++;
                        }
                        
                        ///////////////////////////////////////////
                        //stacked barchart version
                        ///////////////////////////////////////////
                        if (o.settings.seriesTypes[series] == types.stackedBar)
                        {
                            var stackOffset = 0;    // for debugging, should be 0 in general
                            var p1 = point((o.settings.height - o.settings.margin) - stackLevels[i], (o.settings.margin + (barWidth * i) + (o.settings.gap * (i + 1))) + stackCount * stackOffset );
                            var p2 = point(((o.settings.height - o.settings.margin) - (val * valRatio)) - stackLevels[i], (o.settings.margin + (barWidth * i)) + (o.settings.gap * (i + 1)) + barWidth + stackCount * stackOffset);
                            var id = (o.recordCount*series) + i;
                            var newObject = barObject(o.settings, series, p1, p2,id);
                            o.objects.add(newObject);
                            
                            //Stack specifics
                            stackLevels[i] += (val * valRatio);         // The next stacked bar in this record will start from here
                            stackCount++;                               // The next stacked bar will shift over by 1
                            if (stackCount == 0)
                            {
                                barCount++;
                            }
                        }

                        ///////////////////////////////////////////
                        //line version
                        ///////////////////////////////////////////
                        if (o.settings.seriesTypes[series] == types.line)
                        {
                            var y = (o.settings.height - o.settings.margin) - (val * valRatio);
                            var x = (o.settings.margin + (barWidth * i)) + (o.settings.gap * (i + 1)) + barWidth / 2;
                            var newPoint = point(y, x);

                            if (oldPoint == null)
                            {
                                oldPoint = newPoint;
                            }
                            var newObject = lineObject(o.settings, i, oldPoint, newPoint);
                            o.objects.add(newObject);
                        }

                        ///////////////////////////////////////////
                        //Scatter Graph
                        ///////////////////////////////////////////
                        if (o.settings.seriesTypes[series] == types.scatter)
                        {
                            var y = (o.settings.height - o.settings.margin) - (val * valRatio);
                            var x = (o.settings.margin + (barWidth * i)) + (o.settings.gap * (i + 1)) + barWidth / 2;
                            var newPoint = point(y, x);

                            var newObject = dotObject(o.settings, i, newPoint);
                            o.objects.add(newObject);
                        }


                        //Push new point into old point
                        oldPoint = newPoint;

                    }

                    //Draw all the objects
                    o.objects.drawAll();
                }
            }

            //clog("testing frac < 1")
            if (frac < 1)
            {
                //clog("testing first == true")
                if (first == true)
                {
                    //clog("first is true")
                    $("#" + "canvas" + o.settings.randomNumber).fadeIn(o.settings.fadeTime);
                    //clog("showing");
                    setTimeout(function()
                    {
                        requestAnimationFrame(function()
                        {
                            o.draw(startTime, false)
                        });
                    }, o.settings.fadeTime)
                }
                else
                {
                    requestAnimationFrame(function()
                    {
                        o.draw(startTime, false)
                    });
                }

            }
        }
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

    
    
    o.mouseOver = function(y,x)
    {
        y -= o.settings.top;
        x -= o.settings.left;
        
        var touchingSomething = -1;
        
        for (var i = 0; i < o.objects.count; i++)
        {
            var obj = o.objects.objects[i];
            if (obj.touching(y,x))
            {
                touchingSomething = i;                
            }            
        }
        if (touchingSomething < 0)
        {
            o.settings.touchedObject = -1;
            $('#tooltip' + o.settings.randomNumber).remove();
        }
        else
        {
            o.settings.touchedObject = touchingSomething;
            var series = Math.floor(touchingSomething/o.recordCount);
            var record = touchingSomething - (series * o.recordCount);
                    
            var contents = "" + o.records[record] + "/" + o.series[series] + ": " + o.values.get(series,record)+ "<br>";
                    
            tooltip('tooltip' + o.settings.randomNumber, 'tooltip' + o.settings.randomNumber,y,x,contents)
            
        }
        o.draw(now(),true,false);
        
    }
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
     stackedBar: 2,
     line: 3,
     scatter: 4
 });

//Horizontal Alignment
 var hAlign = $.extend(
 {
     left: 1,
     centre: 2,
     right: 3     
 });





///////////////////////////////////////////
//Custom object templates
///////////////////////////////////////////

//Bar object template
function barObject(settings, i, p1, p2, id)
{
    var o = {};
    o.p1 = p1;
    o.p2 = p2;
    o.drawOrder = 0;
    
    o.draw = function()
    {
        var y1 = Math.min(p1.y, p2.y);
        var y2 = Math.max(p1.y, p2.y);

        var x1 = Math.min(p1.x, p2.x);
        var x2 = Math.max(p1.x, p2.x);

        y2 = y2 - y1;
        x2 = x2 - x1;
        
        if (id == settings.touchedObject)
        {                        
            settings.ctx.globalAlpha=0.4;
        }
        else
        {            
            settings.ctx.globalAlpha=1;
        }
        settings.ctx.strokeStyle = settings.lineCol;
        settings.ctx.fillStyle = settings.colours[i];
        
        settings.ctx.moveTo(x1, y1);
        settings.ctx.fillRect(x1, y1, x2, y2);
        settings.ctx.rect(x1, y1, x2, y2);
        settings.ctx.globalAlpha=1;
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

//Line object template
function lineObject(settings, i, p1, p2)
{
    var o = {};
    o.p1 = p1;
    o.p2 = p2;
    o.drawOrder = 0;
    o.draw = function()
    {
        drawLine(settings.ctx, settings.lineCol, settings.lineWidth, p1, p2);
    };    
    return o;
}

//Dot object template
function dotObject(settings, i, p)
{
    var o = {};
    o.p1 = p;
    o.drawOrder = 1;
    o.draw = function()
    {
        settings.ctx.beginPath();
        settings.ctx.arc(p.x, p.y, settings.lineWidth * 1.5, 0, 2 * Math.PI, false);
        settings.ctx.fillStyle = settings.dotFill;
        settings.ctx.fill();
        settings.ctx.lineWidth = settings.lineWidth;
        settings.ctx.strokeStyle = settings.dotFill;
        settings.ctx.stroke();
    }
    return o;
}

//Label object template
function labelObject(settings, p, text)
{
    var o = {};
    o.text = text;
    o.p1 = p;
    o.drawOrder = 99;
    o.draw = function()
    {
        canvasWrite(settings.ctx, text, o.p1.y, o.p1.x, settings.fontSize - 1, settings.font, settings.fontColor,hAlign.le)
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