# v-drag-drop-directive

Simple Vue plugin to add touch support to native HTML5 Drag And Drop API.

* It will use directives (`v-drag`, `v-drop`) to already existing elements to avoid ugly and excesive syntax.
* It will fire native Drag N' Drop events binded to elements (`@dragenter`, `@dragleave`, `@dragstart`...), same reason.
  * Events fired when using touch will be [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent).
* It will provide the ability to use a handle to drag.

## Getting started

Install package:
```
npm install vue-directive-dnd
```

Require the plugin:
```
import Vue from 'vue';
import VueDirectiveDnd from 'vue-directive-dnd';

Vue.use(VueDirectiveDnd)
```
