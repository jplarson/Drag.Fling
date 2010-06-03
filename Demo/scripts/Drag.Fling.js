/*
---
description: Add page navigation by click-drag-fling mouse gestures similar to iPod interfaces.

license: MIT-style

authors:
- John Larson

requires:
- core:1.2.4/Events
- core:1.2.4/Options
- core:1.2.4/Element.Event
- core:1.2.4/Element.Style
- core:1.2.4/Element.Dimensions
- more:1.2.4/Drag

provides: [Drag.Fling]

...
*/


Drag.Fling = new Class({

	Extends: Drag,

	options: {
		flingAxis:			'x',
		fps:				50,
		maxVelocity:		20,
		slideVelocity:		10,
		minFlingVelocity:	0,
		slideFriction:		.01,
		onFlingDone:		$empty
	},

	initialize: function(viewPort, options){
		
		this.viewPort	= $(viewPort);
		this.items		= this.viewPort.getChildren();
		
		this.element = new Element('div', { styles: { position: 'absolute', left: 0, top: 0 }});
		this.element.adopt(this.items);
		this.viewPort.adopt(this.element);
		
		this.parent(this.element, options);
		
		if (this.viewPort.getStyle('position') == 'static')
			this.viewPort.setStyle('position', 'relative');
		
		var element = this.element;
		
		this.flingAxis = this.options.flingAxis;
		if(this.flingAxis == 'x') {
			this.modifier = 'left';
			this.axisDimension = 'width';
			this.options.modifiers = {x: 'left'};
		}
		else {
			this.flingAxis = 'y';
			this.modifier = 'top';
			this.axisDimension = 'height';
			this.options.modifiers = {y: 'top'};
		}
		
		// Perform measurements along the axis of interest:
		this.stopPointSet = [0];
		var axisSize = 0;
		this.items.each(function(item) {
			var thisSize = this.itemAxisSize(item);
			this.stopPointSet.push(this.stopPointSet[this.stopPointSet.length-1] - thisSize);
			axisSize += thisSize;
		}, this);
		
		element.setStyle(this.axisDimension, axisSize);
			
		this.velocity = 0; // pixels per frame
		this.spaceTimeMap = [[0, 0], [0, 0]];  // last drag step, the drag step before
		
		// to do: test/tweak this to capture ipod touch events in lieu of click events:
	//	if(Browser.Platform == 'ipod) {
	//		element.addEvent('touchstart', this.start.bind(this));
	//		element.addEvent('touchmove', this.drag.bind(this));
	//		element.addEvent('touchend', this.stop.bind(this));
	//	}
	},
	
	itemAxisSize: function(item) {
		var i = this.flingAxis == 'x' ? 1 : 0;
		var margin = item.getStyle('margin').split(' ');
		return item.getSize()[this.flingAxis] + margin[i].toInt() + margin[2+i].toInt();
	},
	
	start: function(event){
		this.calculateLimit();
		this.stopFling();
		this.parent(event);
	},
	
	calculateLimit: function(){
		var elementAxisSize  = this.element.getSize()[this.flingAxis];
		var viewPortAxisSize = this.viewPort.getSize()[this.flingAxis];
		var viewPortBorder = this.viewPort.getStyle('border').split(' ');
		
		var high = viewPortBorder[(this.flingAxis == 'x' ? 3 : 0)].toInt();
		var low  = viewPortAxisSize - elementAxisSize;
		
		this.axisLimit = [low, high];
		this.options.limit = { x: [0, 0], y: [0, 0] };
		this.options.limit[this.flingAxis] = [low, high];
		return this.axisLimit;
	},

	drag: function(event){
		this.parent(event);
		this.mouse.now = event.page;
		this.trackSpaceTimeMovement();
	},
	
	trackSpaceTimeMovement: function() {
		// make a record of time and space, avoid if no change along the flingAxis:
		if(this.mouse.now[this.options.flingAxis] != this.spaceTimeMap[0][0]) {
			this.spaceTimeMap[1] = this.spaceTimeMap[0];
			this.spaceTimeMap[0] = [this.mouse.now[this.options.flingAxis], $time()];
		}
	},

	stop: function(event){
		var deltaPixels = this.spaceTimeMap[1][0] - this.spaceTimeMap[0][0];
		var deltaTime = this.spaceTimeMap[1][1] - this.spaceTimeMap[0][1];
		
		this.velocity = Math.min(this.options.maxVelocity, deltaPixels*(1000 / this.options.fps) / deltaTime);
		this.startFling();
		return this.parent(event);
	},

	startFling: function(velocity){
		if (this.timer) return false;
		if(velocity) {
			this.velocity = velocity;
			
			// nudge us over 1 pixel to get started (to avoid a premature crossing point stop):
			var p0 = this.element.getStyle(this.modifier).toInt();
			var p1 = p0 + this.velocity / Math.abs(this.velocity);
			var pL = p1.limit(this.axisLimit[0], this.axisLimit[1]);
			this.element.setStyle(this.modifier, pL);
		}
		this.timer = this.stepFling.periodical(Math.round(1000 / this.options.fps), this);
		return true;
	},
	
	stepFling: function() {
		if(Math.abs(this.velocity) < this.options.minFlingVelocity) {
			this.stopFling();
			return;
		}
		
		var p0 = this.element.getStyle(this.modifier).toInt();
		var p1 = p0 + this.velocity;
		
		var crossedPointValue = this.crossesStopPoint(p0, p1);
		if(crossedPointValue) {
			p1 = crossedPointValue;
			this.velocity = 0;
		}
		var pL = p1.limit(this.axisLimit[0], this.axisLimit[1]);
		this.element.setStyle(this.modifier, pL);
		if(pL != p1  ||  this.velocity == 0) { // reached a page edge:
			this.fireEvent('flingDone');
			this.stopFling();
			return;
		}
		
		if(this.velocity > 0)
			this.velocity = Math.max(this.options.slideVelocity, this.velocity * (1-this.options.slideFriction));
		else // < 0
			this.velocity = Math.min(-this.options.slideVelocity, this.velocity * (1-this.options.slideFriction));
	},
	
	stopFling: function(){
		if (!this.timer) return false;
		this.timer = $clear(this.timer);
		this.velocity = 0;
		return true;
	},
	
	crossesStopPoint: function(p0, p1) {
		var pL = Math.min(p0, p1);
		var pH = Math.max(p0, p1);
		for(var i=1; i < this.stopPointSet.length; i++) {
			if(pL <= this.stopPointSet[i]  &&  pH >= this.stopPointSet[i])
				return this.stopPointSet[i];
		}
		return 0; // no crossing a stop point between p0 and p1
	}
});