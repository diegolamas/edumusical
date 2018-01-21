/*! wavesurfer.js 1.4.0 (Mon, 10 Apr 2017 08:55:36 GMT)
 * https://github.com/katspaugh/wavesurfer.js
 * @license BSD-3-Clause */
! function(a, b) {
    "function" == typeof define && define.amd ? define(["wavesurfer"], function(a) {
        return b(a)
    }) : "object" == typeof exports ? module.exports = b(require("wavesurfer.js")) : b(WaveSurfer)
}(this, function(a) {
    "use strict";
    a.Regions = {
        init: function(a) {
            this.wavesurfer = a, this.wrapper = this.wavesurfer.drawer.wrapper, this.list = {}
        },
        add: function(b) {
            var c = Object.create(a.Region);
            return c.init(b, this.wavesurfer), this.list[c.id] = c, c.on("remove", function() {
                delete this.list[c.id]
            }.bind(this)), c
        },
        clear: function() {
            Object.keys(this.list).forEach(function(a) {
                this.list[a].remove()
            }, this)
        },
        enableDragSelection: function(a) {
            var b, c, d, e, f = this,
                g = a.slop || 2,
                h = 0,
                i = function(a) {
                    a.touches && a.touches.length > 1 || a.target.childElementCount > 0 || (e = a.targetTouches ? a.targetTouches[0].identifier : null, b = !0, c = f.wavesurfer.drawer.handleEvent(a, !0), d = null)
                };
            this.wrapper.addEventListener("mousedown", i), this.wrapper.addEventListener("touchstart", i), this.on("disable-drag-selection", function() {
                f.wrapper.removeEventListener("touchstart", i), f.wrapper.removeEventListener("mousedown", i)
            });
            var j = function(a) {
                a.touches && a.touches.length > 1 || (b = !1, h = 0, d && (d.fireEvent("update-end", a), f.wavesurfer.fireEvent("region-update-end", d, a)), d = null)
            };
            this.wrapper.addEventListener("mouseup", j), this.wrapper.addEventListener("touchend", j), this.on("disable-drag-selection", function() {
                f.wrapper.removeEventListener("touchend", j), f.wrapper.removeEventListener("mouseup", j)
            });
            var k = function(i) {
                if (b && !(++h <= g || i.touches && i.touches.length > 1 || i.targetTouches && i.targetTouches[0].identifier != e)) {
                    d || (d = f.add(a || {}));
                    var j = f.wavesurfer.getDuration(),
                        k = f.wavesurfer.drawer.handleEvent(i);
                    d.update({
                        start: Math.min(k * j, c * j),
                        end: Math.max(k * j, c * j)
                    })
                }
            };
            this.wrapper.addEventListener("mousemove", k), this.wrapper.addEventListener("touchmove", k), this.on("disable-drag-selection", function() {
                f.wrapper.removeEventListener("touchmove", k), f.wrapper.removeEventListener("mousemove", k)
            })
        },
        disableDragSelection: function() {
            this.fireEvent("disable-drag-selection")
        }
    }, a.util.extend(a.Regions, a.Observer), a.Region = {
        style: a.Drawer.style,
        init: function(b, c) {
            this.wavesurfer = c, this.wrapper = c.drawer.wrapper, this.id = null == b.id ? a.util.getId() : b.id, this.start = Number(b.start) || 0, this.end = null == b.end ? this.start + 4 / this.wrapper.scrollWidth * this.wavesurfer.getDuration() : Number(b.end), this.resize = void 0 === b.resize || Boolean(b.resize), this.drag = void 0 === b.drag || Boolean(b.drag), this.loop = Boolean(b.loop), this.color = b.color || "rgba(0, 0, 0, 0.1)", this.data = b.data || {}, this.attributes = b.attributes || {}, this.maxLength = b.maxLength, this.minLength = b.minLength, this.bindInOut(), this.render(), this.onZoom = this.updateRender.bind(this), this.wavesurfer.on("zoom", this.onZoom), this.wavesurfer.fireEvent("region-created", this)
        },
        update: function(a) {
            null != a.start && (this.start = Number(a.start)), null != a.end && (this.end = Number(a.end)), null != a.loop && (this.loop = Boolean(a.loop)), null != a.color && (this.color = a.color), null != a.data && (this.data = a.data), null != a.resize && (this.resize = Boolean(a.resize)), null != a.drag && (this.drag = Boolean(a.drag)), null != a.maxLength && (this.maxLength = Number(a.maxLength)), null != a.minLength && (this.minLength = Number(a.minLength)), null != a.attributes && (this.attributes = a.attributes), this.updateRender(), this.fireEvent("update"), this.wavesurfer.fireEvent("region-updated", this)
        },
        remove: function() {
            this.element && (this.wrapper.removeChild(this.element), this.element = null, this.wavesurfer.un("zoom", this.onZoom), this.fireEvent("remove"), this.wavesurfer.fireEvent("region-removed", this))
        },
        play: function() {
            this.wavesurfer.play(this.start, this.end), this.fireEvent("play"), this.wavesurfer.fireEvent("region-play", this)
        },
        playLoop: function() {
            this.play(), this.once("out", this.playLoop.bind(this))
        },
        render: function() {
            var a = document.createElement("region");
            a.className = "wavesurfer-region", a.title = this.formatTime(this.start, this.end), a.setAttribute("data-id", this.id);
            for (var b in this.attributes) a.setAttribute("data-region-" + b, this.attributes[b]);
            this.wrapper.scrollWidth;
            if (this.style(a, {
                }), this.resize) {
                var c = a.appendChild(document.createElement("handle")),
                    d = a.appendChild(document.createElement("handle"));
                c.className = "wavesurfer-handle wavesurfer-handle-start", d.className = "wavesurfer-handle wavesurfer-handle-end";
                // var e = {
                //     cursor: "col-resize",
                //     position: "absolute",
                //     left: "0px",
                //     top: "0px",
                //     width: "1%",
                //     maxWidth: "4px",
                //     height: "100%"
                // };
                // this.style(c, e), this.style(d, e), this.style(d, {
                //     left: "100%"
                // })
            }
            this.element = this.wrapper.appendChild(a), this.updateRender(), this.bindEvents(a)
        },
        formatTime: function(a, b) {
            return (a == b ? [a] : [a, b]).map(function(a) {
                return [Math.floor(a % 3600 / 60), ("00" + Math.floor(a % 60)).slice(-2)].join(":")
            }).join("-")
        },
        getWidth: function() {
            return this.wavesurfer.drawer.width / this.wavesurfer.params.pixelRatio
        },
        updateRender: function() {
            var a = this.wavesurfer.getDuration(),
                b = this.getWidth();
            if (this.start < 0 && (this.start = 0, this.end = this.end - this.start), this.end > a && (this.end = a, this.start = a - (this.end - this.start)), null != this.minLength && (this.end = Math.max(this.start + this.minLength, this.end)), null != this.maxLength && (this.end = Math.min(this.start + this.maxLength, this.end)), null != this.element) {
                var c = Math.round(this.start / a * b),
                    d = Math.round(this.end / a * b) - c;
                this.style(this.element, {
                    left: c - 3 + "px",
                    width: "3px", //d + "px",
                    backgroundColor: this.color,
                    cursor: this.drag ? "move" : "default"
                });
                for (var e in this.attributes) this.element.setAttribute("data-region-" + e, this.attributes[e]);
                this.element.title = this.formatTime(this.start, this.end)
            }
        },
        bindInOut: function() {
            var a = this;
            a.firedIn = !1, a.firedOut = !1;
            var b = function(b) {
                !a.firedOut && a.firedIn && (a.start >= Math.round(100 * b) / 100 || a.end <= Math.round(100 * b) / 100) && (a.firedOut = !0, a.firedIn = !1, a.fireEvent("out"), a.wavesurfer.fireEvent("region-out", a)), !a.firedIn && a.start <= b && a.end > b && (a.firedIn = !0, a.firedOut = !1, a.fireEvent("in"), a.wavesurfer.fireEvent("region-in", a))
            };
            this.wavesurfer.backend.on("audioprocess", b), this.on("remove", function() {
                a.wavesurfer.backend.un("audioprocess", b)
            }), this.on("out", function() {
                a.loop && a.wavesurfer.play(a.start)
            })
        },
        bindEvents: function() {
            var a = this;
            this.element.addEventListener("mouseenter", function(b) {
                a.fireEvent("mouseenter", b), a.wavesurfer.fireEvent("region-mouseenter", a, b)
            }), this.element.addEventListener("mouseleave", function(b) {
                a.fireEvent("mouseleave", b), a.wavesurfer.fireEvent("region-mouseleave", a, b)
            }), this.element.addEventListener("click", function(b) {
                b.preventDefault(), a.fireEvent("click", b), a.wavesurfer.fireEvent("region-click", a, b)
            }), this.element.addEventListener("dblclick", function(b) {
                b.stopPropagation(), b.preventDefault(), a.fireEvent("dblclick", b), a.wavesurfer.fireEvent("region-dblclick", a, b)
            }), (this.drag || this.resize) && function() {
                var b, c, d, e, f = a.wavesurfer.getDuration(),
                    g = function(g) {
                        g.touches && g.touches.length > 1 || (e = g.targetTouches ? g.targetTouches[0].identifier : null, g.stopPropagation(), d = a.wavesurfer.drawer.handleEvent(g, !0) * f, "handle" == g.target.tagName.toLowerCase() ? c = g.target.classList.contains("wavesurfer-handle-start") ? "start" : "end" : (b = !0, c = !1))
                    },
                    h = function(d) {
                        d.touches && d.touches.length > 1 || (b || c) && (b = !1, c = !1, a.fireEvent("update-end", d), a.wavesurfer.fireEvent("region-update-end", a, d))
                    },
                    i = function(g) {
                        if (!(g.touches && g.touches.length > 1) && (!g.targetTouches || g.targetTouches[0].identifier == e) && (b || c)) {
                            var h = a.wavesurfer.drawer.handleEvent(g) * f,
                                i = h - d;
                            d = h, a.drag && b && a.onDrag(i), a.resize && c && a.onResize(i, c)
                        }
                    };
                a.element.addEventListener("mousedown", g), a.element.addEventListener("touchstart", g), a.wrapper.addEventListener("mousemove", i), a.wrapper.addEventListener("touchmove", i), document.body.addEventListener("mouseup", h), document.body.addEventListener("touchend", h), a.on("remove", function() {
                    document.body.removeEventListener("mouseup", h), document.body.removeEventListener("touchend", h), a.wrapper.removeEventListener("mousemove", i), a.wrapper.removeEventListener("touchmove", i)
                }), a.wavesurfer.on("destroy", function() {
                    document.body.removeEventListener("mouseup", h), document.body.removeEventListener("touchend", h)
                })
            }()
        },
        onDrag: function(a) {
            var b = this.wavesurfer.getDuration();
            this.end + a > b || this.start + a < 0 || this.update({
                start: this.start + a,
                end: this.end + a
            })
        },
        onResize: function(a, b) {
            "start" == b ? this.update({
                start: Math.min(this.start + a, this.end),
                end: Math.max(this.start + a, this.end)
            }) : this.update({
                start: Math.min(this.end + a, this.start),
                end: Math.max(this.end + a, this.start)
            })
        }
    }, a.util.extend(a.Region, a.Observer), a.initRegions = function() {
        this.regions || (this.regions = Object.create(a.Regions), this.regions.init(this))
    }, a.addRegion = function(a) {
        return this.initRegions(), this.regions.add(a)
    }, a.clearRegions = function() {
        this.regions && this.regions.clear()
    }, a.enableDragSelection = function(a) {
        this.initRegions(), this.regions.enableDragSelection(a)
    }, a.disableDragSelection = function() {
        this.regions.disableDragSelection()
    }, a.getRegions = function(nombre) {
        var regiones = [];
        Object.values(this.regions.list).forEach(function(element) {
            var reg = {};
            reg.color = element.color;
            reg.start = element.start;
            regiones.push(reg);
        });
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(regiones)], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = nombre + ".txt";
        a.click();
    }, a.removeRegion = function(region_id) {

        Object.values(this.regions.list).forEach(function(element) {
            if (element.id == region_id) element.remove();
        });
    }





});
