import IdleWorker from './IdleWorker.js';
import { TEXT, PLACEMENT, UPDATE, DELETION } from './enums.js';

const { keys } = Object;

export default () => {
  let realRoot = null;
  let virtualRoot = null;
  let deletions = null;
  let wipFiber = null;
  let hookIndex = null;

  const renderWorker = IdleWorker({
    work: (fiber) => {
      let children;
      if (fiber.type instanceof Function) {
        wipFiber = fiber;
        hookIndex = 0;
        wipFiber.hooks = [];
        children = [fiber.type(fiber.props)];
      } else {
        if (!fiber.dom) {
          console.log('First node', fiber.type);
          fiber.dom = update(
            fiber.type === TEXT
              ? document.createTextNode(fiber.props.nodeValue)
              : document.createElement(fiber.type),
            {},
            fiber.props
          );
        }
        children = fiber.props.children;
      }
      let index = 0;
      let oldFiber = fiber.alternate && fiber.alternate.child;
      let prevSibling = null;
      for (let i = 0; i < children.length || !!oldFiber; i++) {
        const { type, props } = children[index] || {};
        const sameType = oldFiber && type && type === oldFiber.type;
        const newFiber = (sameType || children[index]) ? {
          type,
          props,
          dom: sameType ? oldFiber.dom : null,
          parent: fiber,
          alternate: sameType ? oldFiber : null,
          effectTag: sameType ? UPDATE : PLACEMENT,
        } : null;
        if (oldFiber) {
          if (!sameType) deletions.push(oldFiber = { ...oldFiber, effectTag: DELETION });
          oldFiber = oldFiber.sibling;
        }
        if (index === 0) {
          fiber.child = newFiber;
        } else if (child) {
          prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber;
        index++;
      }
      if (fiber.child) return fiber.child;
      let nextFiber = fiber;
      while (nextFiber) {
        if (nextFiber.sibling) return nextFiber.sibling;
        nextFiber = nextFiber.parent;
      }
      return null;
    },
    cleanup: (unitsOfWork) => {
      console.log('deleting old nodes');
      for (let i = 0; i < deletions.length; i++) commit(deletions[i]);
      console.log('committing nodes');
      unitsOfWork.forEach(unit => commit(unit.child));
      realRoot = unitsOfWork[0];
      virtualRoot = null;
    }
  });

  const remove = ({ dom, child }) => {
    if (child) remove(child);
    if (dom && dom.parentNode) dom.parentNode.removeChild(dom);
  };

  const commit = (fiber) => {
    if (!fiber) return;
    const { effectTag, dom, alternate, props, child, sibling } = fiber;

    let domParentFiber = fiber.parent;
    while (!domParentFiber.dom) domParentFiber = domParentFiber.parent;
    const domParent = domParentFiber.dom;

    if (effectTag === PLACEMENT && dom != null) {
      domParent.appendChild(dom);
    } else if (effectTag === UPDATE && dom != null) {
      update(dom, alternate.props, props);
    } else if (effectTag === DELETION) {
      remove(fiber);
    }
    commit(child);
    commit(sibling);
  };

  const rerender = () => {
    renderWorker.add({
      dom: realRoot.dom,
      props: realRoot.props,
      alternate: realRoot,
    });
    deletions = [];
  };
  const render = (node, container) => {
    renderWorker.add({
      dom: container,
      props: { children: [node] },
      alternate: realRoot,
    });
    deletions = [];
    renderWorker.run();
  };

  const setHook = (newHook) => {
    wipFiber.hooks.push();
    hookIndex++;
  };

  const update = (dom, prevProps, nextProps) => {
    //Remove old or changed event listeners
    const prevKeys = keys(prevProps);
    const nextKeys = keys(nextProps);
    const allKeys = Array.from(new Set(prevKeys.concat(nextKeys)));
    const keyProps = {};
    for (let i = 0; i < allKeys.length; i++) {
      const key = allKeys[i];
      const isEvent = key.startsWith("on");
      const isProperty = !isEvent && key !== 'children';
      const isNew = prevProps[key] !== nextProps[key];
      const isGone = !(key in nextProps);
      keyProps[key] = { ...keyProps[key], isEvent, isProperty, isNew, isGone };
    }
    for (let i = 0; i < prevKeys.length; i++) {
      const key = prevKeys[i];
      const { isEvent, isProperty, isGone, isNew } = keyProps[key];
      // Remove old event listeners
      if (isEvent && isNew) dom.removeEventListener(key.toLowerCase().substr(2), prevProps[key]);
      // Remove old properties
      if (isProperty && isGone) dom[name] = '';
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      const { isEvent, isProperty, isNew } = keyProps[key];
      // Set new or changed properties
      if (isProperty && isNew) dom[name] = nextProps[name];
      // Add event listeners
      if (isEvent && isNew) dom.addEventListener(key.toLowerCase().substr(2), nextProps[key]);
    }
    return dom;
  };

  const createHook = (builder) => {
    return (...args) => {
      const { alternate } = wipFiber;
      const lastHook = alternate && alternate.hooks && alternate.hooks[hookIndex];
      return builder(lastHook, setHook, rerender)(...args);
    };
  };

  return {
    render,
    createHook,
  };
};
