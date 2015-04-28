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
                        vals[x-1] = val;                        
                    }
                    
                }
            });
            
            if (y == 0)
            {
                //Add the series collection
                for (var i = 1; i < vals.length;i++)
                {
                    o.addSeries(vals[i]);
                }
            }
            else
            {
                //Add a new record
                o.addRecord(record,vals);
            }
        });
    }

    //Draw! 
    o.draw = function()
    {
        var tab = "    ";
        stub("DRAW FUNCTION");

        //add headers
        var line = "";
        line += "-" + tab;
        for (x = 0; x < o.seriesCount; x++)
        {
            line += o.series[x] + tab;
        }
        clog(line);


        //add values
        for (y = 0; y < o.recordCount; y++)
        {
            line = "";
            //add left headers
            line += o.records[y] + tab;
            for (x = 0; x < o.seriesCount; x++)
            {
                line += o.values.get(x, y) + tab;
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