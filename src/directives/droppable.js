const processDirectiveOptions = (element, options) => {
  let { _allowDropEvent: handler, _touchDragEvent: touchDrag } = element;

  if (!options && !handler) {
    handler = event => {
      event.preventDefault();
    };
    element._allowDropEvent = element.addEventListener("dragover", handler);
    element._allowDropEvent = handler;
    return;
  }

  if (!options && handler) {
    element.removeEventListener("dragover", handler);
    delete element._allowDropEvent;
  }

  if (options && !handler) {
    handler = event => {
      event.preventDefault();
    };
    element._allowDropEvent = element.addEventListener("dragover", handler);
    element._allowDropEvent = handler;
  }
};

export default {
  bind(element, binding) {
    processDirectiveOptions(element, binding.value);
  },
  update(element, binding) {
    processDirectiveOptions(element, binding.value);
  },
  unbind(element) {
    const handler = element._allowDropEvent;
    element.removeEventListener("dragover", handler);
  }
};
