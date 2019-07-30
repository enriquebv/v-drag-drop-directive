export const getCommonDirectiveConfig = (directive, binding, options) => {
  const { value, modifiers } = binding;
  let config = {
    eventModifiers: {}
  };

  if (!value) {
    throw new Error(`Options needed in v-${directive} directive.`);
  }

  if (isFunction(value)) {
    config.event = value;
  }

  if (!isFunction(value) && value.event) {
    config.event = value.event;
  }

  Object.keys(modifiers).forEach(key => {
    switch (key) {
      case "stop":
        config.eventModifiers.stopPropagation = true;
        break;
    }
  });

  if (options && options.preventDefault) {
    config.eventModifiers.preventDefault = true;
  }

  return config;
};

export const simulateDragEvent = (type, element) => {
  const event = new DragEvent(type, {
    view: window,
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
};

export const getElementPath = element => {
  const path = [];
  let lastElement = element;

  while (path[path.length - 1] !== document.body) {
    path.push(lastElement);
    lastElement = lastElement.parentNode;
  }

  return path;
};

export const copyBorderRadius = (source, target) => {
  const computed = window.getComputedStyle(source);

  target.style.borderTopLeftRadius = computed.getPropertyValue(
    "border-top-left-radius"
  );
  target.style.borderTopRightRadius = computed.getPropertyValue(
    "border-top-right-radius"
  );
  target.style.borderBottomLeftRadius = computed.getPropertyValue(
    "border-bottom-left-radius"
  );
  target.style.borderBottomRightRadius = computed.getPropertyValue(
    "border-bottom-right-radius"
  );
};

export const isFunction = func =>
  typeof func === "function" && func instanceof Function;
