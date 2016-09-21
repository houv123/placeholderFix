;(function fixHolder(win,doc,undefined){
    var isSupport = 'placeholder' in doc.createElement('input');

    if(isSupport){
        return ;
    }
    function byAttr(el,attr) {
        if(!el){
            return ;
        }
        var ret = [];
        el = el.length ? el : [el];

        for(var i=0;i<el.length;i++){

            if(el[i].getAttribute && el[i].getAttribute(attr) !== null){
                ret.push(el[i]);
            }
        }

        return ret;
    }
    function isObj(obj) {

        return String.prototype.slice.call(obj) === '[object Object]';
    }
    function pageX(el){

        return el.offsetParent ? el.offsetLeft + pageX(el.offsetParent) : el.offsetLeft;
    }
    function pageY(el){

        return el.offsetParent ? el.offsetTop + pageX(el.offsetParent) : el.offsetTop;
    }
    function parentX(el){

        return el.offsetParent === el.parentNode ? el.offsetLeft : pageX(el) - pageX(el.parentNode);
    }
    function parentY(el){

        return el.offsetParent === el.parentNode ? el.offsetTop : pageY(el) - pageY(el.parentNode);
    }
    function getStyle(el,style){

        if(!style){

            return null;
        }

        if(el.currentStyle){

            return el.currentStyle[style];
        }

        if(win.getComputedStyle){
            style = style.replace(/([A-Z])/,'-$1').toLocaleLowerCase();

            return win.getComputedStyle(el,'')[style];
        }

        return null;
    }
    function trim(val){
        val && val.replace(/^(\s+)|(\s+)$/,'');

        return val;
    }
    function createNode(name,prop){
        var node = doc.createElement(name);

        if(!prop){

            return node;
        }

        if(!isObj(prop)){

            throw new Error('argument should be a Object');
        }

        for(var i in prop){

            if(prop.hasOwnProperty(i)){

                if(isObj(prop[i])){
                    for(var j in prop[i]){
                        if(prop[i].hasOwnProperty(j)){
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
    function addEvent(el,evt,cb){

        if(el.addEventListener){
            el.addEventListener(evt,cb,false);

        }else{
            el.attachEvent('on'+evt,function(e){
                e = e || win.event;
                e.target = e.srcElement;
                e.stopPropagation = function(){
                    e.cancelBubble = true;
                };
                e.preventDefault = function(){
                    e.returnValue = false;
                };
                cb.call(el,e);
            });
        }
    }


    function fix(els){
        if(/Array/.test(Object.prototype.toString.call(els)) && !els.length){
            return ;
        }
        els = els.length ? els : [els];

        for(var i=0;i<els.length;i++){
            var parent = els[i].parentNode || doc.body;
            var pos = getStyle(parent,'position');
            var top = parseInt(getStyle(els[i],'paddingTop'),10) + parentY(els[i]);
            var left = parseInt(getStyle(els[i],'paddingLeft'),10) + parentX(els[i]);
            var t =  els[i].getAttribute('placeholder');

            if(pos.toLowerCase() === 'static'){
                parent.style.position = 'relative';
            }

            var node = createNode('span',{
                style:{
                    position:'absolute',
                    left:left + 'px',
                    top:top + 'px',
                    whiteSpace:'nowrap',
                    lineHeight:getStyle(els[i],'lineHeight')
                },
                className:'_fake_placeholder_',
                innerHTML:t
            });

            els[i].fakeHolder = node;
            node.el = els[i];
            parent.appendChild(node);

            addEvent(els[i].fakeHolder,'click',function(e){
                this.el.focus();
            });
            addEvent(els[i],'focus',function(e){
                this.fakeHolder.style.display = 'none';
            });
            addEvent(els[i],'blur',function(e){
                var val = trim(this.value);

                if(val === ''){
                    this.fakeHolder.style.display = 'block';
                }
            })
        }
    }

    var els = doc.getElementsByTagName('input');
    els = byAttr(els,'placeholder');

    fix(els);

})(window,document);