module.exports = resizable;

function resizable(element, options) {
	if (!(this instanceof resizable)) return new resizable(element, options);
	this._defaults = {
		directions: ['north', 'south', 'west', 'east', 'southeast', 'southwest', 'northeast', 'northwest']
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
	this._options = extend(this._defaults, options);
	this._directions = this._options.directions;
	this._ghosting = (this._options.ghosting !== undefined) ? this._options.ghosting : false; 
	this._create();
}
resizable.prototype.setGhosting = function (ghosting) {
	if (ghosting !== undefined) {
		this._ghosting = ghosting;
	}
}
resizable.prototype.setDirections = function (directions) {
	var resizable = this,
		currentDirections = resizable._directions;
	if (directions === undefined) {
		directions = resizable._options.directions;
	}
	resizable._directions = directions;
	[].forEach.call(currentDirections, function (direction) {
		if (directions.indexOf(direction) === -1) {
			resizable.element.querySelector('.rsize-d-' + direction).style.display = 'none';
		}
	});
	[].forEach.call(resizable._directions, function (direction) {	
		if (resizable.element.querySelector('.rsize-d-' + direction) !== undefined) {
			resizable.element.querySelector('.rsize-d-' + direction).style.display = 'block';
		} else {
			resizable._createHandle(direction);
		}
	});
}
resizable.prototype._createHandle = function (direction) {
	var resizable = this,
		rh = document.createElement('div'),
		ghost,
		resize = function (e) {
			if (direction.indexOf('north') !== -1) {
				resizable.element.style.top = e.pageY + "px";
				resizable.element.style.height = (resizable._startH + (resizable._startY - e.pageY)) + "px";
			}
			if (direction.indexOf('south') !== -1) {
				resizable.element.style.height = (resizable._startH + (e.pageY - resizable._startY)) + "px";
			}
			if (direction.indexOf('east') !== -1) {
				resizable.element.style.width = (resizable._startW + (e.pageX - resizable._startX)) + "px";
			}
			if (direction.indexOf('west') !== -1) {
				resizable.element.style.left = e.pageX + "px";
				resizable.element.style.width = (resizable._startW + (resizable._startX - e.pageX)) + "px";
			}
		},
		stop = function () {
			if (resizable._ghosting) {
				[].forEach.call(resizable.element.parentNode.querySelectorAll('.ghost'), function (ghost) {
					ghost.remove();
				});
			}
			window.removeEventListener("mousemove", resize, true);
		},
		start = function (e) {
			e.stopPropagation();
			resizable._startX = e.pageX;
			resizable._startY = e.pageY;
			resizable._startW = resizable.element.offsetWidth;
			resizable._startH = resizable.element.offsetHeight;	
			window.addEventListener("mousemove", resize, true);
			window.addEventListener("mouseup", stop, true);
			if (resizable._ghosting) {
				ghost = document.createElement('div');
				resizable.element.parentNode.appendChild(ghost);
				ghost.className = 'ghost';
				ghost.style.border = '1px dashed #000';
				ghost.style.background = 'transparent';
				ghost.style.position = 'absolute';
				ghost.style.width = resizable.element.offsetWidth - 2 + 'px';
				ghost.style.height = resizable.element.offsetHeight - 2 + 'px';
				ghost.style.left = resizable.element.offsetLeft + 'px';
				ghost.style.top = resizable.element.offsetTop + 'px';
			}
		};
	rh.className = rh.className + ' rsize-d rsize-d-' + direction;
	rh.setAttribute('data-rsize-d', direction);
	resizable.element.appendChild(rh);
	rh.addEventListener("mousedown", start, false);
}
resizable.prototype._create = function () {
	var resizable = this;
	resizable.element.className = resizable.element.className + ' rsizable';
	[].forEach.call(resizable._directions, function (direction) {
		resizable._createHandle(direction);
	});
}
