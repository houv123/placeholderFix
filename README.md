# placeholderFix

A simple input placeholder polyfill,with vanilla js.Tested in IE 8/9/10.

## How does it work?

This polyfill append a &lt;span class="\_fake_placeholder\_"&gt; to every input element which has _placeholder_ attribute as placeholder,using focus and blur event to show and hide this fake placeholder.
