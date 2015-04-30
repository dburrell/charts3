
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
            yScale: 10,                                              // incremental values on y axis
            
            
            //Labels
            labels: ["name","none","name"],                         // none/name/value - what to show on labels
            labelYOffset: 14,                                       // Y offset positioning of labels
            labelXOffset: 3,                                        // X offset positioning of labels
            
            //Bar chart specifics
            drawBars: [true,false,false],
            stack:[true,false,false],
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
        //data = g.values.x[0];
        
        var cols = settings.cols;
        if (settings.cols < 0)
        {
            cols = g.recordCount;
        }        
       
        

        
        /////////////////////////////////
        //create canvas ONCE
        /////////////////////////////////
        var ctx = settings.ctx; 
        if (settings.ctx == null)
        {
            ctx = makeCanvas("canvas" + settings.randomNumber, settings.bgCol, settings.height, settings.width, settings.position, settings.left, settings.top);
            $("#" + "canvas" + settings.randomNumber).hide();
            settings.ctx = ctx;
        }
        
        /////////////////////////////////
        //Pass values into graph object
        /////////////////////////////////        
        g.settings = settings;
        
        /////////////////////////////////
        //DRAW!
        /////////////////////////////////
        g.draw(now(),true);
        
        
        return g;
    
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



