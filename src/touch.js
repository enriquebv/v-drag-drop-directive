import html2canvas from "html2canvas";
import { isFunction, copyBorderRadius } from "./utils";

export default class TouchDragEvent {
  constructor(options) {
    const { element } = options;
    this.element = element;
    this.offsets = {
      x: 0,
      y: 0
    };
    this.touchPressTime = 1000;
    this.timeout = {};
    this.ghost = {};
    this.overs = [];
    this.enabled = true;
    this.dragging = false;
    this.ghostEnabled = true;
    this.storedEvents = {
      touchStartEvent: {},
      touchMoveEvent: {},
      touchEndEvent: {},
      contextMenuEvent: {}
    };

    this.createEvents();

    return this;
  }

  createEvents() {
    const {
      element,
      touchStartEvent,
      touchMoveEvent,
      touchEndEvent,
      contextMenuEvent,
      storedEvents
    } = this;
    const options = {
      passive: false
    };

    storedEvents.touchStartEvent = touchStartEvent.bind(this, element);
    storedEvents.touchMoveEvent = touchMoveEvent.bind(this);
    storedEvents.touchEndEvent = touchEndEvent.bind(this);
    storedEvents.contextMenuEvent = contextMenuEvent.bind(this);

    element.addEventListener(
      "touchstart",
      storedEvents.touchStartEvent,
      options
    );
    element.addEventListener("touchmove", storedEvents.touchMoveEvent, options);
    element.addEventListener("touchend", storedEvents.touchEndEvent, options);
    element.addEventListener(
      "contextmenu",
      storedEvents.contextMenuEvent,
      options
    );
  }

  destroyEvents() {
    const { element, storedEvents } = this;
    const { removeEventListener } = element;
    const options = {
      passive: false
    };

    removeEventListener("touchstart", storedEvents.touchStartEvent, options);
    removeEventListener("touchmove", storedEvents.touchMoveEvent, options);
    removeEventListener("touchend", storedEvents.touchEndEvent, options);
    removeEventListener("contextmenu", storedEvents.contextMenuEvent, options);
  }

  touchStartEvent(target, event) {
    const { createGhost, dispatchDragEvent, enabled, touchPressTime } = this;

    if (!enabled) {
      return;
    }

    this.timeout = setTimeout(() => {
      dispatchDragEvent({ type: "dragstart", target, event });
      createGhost.call(this, event, target);
      this.dragging = true;
    }, touchPressTime);
  }

  touchMoveEvent(event) {
    const {
      timeout,
      dragging,
      moveGhost,
      checkDragovers,
      destroyGhost,
      checkIfScrollIsNeeded
    } = this;

    clearTimeout(timeout);

    if (dragging) {
      moveGhost.call(this, event);
      checkDragovers.call(this, event);
      checkIfScrollIsNeeded.call(this, this.getTouchPosition(event));
    }

    if (!dragging) {
      destroyGhost.call(this);
    }
  }

  checkIfScrollIsNeeded(position) {
    const yThreshold = window.innerHeight / 10;
    const xThreshold = window.innerWidth / 10;

    if (position.y <= yThreshold && window.scrollY !== 0) {
      window.scrollTo(0, window.scrollY - 5);
    }

    if (position.x <= xThreshold && window.scrollX !== 0) {
      window.scrollTo(window.scrollX - 5, 0);
    }

    if (
      position.y >= window.innerHeight - yThreshold &&
      window.innerHeight + window.scrollY < document.body.scrollHeight
    ) {
      window.scrollTo(0, window.scrollY + 5);
    }

    if (
      position.x >= window.innerWidth - xThreshold &&
      window.innerWidth + window.scrollX < document.body.scrollWidth
    ) {
      window.scrollTo(window.scrollX + 5, 0);
    }
  }

  touchEndEvent(event) {
    const { destroyGhost, dragging, overs, dispatchDragEvent, element } = this;

    destroyGhost.call(this);

    if (!dragging) {
      clearTimeout(this.timeout);
      return;
    }

    dispatchDragEvent({
      type: "dragend",
      target: element,
      event
    });

    overs
      .filter(over => over._allowDropEvent !== undefined)
      .forEach(over => {
        dispatchDragEvent({
          type: "drop",
          target: over,
          event
        });
      });
  }

