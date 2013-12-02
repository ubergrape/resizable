;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("resizable/index.js", function(exports, require, module){
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

});
require.alias("resizable/index.js", "resizable/index.js");if (typeof exports == "object") {
  module.exports = require("resizable");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("resizable"); });
} else {
  this["jh3y-resizable"] = require("resizable");
}})();