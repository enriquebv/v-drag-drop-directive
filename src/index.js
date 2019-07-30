import dragDirective from "./directives/drag";
import draggableDirective from "./directives/draggable";
import droppableDirective from "./directives/droppable";

export default {
  install(Vue) {
    Vue.directive("drag", dragDirective);
    Vue.directive("draggable", draggableDirective);
    Vue.directive("droppable", droppableDirective);
  }
};