  contextMenuEvent(event) {
    event.preventDefault();
  }

  fireDragStart(event) {
    const {
      events: { dragstart }
    } = this;

    if (isFunction(dragstart)) {
      this.dragging = true;
      dragstart(event);
    }
  }

  createGhost(event, target) {
    const { ghostEnabled } = this;

    if (!ghostEnabled) {
      this.ghost = {};
      return;
    }

    const { top, left, height, width } = target.getBoundingClientRect();
    const { x, y } = this.getTouchPosition(event);

    this.offsets.y = y - top;
    this.offsets.x = x - left;

    html2canvas(target).then(canvas => {
      copyBorderRadius(target, canvas);

      canvas.style.height = `${height}px`;
      canvas.style.width = `${width}px`;
      canvas.style.opacity = "0.5";
      canvas.style.top = `${y - this.offsets.y + window.scrollY}px`;
      canvas.style.left = `${x - this.offsets.x + window.scrollX}px`;
      canvas.style.position = "absolute";

      document.body.appendChild(canvas);
      this.ghost = canvas;
    });
  }

  destroyGhost() {
    const { ghost } = this;

    if (ghost instanceof HTMLElement) {
      document.body.removeChild(ghost);
      this.ghost = {};
      this.dragging = false;
    }
  }

  getTouchPosition(event) {
    const {
      touches: [touch]
    } = event;
    const { clientY: y, clientX: x } = touch;

    return { y, x };
  }

  moveGhost(event) {
    const { ghost, offsets, getTouchPosition, ghostEnabled } = this;

    event.preventDefault();

    if (!ghostEnabled || !ghost || ghost.style === undefined) {
      return;
    }

    const { x, y } = getTouchPosition(event);

    ghost.style.top = `${y - offsets.y + window.scrollY}px`;
    ghost.style.left = `${x - offsets.x + window.scrollX}px`;
  }

  checkDragovers(event) {
    const { dispatchDragEvent } = this;
    const { x, y } = this.getTouchPosition(event);
    const overs = document
      .elementsFromPoint(x, y)
      .filter(
        node =>
          node._bindedDragEvents !== undefined &&
          node._allowDropEvent !== undefined
      );

    if (overs.length > 0) {
      this.checkEnterLeaves(overs, event);
      this.overs = overs;
      overs.forEach(over =>
        dispatchDragEvent({
          type: "dragover",
          target: over,
          event
        })
      );
      return;
    }

    this.overs.forEach(over => {
      dispatchDragEvent({
        type: "dragleave",
        target: over,
        event
      });
    });
    this.overs = [];
  }

  checkEnterLeaves(updatedOvers, event) {
    const { overs: currentOvers, dispatchDragEvent } = this;
    const entries = updatedOvers.filter(
      updated => !currentOvers.some(current => current === updated)
    );
    const leaves = currentOvers.filter(
      current => !updatedOvers.some(updated => updated === current)
    );

    if (entries.length > 0) {
      entries.forEach(entry =>
        dispatchDragEvent({
          type: "dragenter",
          target: entry,
          event
        })
      );
    }

    if (leaves.length > 0) {
      leaves.forEach(leave =>
        dispatchDragEvent({
          type: "dragleave",
          target: leave,
          event
        })
      );
    }

    if (updatedOvers.length === 0) {
      currentOvers.forEach(current =>
        dispatchDragEvent({
          type: "dragleave",
          element: current,
          event
        })
      );
    }
  }

  dispatchDragEvent(options) {
    const { type, event } = options;
    const element = options.target || event.target;

    if (!element._bindedDragEvents) {
      return;
    }

    const handler = element._bindedDragEvents[type];
    const handlerTouch = element._bindedDragEvents[type + ":touch"];

    if (handlerTouch && isFunction(handlerTouch)) {
      handlerTouch(event);
      return;
    }

    if (handler && isFunction(handler)) {
      handler(event);
    }
  }
}
