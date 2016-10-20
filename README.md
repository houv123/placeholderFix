# placeholderFix

A simple input placeholder polyfill,with vanilla js.Tested in IE 8/9/10.

##How does it work?

This polyfill simply appends a &lt;span class="\_fake_placeholder\_"&gt; to every input element which has placeholder attribute,using focus and blur event to show or hide this fake placeholder.
<b>warning:you should normalize or reset the default styles so that the fake placeholder can appeared in right place.</b>
