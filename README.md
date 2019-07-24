# vue-directive-dnd

Simple Vue plugin to add touch support to native HTML5 Drag And Drop API.

* It will use directives (`v-drag`, `v-drop`) to already existing elements to **avoid ugly and excesive syntax/components**.
* Using touch, it will fire native Drag N' Drop events (`@dragenter`, `@dragleave`, `@dragstart`...), same reason.
  * Events passed to handler when using touch will be the original [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent).
  * If it's needed, you can define different event handlers when toch it's used (`@dragstart:touch`, etc). 
* It will provide the ability to use a handle to drag.

## Things to do
* [x] Native Drag And Drop support.
* [x] Touch Drag and Drop simulation.
* [ ] Handles support.

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

## Usage
It will use Vue directives to specify wich elements you want to drag, and wich are available drop zones. By default, all elements who have any drag interacition, will need `v-drag` directive.

### Make an element draggable
Using `v-draggable`.
```html
<div class="drag"
 v-drag
 v-draggable
>
 <!-- Content -->
</div>
```

You can provide options to the directive:

**Boolean**: Represents if the element can be draggable.
```html
<template>
  <div class="drag"
    v-drag
    v-draggable="allowDrag"
  >
    <!-- Content -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // You can change that variable, and draggable behaviour
      // of the element will be disabled.
      allowDrag: true
    };
  }
};
</script>
```

**Object**:

Options|Type|Default|Description
-|-|-|-
enabled|`Boolean`|true|Represents if the element can be draggable.
touchPressTime|`Number`|1000|Time in miliseconds, to allow the drag of an element, only with touch interaction.
hideDefaultGhost|`Boolean`|false|To hide the default ghost provided by navigator.

```html
<template>
  <div
    class="drag"
    v-drag
    v-draggable="{
      enabled: allowDrag,
      touchPressTime: 1000,
      hideDefaultGhost: hideGhost
     }"
  >
    <!-- Content -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      allowDrag: true,
      hideGhost: true
    };
  }
};
</script>
```

### Make an element droppable
Using `v-droppable`.

```html
<div
  v-drag
  v-droppable
  class="dropable"
></div>
```
You can toggle it providing a boolean as an option:

```html
<template>
  <div class="drop"
    v-drag
    v-droppable="allowDrop"
  >
    <!-- Content -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // You can change that variable dynamically
      // and drop behaviour will change.
      allowDrop: true
    };
  }
};
</script>
```
