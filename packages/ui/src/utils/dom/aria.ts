const FOCUSABLE_ELEMENT_SELECTORS = `a[href],button:not([disabled]),button:not([hidden]),:not([tabindex="-1"]),input:not([disabled]),input:not([type="hidden"]),select:not([disabled]),textarea:not([disabled])`;

/**
 * Определите, виден ли тестируемый элемент на экране, независимо от того, находится ли он в окне просмотра или нет.
 */
export const isVisible = (element: HTMLElement) => {
  if (process.env.NODE_ENV === "test") {
    return true;
  }

  const computed = getComputedStyle(element);
  // element.offsetParent won't work on fix positioned
  // WARNING: potential issue here, going to need some expert advices on this issue
  return computed.position === "fixed" ? false : element.offsetParent !== null;
};

export const obtainAllFocusableElements = (
  element: HTMLElement
): HTMLElement[] => {
  return Array.from(
    element.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENT_SELECTORS)
  ).filter((item: HTMLElement) => isFocusable(item) && isVisible(item));
};

/**
 * Определить, можно ли сфокусировать целевой элемент
 */
export const isFocusable = (element: HTMLElement): boolean => {
  if (
    element.tabIndex > 0 ||
    (element.tabIndex === 0 && element.getAttribute("tabIndex") !== null)
  ) {
    return true;
  }

  if ((element as HTMLButtonElement).disabled) {
    return false;
  }

  switch (element.nodeName) {
    case "A": {
      return (
        !!(element as HTMLAnchorElement).href &&
        (element as HTMLAnchorElement).rel !== "ignore"
      );
    }
    case "INPUT": {
      return !(
        (element as HTMLInputElement).type === "hidden" ||
        (element as HTMLInputElement).type === "file"
      );
    }
    case "BUTTON":
    case "SELECT":
    case "TEXTAREA": {
      return true;
    }
    default: {
      return false;
    }
  }
};

/**
 * Установить Попытка установить фокус на текущем узле.
 */
export const attemptFocus = (element: HTMLElement): boolean => {
  if (!isFocusable(element)) {
    return false;
  }
  // Remove the old try catch block since there will be no error to be thrown
  element.focus?.();
  return document.activeElement === element;
};

/**
 * Инициировать событие
 * mouseenter, mouseleave, mouseover, keyup, change, click, etc.
 */
export const triggerEvent = function (
  el: HTMLElement,
  name: string,
  opts: EventInit
): HTMLElement {
  let eventName: string;

  if (name.includes("mouse") || name.includes("click")) {
    eventName = "MouseEvents";
  } else if (name.includes("key")) {
    eventName = "KeyboardEvent";
  } else {
    eventName = "HTMLEvents";
  }
  const evt = document.createEvent(eventName);

  new Event(name, opts);
  el.dispatchEvent(evt);
  return el;
};

export const isLeaf = (el: HTMLElement) => !el.getAttribute("aria-owns");

export const getSibling = (
  el: HTMLElement,
  distance: number,
  elClass: string
) => {
  const { parentNode } = el;

  if (!parentNode) {
    return null;
  }

  const siblings = parentNode.querySelectorAll(elClass);
  const index = Array.prototype.indexOf.call(siblings, el);
  return siblings[index + distance] || null;
};

export const focusNode = (el: HTMLElement) => {
  if (!el) {
    return;
  }

  el.focus();

  !isLeaf(el) && el.click();
};
