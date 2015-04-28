
//Define jQuery function
(function($)
{

    $.fn.jChart = function(options)
    {
        /////////////////////////
        //parameters
        /////////////////////////
        var settings = $.extend(
        {
            //General                            
            randomNumber: Math.round(Math.random() * 100),          // Random number for the chart ID
            ctx: null,                                              // Context
            cols: -1,                                               // Number of columns per series
            splitCharacter: ",",                                    // How to split the original data
            position: 'absolute',                                   // CSS Positioning of the canvas
            top: 0,                                                 // Top Position (CSS)
            left: 0,                                                // Left Position (CSS)
            font: "'Titillium Web', sans-serif",                    // Font face
            fontColor: '#888',                                      // Font colour
            fontSize: 12,                                           // Font size
            bgCol: "transparent",                                   // Canvas Background Colour
            width: 300,                                             // Width of canvas
            height: 300,                                            // Height of canvas
            margin: 40,                                             // Margin around drawarea
            lineCol: "#333",                                        // For line chart or outside of bars
            totalTime: 700,                                         // Time (ms) for animation
            fadeTime: 400,                                          // Time (ms) for fading in first
                    
            
            //Axis info
            borderCol: "#aaa",                                      // For the axis borders                        
            yScale: 1,                                              // incremental values on y axis
            
            
            //Labels
            labels: ["name","none","name"],                         // none/name/value - what to show on labels
            labelYOffset: 14,                                       // Y offset positioning of labels
            labelXOffset: 3,                                        // X offset positioning of labels
            
            //Bar chart specifics
            drawBars: [true,false,false],
            colours: ['#3498db', '#e67e22', '#16a085', '#34495e', '#e74c3c', '#95a5a6', '#1abc9c', '#f1c40f'],                                    
            gap: 10,
            
            //Line chart specifics
            drawLines: [false,true,false],
            lineWidth: 2,                                            // line width
            dots: true,
            shadeUnderLine: true,
                           
            //Scatter graph specifics
            drawDots: [false,true,false],
            dotFill: '#eaeaea'
            
        }, options);


        /////////////////////////
        //grab the data
        /////////////////////////
        //var data = this.html();
        //data = data.split(settings.splitCharacter)
        
        var g = graph();
        g.convertTable(this);
        data = g.values.x[0];
        
        var cols = settings.cols;
        if (settings.cols < 0)
        {
            cols = data.length / 2; // TODO: this should be able to be overwritten by jquery    
        }        
        var barWidth = ((settings.width - (2 * settings.margin)) - (settings.gap * (cols + 1))) / cols; // calculate bar width based on total columns etc

        //Find the maximum value
        var maxVal = 0;
        var minVal = 0;
        for (var i = cols; i < data.length; i++)
        {
            if (data[i] > maxVal)
            {
                maxVal = data[i];
            }
            if (data[i] < minVal)
            {
                minVal = data[i];
            }
        }


        /////////////////////////
        //create canvas
        /////////////////////////

        //Find pixels per value (i.e. ratio)
        var valRatio = (settings.height - (2 * settings.margin)) / maxVal;

        //Make the canvas
        var ctx = settings.ctx; 
        if (settings.ctx == null)
        {
            ctx = makeCanvas("canvas" + settings.randomNumber, settings.bgCol, settings.height, settings.width, settings.position, settings.left, settings.top);
            $("#" + "canvas" + settings.randomNumber).hide();
            settings.ctx = ctx;
        }
        
        /////////////////////////
        //write values etc
        /////////////////////////
        draw(now(), true);
        
        
        function draw(startTime, first)
        {
            wipeCanvas("canvas" + settings.randomNumber);
            
            
            //Add the borders 
            drawLine(ctx, settings.borderCol, 1, point(settings.height - settings.margin, settings.margin), point(settings.height - settings.margin, settings.width - settings.margin));
            drawLine(ctx, settings.borderCol, 1, point(settings.height - settings.margin, settings.margin), point(settings.margin, settings.margin));

            //Add the x axis values
            for (var i = 0; i < cols; i++)
            {
                var x = (barWidth / 2) + (settings.margin + (barWidth * i) + (settings.gap * (i + 1)));
                canvasWrite(ctx, data[i], settings.height - settings.margin + 12, x, settings.fontSize, settings.font, settings.fontColor)
            }

            //Add the y axis values
            var yVals = (maxVal - minVal) / settings.yScale;
            for (var i = minVal; i <= yVals; i++)
            {
                var val = minVal + (settings.yScale * i);
                var y = ((settings.height - settings.margin) - (settings.height - settings.margin * 2) / yVals * i) + settings.fontSize / 2;
                canvasWrite(ctx, val, y, settings.margin - 12, settings.fontSize - 1, settings.font, settings.fontColor)
            }


            //Calculate the timing fraction
            var frac = (now() - (startTime + (settings.fadeTime*1.5))) / settings.totalTime;
            
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
                
                for (var series = 0; series < (data.length-cols)/cols; series++)
                {
                    //previous point (0,0)
                    var oldPoint = null;
                
                    //Clear the current objects
                    objects.clear();
                
                    //Loop through values
                    for (var i = 0; i < cols; i++)
                    {
                        
                        offSet = cols + (cols * series);
                        var originalval = data[offSet + i];
                        val = originalval * frac;
                                
                    
                        ///////////////////////////////////////////
                        //Add labels
                        ///////////////////////////////////////////
                        if (settings.labels[series] != "none")
                        {                    
                            var displayVal= "";
                            
                            //What value to show?
                            if (settings.labels[series] == "value")  { displayVal = originalval; }
                            if (settings.labels[series] == "name")   { displayVal = data[i];     }
    
                            //Where to show it
                            var x = (settings.margin + (barWidth * i)) + (settings.gap * (i + 1)) + barWidth/2 - (settings.fontSize - 1)/2 ;
                            var y = (settings.height - settings.margin) - (val * valRatio);
                            
                            var labelYOffset = settings.labelYOffset;                                            
                            var newPoint = point (y + labelYOffset,x + settings.labelXOffset);
    
                            var o = labelObject(settings,newPoint,displayVal)                        
                            objects.add(o);                        
                        }
                        
                        ///////////////////////////////////////////
                        //barchart version
                        ///////////////////////////////////////////
                        if (settings.drawBars[series])
                        {                
                            var p1 = point(settings.height - settings.margin, (settings.margin + (barWidth * i) + (settings.gap * (i + 1))));
                            var p2 = point((settings.height - settings.margin) - (val * valRatio), (settings.margin + (barWidth * i)) + (settings.gap * (i + 1)) + barWidth);                        
                            var o = barObject(settings,i,p1,p2);
                            objects.add(o);
                        }
            
                        ///////////////////////////////////////////
                        //line version
                        ///////////////////////////////////////////
                        if (settings.drawLines[series])
                        {
                            var y = (settings.height - settings.margin) - (val * valRatio);
                            var x = (settings.margin + (barWidth * i)) + (settings.gap * (i + 1)) + barWidth/2;
                            var newPoint = point (y,x);
                                         
                            if (oldPoint == null)
                            {
                                oldPoint = newPoint;
                            }
                            var o = lineObject(settings, i, oldPoint, newPoint);
                            objects.add(o);                                            
                        }
                                           
                        ///////////////////////////////////////////
                        //Scatter Graph
                        ///////////////////////////////////////////
                        if (settings.drawDots[series])
                        {
                            var y = (settings.height - settings.margin) - (val * valRatio);
                            var x = (settings.margin + (barWidth * i)) + (settings.gap * (i + 1)) + barWidth/2;
                            var newPoint = point (y,x);
        
                            var o = dotObject(settings,i,newPoint);
                            objects.add(o);                        
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
                    $("#" + "canvas" + settings.randomNumber).fadeIn(settings.fadeTime);                    
                    //clog("showing");
                    setTimeout(function(){requestAnimationFrame(function(){draw(startTime, false)});},settings.fadeTime)
                }
                else
                {
                    requestAnimationFrame(function(){draw(startTime, false)});
                }
                
            }
        }

        return $("#" + "canvas" + settings.randomNumber);
    };
}(jQuery));



///////////////////////////////////////////
//Custom objects
///////////////////////////////////////////
function barObject(settings, i, p1, p2)
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
    
        settings.ctx.fillStyle = settings.colours[i];
        settings.ctx.strokeStyle = settings.lineCol;
        settings.ctx.moveTo(x1, y1);
    
        settings.ctx.fillRect(x1, y1, x2, y2);
        settings.ctx.rect(x1, y1, x2, y2);
    };
    
    return o;
}

