; (function fixPlaceholder(win, doc, undefined) {
    var support = 'placeholder' in doc.createElement('input');

    if (support) {
        return;
    }
    function byAttr(el, attr) {
        if (!el) {
            return;
        }
        var ret = [];
        el = el.length ? el : [el];

        for (var i = 0; i < el.length; i++) {

            if (el[i].getAttribute && el[i].getAttribute(attr) !== null) {
                ret.push(el[i]);
            }
        }

        return ret;
    }
    function isObj(obj) {

        return String.prototype.slice.call(obj) === '[object Object]';
    }
    function pageX(el) {
        return el.offsetParent ? el.offsetLeft + pageX(el.offsetParent) : el.offsetLeft;
    }
    function pageY(el) {
        return el.offsetParent ? el.offsetTop + pageY(el.offsetParent) : el.offsetTop;
    }

    function getStyle(el, style) {

        if (!style) {

            return null;
        }

        if (el.currentStyle) {

            return el.currentStyle[style];
        }

        if (win.getComputedStyle) {
            style = style.replace(/([A-Z])/, '-$1').toLocaleLowerCase();

            return win.getComputedStyle(el, '')[style];
        }

        return null;
    }
    function trim(val) {
        val && val.replace(/^(\s+)|(\s+)$/, '');

        return val;
    }

    function bind(fn, self) {
        return function () {
            var args = [].slice(arguments);
            fn.call(self, args);
        }
    }

    function createNode(name, prop) {
        var node = doc.createElement(name);

        if (!prop) {

            return node;
        }

        if (!isObj(prop)) {

            throw new Error('argument should be a Object');
        }

        for (var i in prop) {

            if (prop.hasOwnProperty(i)) {

                if (isObj(prop[i])) {
                    for (var j in prop[i]) {
                        if (prop[i].hasOwnProperty(j)) {
                            node.style[j] = prop[i][j];
                        }
                    }

                    continue;
                }
                node[i] = prop[i]
            }
        }

        return node;
    }

    function addEvent(el, evt, hanlder) {

        if (el.addEventListener) {
            el.addEventListener(evt, hanlder, false);

        } else {
            el.attachEvent('on' + evt, function (e) {
                e = e || win.event;
                e.target = e.srcElement;
                e.stopPropagation = function () {
                    e.cancelBubble = true;
                };
                e.preventDefault = function () {
                    e.returnValue = false;
                };
                hanlder.call(el, e);
            });
        }
    }

    function removeEvent(el, evt, hanlder) {
        if (el.addEventListener) {
            el.removeEventListener(evt, hanlder, false);

        } else {
            el.detachEvent('on' + evt, hanlder);
        }
    }


    function fix(els) {
        if (/Array/.test(Object.prototype.toString.call(els)) && !els.length) {
            return;
        }
        els = els.length ? els : [els];

        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            var parent = el.parentNode;
            var parentPos = getStyle(el, 'position');
            var top = pageY(el) - pageY(parent);
            var left = parseInt(getStyle(el, 'paddingLeft'), 10) + pageX(el) - pageX(parent);
            var text = el.getAttribute('placeholder');

            var placeholder = createNode('span', {
                style: {
                    position: 'absolute',
                    left: left + 'px',
                    top: top + 'px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    height: el.offsetHeight + 'px',
                    lineHeight: el.offsetHeight + 'px'
                },
                className: '_fake_placeholder_',
                innerHTML: text
            });

            if (parentPos === 'static') {
                parent.style.position = 'relative';
            }

            el.placeholder = placeholder;
            placeholder.el = el;
            parent.appendChild(placeholder);
            el.value !== '' && (placeholder.style.display = 'none');

            var onPlaceholderClick = bind(function (e) {
                this.el.focus();
            }, placeholder);

            var onELeFocus = bind(function () {
                this.placeholder.style.display = 'none';
            }, el)

            var onEleBlur = bind(function () {
                var val = trim(this.value);
                if (val === '') {
                    this.placeholder.style.display = 'block';
                }
            }, el);

            addEvent(el.placeholder, 'click', onPlaceholderClick);
            addEvent(el, 'focus', onELeFocus);
            addEvent(el, 'blur', onEleBlur);

            el.$disdroyPlaceHolder = function () {
                removeEvent(this.placeholder, 'click', onPlaceholderClick);
                removeEvent(this, 'focus', onELeFocus);
                removeEvent(this, 'blur', onEleBlur);
                parent.removeChild(this.placeholder);
                this.placeholder = null;
            }
        }
    }

    var els = doc.getElementsByTagName('input');
    els = byAttr(els, 'placeholder');
    fix(els);

})(window, document)