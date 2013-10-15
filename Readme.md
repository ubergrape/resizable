# resizable

  Make an element resizable with configurable behaviours. Compatible with [component](https://github.com/component/component) package manager.

## Demo

 A simple demo of making a resizable div can be seen [here](http://jsfiddle.net/u9L2T/).

## API

It's really simple. Basically just create a new resizable by passing in the element that you want to be resizable as a parameter.

Example:

	var resizable = require('resizable');
	var element = document.querySelector('.myResizable');
	var myResizable = new resizable(element);
	
	
There are also options you can pass in to configure the resizables behaviour. These are as follows:

	directions: NodeList/array of elements - Define elements that a draggable will snap into.
	ghosting: true/false [default: false] - Define whether resizable has ghosting effect to aid with resize (see [demo](http://jsfiddle.net/u9L2T/)).
	
An example of passing in options for pens: 

	var myTopBottomResizable = new resizable(element, {
		directions: ['north', 'south'],
		ghosting: true
	});

There are also some methods you can use on your draggable:

	setDirections(string array): set directions that resizable can be resized.
	setGhosting(bool): set whether a resizable has the ghosting effect.

Example:

	var myResizable = new resizable(element);
	myResizable.setDirections(['north', 'south', 'southwest']);
	
Examples of all these behaviours can be seen in the [demo](http://jsfiddle.net/u9L2T/) or in the [example](https://github.com/jheytompkins/resizable/blob/master/example.html) page.

## Use without component package manager

 If you want to use resizable without the [component](https://github.com/component/component) package manager you can by simply adding [jheytompkins_resizable.js](https://github.com/jheytompkins/resizable/blob/master/jheytompkins-resizable.js) to your script files and using in the following way:

	 		var resizable = new jheytompkins_resizable(element, {
	 			ghosting: false,
	 			directions: ['north', 'south', 'west', 'east']
	 		});


## Installation

  Install with [component(1)](http://component.io):

    $ component install jheytompkins/resizable

## License

  MIT
