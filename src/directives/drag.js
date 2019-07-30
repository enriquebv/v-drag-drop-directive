const alloweds = [
  "dragstart",
  "dragover",
  "dragleave",
  "dragenter",
  "dragend",
  "drop",
  "dragstart:touch",
  "dragover:touch",
  "dragleave:touch",
  "dragenter:touch",
  "dragend:touch",
  "drop:touch"
];

const associateEvents = (element, vnode) => {
  const events = vnode.data.on;

  if (!events) {
    return;
  }

  const isAllowed = type => alloweds.some(allowed => allowed === type);
  const binded = Object.keys(events).reduce((acc, current) => {
    if (isAllowed(current)) {
      acc[current] = events[current];
    }

    return acc;
  }, {});

  element._bindedDragEvents = binded;
};

export default {
  bind(element, binding, vnode) {
    associateEvents(element, vnode);
  },
  update(element, binding, vnode) {
    associateEvents(element, vnode);
  }
};
