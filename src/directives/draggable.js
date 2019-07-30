import TouchDragEvent from "../touch";

const mergeOptions = defined => {
  const defaultOptions = {
    enabled: true,
    touchPressTime: 1000,
    hideDefaultGhost: false
  };

  return { ...defaultOptions, ...defined };
};

const processDirectiveOptions = (element, options) => {
  if (options === undefined) {
    element.draggable = true;
    element._touchDragEvent.enabled = true;
    return;
  }

  if (typeof options === "boolean") {
    element.draggable = options;
    element._touchDragEvent.enabled = options;
    return;
  }

  if (typeof options === "object") {
    const { enabled, hideDefaultGhost, touchPressTime } = mergeOptions(options);
    const {
      _touchDragEvent: touchDrag,
      _hideGhostEvent: hideGhostEvent
    } = element;

    element.style.userSelect = "none";

    element.draggable = enabled;
    touchDrag.enabled = enabled;

    touchDrag.touchPressTime = touchPressTime;

    if (!hideDefaultGhost && hideGhostEvent) {
      touchDrag.ghostEnabled = true;
      element.removeEventListener("dragstart", hideGhostEvent);
      delete element._hideGhostEvent;
    }

    if (hideDefaultGhost && !hideGhostEvent) {
      const handler = event => {
        const dummy = new Image();
        dummy.src =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
        event.dataTransfer.setDragImage(dummy, 0, 0);
      };

      touchDrag.ghostEnabled = false;
      element.addEventListener("dragstart", handler);
      element._hideGhostEvent = handler;
    }
  }
};

export default {
  bind(element, binding, vnode) {
    const { value: options } = binding;
    const touchDragEvent = new TouchDragEvent({
      element
    });
    element._touchDragEvent = touchDragEvent;

    processDirectiveOptions(element, options);
  },
  update(element, binding) {
    processDirectiveOptions(element, binding.value);
  },
  unbind(element) {
    const touchDrag = element._touchDragEvent;
    touchDrag.destroyEvents();
  }
};
