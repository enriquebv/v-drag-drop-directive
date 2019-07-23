# vue-directive-dnd

Simple Vue plugin to add touch support to native HTML5 Drag And Drop API.

* It will use directives (`v-drag`, `v-drop`) to already existing elements to **avoid ugly and excesive syntax/components**.
* Using touch, it will fire native Drag N' Drop events (`@dragenter`, `@dragleave`, `@dragstart`...), same reason.
  * Events passed to handler when using touch will be [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent).
  * If it's needed, you can define different event handlers when toch it's used (`@dragstart:touch`, etc). 
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
