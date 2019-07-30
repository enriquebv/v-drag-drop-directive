import dragDirective from "./src/directives/drag";
import draggableDirective from "./src/directives/draggable";
import droppableDirective from "./src/directives/droppable";

export default {
  install(Vue) {
    Vue.directive("drag", dragDirective);
    Vue.directive("draggable", draggableDirective);
    Vue.directive("droppable", droppableDirective);
  }
};