function lineObject(settings, i, p1 ,p2)
{
    var o = {};
    o.p1 = p1;
    o.p2 = p2;
    o.drawOrder = 0;
    o.draw = function()
    {
       drawLine(settings.ctx, settings.lineCol, settings.lineWidth, p1, p2) ;
    }
    return o;
}

function dotObject(settings,i,p)
{
    var o = {};
    o.p1 = p;
    o.drawOrder = 1;
    o.draw = function()
    {        
        settings.ctx.beginPath();
        settings.ctx.arc(p.x, p.y, settings.lineWidth*1.5, 0, 2 * Math.PI, false);
        settings.ctx.fillStyle = settings.dotFill;
        settings.ctx.fill();
        settings.ctx.lineWidth = settings.lineWidth;
        settings.ctx.strokeStyle = settings.dotFill;
        settings.ctx.stroke();
    }
    return o;
}

function labelObject(settings,p,text)
{
    var o = {};
    o.text = text;
    o.p1 = p;
    o.drawOrder = 99;
    o.draw = function()
    {
        canvasWrite(settings.ctx, text, o.p1.y, o.p1.x, settings.fontSize - 1, settings.font, settings.fontColor)                                        
    }
    return o;
}

function objectsCollection()
{
    var o = {};
    o.maxOrder = 0;

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



///////////////////////////////////////////
//Canvas functions
///////////////////////////////////////////
function canvasWrite(ctx, txt, y, x, fontSize, font, color)
{
    ctx.font = fontSize + "px " + font;
    ctx.fillStyle = color;
    ctx.fillText(txt, x, y);
}

function makeCanvas(id, bgCol, height, width, position, left, top)
{
    $("body").append("<canvas id='" + id + "' style='position:" + position + "; top:" + top + "px; left:" + left + "px;  ' height=" + height + "px width=" + width + "px></canvas>");
    var ctx = getContext(id);
    ctx.clearRect(0, 0, width, height);
    //drawBox(ctx, "transparent", bgCol, point(0, 0), point(height, width));

    return ctx;
}

function getContext(id)
{
    var canvas = document.getElementById(id); // grab canvas element
    var ctx = canvas.getContext('2d'); // 2d context of element    
    return ctx;
}

function wipeCanvas(id)
{
    var canvas = document.getElementById(id); // grab canvas element
    var ctx = canvas.getContext('2d'); // 2d context of element
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas    

}



///////////////////////////////////////////
//Custom drawing functions
///////////////////////////////////////////
function point(y, x)
{
    var p = {};
    p.y = y;
    p.x = x;
    return p;
}

function drawLine(ctx, col, lineWidth, p1, p2)
{
    ctx.strokeStyle = col;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}



///////////////////////////////////////////
//General
///////////////////////////////////////////
function clog(s)
{
    console.log(s);
}

function now()
{
    return new Date().getTime();
}
