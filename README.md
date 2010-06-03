Drag.Fling
===========

Drag.Fling allows page/item navigation by click-drag-fling mouse gestures similar to iPod interfaces.  Imagine a collection of same-sized panels lined up in a row, and which are embedded in a view port that allows only one panel to be visible at a time.  Drag.Fling allows mouse (or touch) gestures to drag & fling between panels.


How to Use
----------

Drag.Fling takes some careful setup of HTML elements and CSS, but no more than you would expect for the intended usage.  Consider the following HTML:

  <div id="viewPort">
    <div class="panel"></div>
    <div class="panel"></div>
    <div class="panel"></div>
  </div>

In our CSS we would (presumably) want to set the div.panel elements to have the same size as the #viewPort, and also we will most likely want #viewPort to have overflow: hidden.  Also, if panels are to be lined up horizontally, we must be sure that they are (this is done most easily by a float: left).  So we have, for example:

#viewPort {
	height:		400px;
	width:		300px;
	overflow:		hidden;
}

div.panel {
	height:		400px;
	width:		300px;
	float:		left;
}

Our JavaScript to invoke drag fling action is now a simple matter:

	#JS
	new Drag.Fling(viewPort, { flingAxis: 'x'});

Drag.Fling Options
------------------

There are a few key options of Drag.Fling.  Four of them relate to the physics of sliding, and all have the units pixels per frame: .
 * maxVelocity, slideVelocity, minFlingVelocity, and slideFriction relate to the physics of sliding, and all have the units pixels per frame.
 * flingAxis determines the axis of movement for the panels.  It defaults to 'x', and 'y' may be supplied for vertical movement.
 * onFlingDone is an event handler for when a fling is completed (i.e. when the fling ends due to reaching the threshhold of the next panel).

Screenshots
-----------

![Screenshot](http://www.jpl-consulting.com/projects/MooTools/Drag.Fling/ScreenShots/DragFling1.gif)
![Screenshot](http://www.jpl-consulting.com/projects/MooTools/Drag.Fling/ScreenShots/DragFling2.gif)
![Screenshot](http://www.jpl-consulting.com/projects/MooTools/Drag.Fling/ScreenShots/DragFling3.gif)

Notes
-----

Ironically enough, this drag-fling gesture modelled after iPod interfaces doesn't work on actual iPod devices.  There is to handle 'touchstart', 'touchmove', and 'touchend' events which are fired in lieu of the usual 'mousedown', 'mousemove', and 'mouseup' events.  Next time I have some time to play with an iPad I'll get this integrated.