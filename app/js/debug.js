var Debug = {};

Debug.enable = function() {
	this.debugison = true;
}

Debug.disable = function() {
	this.debugison = false;
}

Debug.isOn = function() {
	return this.debugison;
}

var edebug;

if (document.domain.indexOf("localhost") >= 0) {
	Debug.enable();
}

if (document.URL.indexOf("DEBUG") >= 0 || document.URL.indexOf("debug") >= 0) {
	Debug.enable();
}

if (document.URL.indexOf("NODEBUG") >= 0) {
	Debug.disable();
}

if (Debug.isOn()) {
	setTimeout(function() {
		Waazdoh.debug("");
	}, 1000)
}

function toggleDebug() {
	if (Debug.isOn()) {
		addToStorage("debugon", "");
		//
		Debug.disable();
		edebug = false;
		getDebug().clear();
		getDebug().hide();
	} else {
		addToStorage("debugon", "true");
		//
		Debug.enable();
		getDebug().show();
		Waazdoh.debug("debug!");
	}
}

function WaazdohC() {
	var errormsg = "TEST";
	
	this.error = function(s) {
		Waazdoh.debug("ERROR " + s);
		this.errormsg = s;
	};

	this.debug = function(s) {
		if (Debug.isOn()) {
			s = s.replace(/\</g, "[");
			s = s.replace(/\>/g, "]");
			writeDebug(s);

		}
	};
}

Waazdoh = new WaazdohC();

function writeDebug(str) {
	var date = new Date();
	getDebug().debug(
			"<pre>" + date + ":" + (date).getTime() + " :: " + str + "</pre>");
}

function Waazdohdebug(s) {
	Waazdoh.debug(s);
}

var g_divdebug;

function DivDebug() {
	g_divdebug = this;

	var debugdiv;
	var lines = [];
	var start = 0;
	var linecount = 3000;
	var updating = false;
	var sfilter = "error";
	var debugcontent;

	this.check = function() {
		if (!debugdiv) {
			debugdiv = $("#debug");
			if (debugdiv.length > 0) {
				if (Debug.isOn()) {
					var shtml = "<p id=\"resetdebug\">reset debug</p><p id=\"stopdebug\">stop</p>";
					shtml += "<p id=\"storageinfodebug\" onclick=\"getObjectStorage().info()\" >storage info</p>"
					shtml += "<p id=\"storagereset\" onclick=\"getObjectStorage().clear()\" >clear storage</p>"

					shtml += "<input id=\"debugfilter\" type=\"textfield\" />";
					shtml += "<p id=\"debuginfo\">info</p><div id=\"debugslider\" />";
					shtml += "<div id=\"debugcontent\" />";
					//
					debugdiv.html(shtml);
					$("#resetdebug").click(function() {
						g_divdebug.clear();
					});

					/*
					 * $("#debugslider").slider({ slide : function(event, ui) {
					 * //g_divdebug.slide(ui.value); } });
					 */

					$("#debugfilter").keypress(function() {
						g_divdebug.filter($("#debugfilter").val());
						g_divdebug.update();
					});

					$("#stopdebug").click(function() {
						if (Debug.isOn()) {
							Debug.disable();
						} else {
							Debug.enable();
						}
						$("#stopdebug").text(Debug.isOn() ? "stop" : "start");
					});
					//
					debugcontent = $("#debugcontent");
				} else {
					debugdiv.hide();
				}

				return true
			} else {
				debugdiv = null;
				return false;
			}
		} else {
			return true;
		}
	};

	this.filter = function(val) {
		sfilter = val;
		this.update();
	};

	this.slide = function(value) {
		start = value;
		this.update();
	};

	this.debug = function(s) {
		lines[lines.length] = s;
		this.update();
	};

	this.clear = function() {
		lines = [];
		this.update();
	};

	this.hide = function() {
		debugdiv.hide();
	};

	this.show = function() {
		debugdiv.show();
	};

	this.update = function() {
		if (!updating && this.check()) {
			updating = true;
			setTimeout(
					function() {
						var s = "";
						var i = 0;
						var icount = 0;
						while (i < lines.length) {
							var line = lines[i + start];
							if (line) {
								if ((sfilter.length === 0 || line
										.lastIndexOf(sfilter) >= 0)
										&& icount < linecount) {
									s += line;
									icount++;
								}
							} else {
								break;
							}
							i++;
						}

						var slidermax = (lines.length - linecount)
						if (slidermax < linecount) {
							slidermax = linecount;
						}

						debugcontent.html(s);

						$("#debuginfo").html(
								"start:" + start + " lines:" + icount + "/"
										+ lines.length + " filter[" + sfilter
										+ "]");

						updating = false;
					}, 100);
		} else {
			//
		}
	}
}

function JasmineDebug() {
	jasmine.log("creating JasmineDebug");

	this.debug = function(s) {
		jasmine.log(s);
	};
}

function getDebug() {
	if (!edebug) {
		edebug = new DivDebug();

		try {
			if (jstestdriver) {
				edebug = new ConsoleDebug();
			}
		} catch (e) {
			//
		}

		try {
			if (jasmine.log) {
				edebug = new JasmineDebug();
			}
		} catch (e) {
			//
		}
	}

	return edebug;
}

function exceptopn2str() {
	var vDebug = "";
	if (err !== null) {
		for ( var prop in err) {
			vDebug += "property: " + prop + " value: [" + err[prop] + "]\n";
		}
	}

	vDebug += "toString(): " + " value: [" + err.toString() + "]";
	return vDebug;
}

var odump = (function() {
	var max, INDENT = "                                   "; // As long as
	// you need :)

	function valueToStr(value, depth) {
		switch (typeof value) {
		case "object":
			return objectToStr(value, depth + 1);
		case "function":
			return "function";
		default:
			return value;
		}
	}

	function objectToStr(object, depth) {
		if (!Debug.isOn()) {
			return false
		}

		if (!object) {
			return false;
		}
		//
		if (depth > max)
			return false;

		var output = "";
		if (object !== null) {
			for ( var key in object) {
				try {
					var co = object[key];
					if (co) {
						var strvalue = valueToStr(co, depth)
						if (strvalue !== "function") {
							output += "\n" + INDENT.substr(0, 2 * depth) + key
									+ ": " + strvalue;
						}
					}
				} catch (e) {
					output += "\nException " + e + " with key " + key;
				}
			}
		}

		return output;
	}
	;

	return function odump(object, depth, _max) {
		max = _max || 2;
		return objectToStr(object, depth || 0);
	};
})();
