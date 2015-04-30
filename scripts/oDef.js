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

    o.test = "initialValue";

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
                o.values.add(i, o.recordCount - 1, vals[i]);
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

            o.values.add(x, y, val);

            return true;
        }
        catch (e)
        {
            debug(1, "Could not add to series '" + seriesKey + "' in record '" + recordKey + "'");
            return false;
        }
    }


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

    o.draw = function(startTime, first)
    {
        
        //Find pixels per value (i.e. ratio)
        var valRatio = (o.settings.height - (2 * o.settings.margin)) / maxVal;        
              
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
            canvasWrite(ctx, o.records[i], o.settings.height - o.settings.margin + 12, x, o.settings.fontSize, o.settings.font, o.settings.fontColor)
        }



        //Find the maximum value
        var maxVal = 0;
        var minVal = 0;
        for (var r = 0; r < o.recordCount; r++)
        {
            var val = 0;
            var stackVal = 0;
            for (var s = 0; s < o.seriesCount; s++)
            {
                val = Number(o.get(o.records[r], o.series[s]));
                if (o.settings.stack[s] == true)
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
        }


        //Add the y axis values (just the bar and numbers)
        var yVals = (maxVal - minVal) / o.settings.yScale;
        for (var i = minVal; i <= yVals; i++)
        {
            var val = minVal + (o.settings.yScale * i);
            var y = ((o.settings.height - o.settings.margin) - (o.settings.height - o.settings.margin * 2) / yVals * i) + o.settings.fontSize / 2;
            canvasWrite(ctx, val, y, o.settings.margin - 15, o.settings.fontSize - 1, o.settings.font, o.settings.fontColor)
        }

        //Calculate the timing fraction
        var frac = (now() - (startTime + (o.settings.fadeTime * 1.5))) / o.settings.totalTime;

        //frac = 1;
        if (frac < 0)
        {
            frac = 0;
        }
        if (frac > 1)
        {
            frac = 1;
        }

        debug(1,"RECURSING MAYBE WITH FRAC=" + frac);        
        
        
        if (frac > 0)
        {
            var series = 0;

            var objects = objectsCollection();

            for (var series = 0; series < o.seriesCount; series++)
            {
                //previous point (0,0)
                var oldPoint = null;

                //Clear the current objects
                objects.clear();

                //Loop through values
                for (var i = 0; i < o.recordCount; i++)
                {

                    offSet = o.recordCount + (o.recordCount * series);
                    //var originalval = data[offSet + i];
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
                    if (o.settings.drawBars[series])
                    {
                        var p1 = point(o.settings.height - o.settings.margin, (o.settings.margin + (barWidth * i) + (o.settings.gap * (i + 1))));
                        var p2 = point((o.settings.height - o.settings.margin) - (val * valRatio), (o.settings.margin + (barWidth * i)) + (o.settings.gap * (i + 1)) + barWidth);
                        var newObject = barObject(o.settings, i, p1, p2);
                        objects.add(newObject);
                    }

                    ///////////////////////////////////////////
                    //line version
                    ///////////////////////////////////////////
                    if (o.settings.drawLines[series])
                    {
                        var y = (o.settings.height - o.settings.margin) - (val * valRatio);
                        var x = (o.settings.margin + (barWidth * i)) + (o.settings.gap * (i + 1)) + barWidth / 2;
                        var newPoint = point(y, x);

                        if (oldPoint == null)
                        {
                            oldPoint = newPoint;
                        }
                        var newObject = lineObject(o.settings, i, oldPoint, newPoint);
                        objects.add(newObject);
                    }

                    ///////////////////////////////////////////
                    //Scatter Graph
                    ///////////////////////////////////////////
                    if (o.settings.drawDots[series])
                    {
                        var y = (o.settings.height - o.settings.margin) - (val * valRatio);
                        var x = (o.settings.margin + (barWidth * i)) + (o.settings.gap * (i + 1)) + barWidth / 2;
                        var newPoint = point(y, x);

                        var newObject = dotObject(o.settings, i, newPoint);
                        objects.add(newObject);
                    }


                    //Push new point into old point
                    oldPoint = newPoint;

                }

                //Draw all the objects
                objects.drawAll();
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




    o.dsadsa = function()
    {






        //Calculate the timing fraction
        var frac = (now() - (startTime + (o.settings.fadeTime * 1.5))) / o.settings.totalTime;

        //frac = 1;
        if (frac < 0)
        {
            frac = 0;
        }
        if (frac > 1)
        {
            frac = 1;
        }


        if (frac > 0)
        {
            var series = 0;

            var objects = objectsCollection();

            for (var series = 0; series < o.seriesCount; series++)
            {
                //previous point (0,0)
                var oldPoint = null;

                //Clear the current objects
                objects.clear();

                //Loop through values
                for (var i = 0; i < o.recordCount; i++)
                {

                    offSet = o.recordCount + (o.recordCount * series);
                    //var originalval = data[offSet + i];
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

                        var o = labelObject(o.settings, newPoint, displayVal)
                        objects.add(o);
                    }

                    ///////////////////////////////////////////
                    //barchart version
                    ///////////////////////////////////////////
                    if (o.settings.drawBars[series])
                    {
                        var p1 = point(o.settings.height - o.settings.margin, (o.settings.margin + (barWidth * i) + (o.settings.gap * (i + 1))));
                        var p2 = point((o.settings.height - o.settings.margin) - (val * valRatio), (o.settings.margin + (barWidth * i)) + (o.settings.gap * (i + 1)) + barWidth);
                        var o = barObject(o.settings, i, p1, p2);
                        objects.add(o);
                    }

                    ///////////////////////////////////////////
                    //line version
                    ///////////////////////////////////////////
                    if (o.settings.drawLines[series])
                    {
                        var y = (o.settings.height - o.settings.margin) - (val * valRatio);
                        var x = (o.settings.margin + (barWidth * i)) + (o.settings.gap * (i + 1)) + barWidth / 2;
                        var newPoint = point(y, x);

                        if (oldPoint == null)
                        {
                            oldPoint = newPoint;
                        }
                        var o = lineObject(o.settings, i, oldPoint, newPoint);
                        objects.add(o);
                    }

                    ///////////////////////////////////////////
                    //Scatter Graph
                    ///////////////////////////////////////////
                    if (o.settings.drawDots[series])
                    {
                        var y = (o.settings.height - o.settings.margin) - (val * valRatio);
                        var x = (o.settings.margin + (barWidth * i)) + (o.settings.gap * (i + 1)) + barWidth / 2;
                        var newPoint = point(y, x);

                        var o = dotObject(o.settings, i, newPoint);
                        objects.add(o);
                    }


                    //Push new point into old point
                    oldPoint = newPoint;

                }

                //Draw all the objects
                objects.drawAll();
            }
        }


        debug(1, "RECURSING");
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
                        draw(startTime, false)
                    });
                }, o.settings.fadeTime)
            }
            else
            {
                requestAnimationFrame(function()
                {
                    draw(startTime, false)
                });
            }

        }
    }

    //return $("#" + "canvas" + o.settings.randomNumber);

















    //Draw! 
    o.drawStub = function()
    {
        var tab = "    ";
        stub("DRAW FUNCTION");

        //add headers
        var line = "";
        line += fixLength("-", 15);
        for (x = 0; x < o.seriesCount; x++)
        {
            line += fixLength(o.series[x], 15);
        }

        clog(line);

        //add values
        for (y = 0; y < o.recordCount; y++)
        {
            line = "";
            //add left headers
            line += fixLength(o.records[y], 15);
            for (x = 0; x < o.seriesCount; x++)
            {
                line += fixLength(o.values.get(x, y), 15);
            }
            clog(line);
        }
    };

    return o;
}



function array2d()
{
    var o = {};

    o.x = [];

    o.add = function(xPos, yPos, val)
    {
        var yArray = [];
        if (o.x[xPos] != null)
        {
            yArray = o.x[xPos];
        }
        yArray[yPos] = val;
        o.x[xPos] = yArray;
    };

    o.get = function(xPos, yPos)
    {
        if (o.x[xPos] == undefined)
        {
            return null;
        }
        if (o.x[xPos][yPos] == undefined)
        {
            return null;
        }
        return o.x[xPos][yPos];
    }


    return o;
}