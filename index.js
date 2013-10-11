module.exports = resizable;

function resizable(element, options) {
	if (!(this instanceof resizable)) return new resizable(element, options);
	this.defaults = {
		handles: ['north', 'south', 'west', 'east', 'southeast', 'southwest', 'northeast', 'northwest']
	};
	this.element = element;
	var extend = function (a, b) {
		for(var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}
	this.options = extend(this.defaults, options);
	this.startX;
	this.startY;
	this.startW;
	this.startH;
	this._create();
	}
resizable.prototype._create = function () {
	//basically adding the handles in which makes sense.
	var resizable = this;
	resizable.element.className = resizable.element.className + ' resizable';
	[].forEach.call(resizable.options.handles, function (handle) {
		//create a div and append it to my resizable.
		var handleEl = document.createElement('div');
		handleEl.className = handleEl.className + ' resize-handle resize-handle-' + handle;
		handleEl.setAttribute('data-resize-direction', handle);
		var resizeMove = function (e) {
			switch (handle) {
				case 'north':
					resizable.element.style.top = e.pageY + "px";
					resizable.element.style.height = (resizable.startH + (resizable.startY - e.pageY)) + "px";
					break;
				case 'south':
					resizable.element.style.height = (resizable.startH + (e.pageY - resizable.startY)) + "px";
					break;
				case 'east':
					resizable.element.style.width = (resizable.startW + (e.pageX - resizable.startX)) + "px";
					break;	
				case 'west':
					resizable.element.style.left = e.pageX + "px";
					resizable.element.style.width = (resizable.startW + (resizable.startX - e.pageX)) + "px";
					break;
				case 'northeast':
					resizable.element.style.top = e.pageY + "px";
					resizable.element.style.height = (resizable.startH + (resizable.startY - e.pageY)) + "px";
					resizable.element.style.width = (resizable.startW + (e.pageX - resizable.startX)) + "px";
					break;
				case 'northwest':
					resizable.element.style.top = e.pageY + "px";
					resizable.element.style.height = (resizable.startH + (resizable.startY - e.pageY)) + "px";
					resizable.element.style.left = e.pageX + "px";
					resizable.element.style.width = (resizable.startW + (resizable.startX - e.pageX)) + "px";
					break;
				case 'southeast':
					resizable.element.style.height = (resizable.startH + (e.pageY - resizable.startY)) + "px";
					resizable.element.style.width = (resizable.startW + (e.pageX - resizable.startX)) + "px";
					break;
				case 'southwest':
					resizable.element.style.height = (resizable.startH + (e.pageY - resizable.startY)) + "px";
					resizable.element.style.left = e.pageX + "px";
					resizable.element.style.width = (resizable.startW + (resizable.startX - e.pageX)) + "px";
					break;
			}
		};
		var mouseUp = function (event) {
			window.removeEventListener("mousemove", resizeMove, true);
		}
		var mouseDown = function (event) {
			event.stopPropagation();
			resizable.startX = event.pageX;
			resizable.startY = event.pageY;
			resizable.style = window.getComputedStyle(resizable.element);
			resizable.startW = parseInt(resizable.style.width, 10);
			resizable.startH = parseInt(resizable.style.height, 10);	
			window.addEventListener("mousemove", resizeMove, true);
			window.addEventListener("mouseup", mouseUp, true);	
		}
		resizable.element.appendChild(handleEl);
		handleEl.addEventListener("mousedown", mouseDown, false);
	});
}
