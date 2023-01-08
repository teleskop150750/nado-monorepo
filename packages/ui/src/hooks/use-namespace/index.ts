export const namespace = "n";
const statePrefix = "is-";
const hasPrefix = "has-";

const _bem = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string
) => {
  let cls = `${namespace}-${block}`;
  if (blockSuffix) {
    cls += `-${blockSuffix}`;
  }
  if (element) {
    cls += `__${element}`;
  }
  if (modifier) {
    cls += `--${modifier}`;
  }
  return cls;
};

export const useNamespace = (block: string) => {
  const b = (blockSuffix = "") => _bem(namespace, block, blockSuffix, "", "");

  const e = (element?: string, state = true) => {
    if (!state) {
      return undefined;
    }

    return element ? _bem(namespace, block, "", element, "") : "";
  };

  const m = (modifier?: string, state = true) => {
    if (!state) {
      return undefined;
    }

    modifier ? _bem(namespace, block, "", "", modifier) : "";
  };

  const be = (blockSuffix?: string, element?: string, state = true) => {
    if (!state) {
      return undefined;
    }

    if (!blockSuffix || !element) {
      return undefined;
    }

    _bem(namespace, block, blockSuffix, element, "");
  };

  const em = (element?: string, modifier?: string, state = true) => {
    if (!state) {
      return undefined;
    }

    if (!element || !modifier) {
      return undefined;
    }

    _bem(namespace, block, "", element, modifier);
  };

  const bm = (blockSuffix?: string, modifier?: string, state = true) => {
    if (!state) {
      return undefined;
    }

    if (!blockSuffix || !modifier) {
      return undefined;
    }

    _bem(namespace, block, blockSuffix, "", modifier);
  };

  const bem = (
    blockSuffix?: string,
    element?: string,
    modifier?: string,
    state = true
  ) => {
    if (!state) {
      return undefined;
    }

    if (!blockSuffix || !element || !modifier) {
      return undefined;
    }

    _bem(namespace, block, blockSuffix, element, modifier);
  };

  const is = (name: string, state = true) => {
    if (!state) {
      return undefined;
    }

    if (!name) {
      return undefined;
    }

    return _bem(namespace, block, "", "", `${statePrefix}${name}`);
  };

  const beIs = (
    blockSuffix?: string,
    element?: string,
    name?: string,
    state = true
  ) => {
    if (!state) {
      return undefined;
    }

    if (!blockSuffix || !element || !name) {
      return undefined;
    }

    return _bem(
      namespace,
      block,
      blockSuffix,
      element,
      `${statePrefix}${name}`
    );
  };

  const eIs = (element?: string, name?: string, state = true) => {
    if (!state) {
      return undefined;
    }

    if (!element || !name) {
      return undefined;
    }

    return _bem(namespace, block, "", element, `${statePrefix}${name}`);
  };

  const has = (name?: string, state = true) => {
    if (!state) {
      return undefined;
    }

    if (!name) {
      return undefined;
    }

    return _bem(namespace, block, "", "", `${hasPrefix}${name}`);
  };
  const bHas = (blockSuffix?: string, name?: string, state = true) => {
    if (!state) {
      return undefined;
    }

    if (!blockSuffix || !name) {
      return undefined;
    }

    return _bem(namespace, block, blockSuffix, "", `${hasPrefix}${name}`);
  };

  const beHas = (
    blockSuffix?: string,
    element?: string,
    name?: string,
    state = true
  ) => {
    if (!state) {
      return undefined;
    }

    if (!blockSuffix || !element || !name) {
      return undefined;
    }

    return _bem(namespace, block, blockSuffix, element, `${hasPrefix}${name}`);
  };

  const eHas = (element?: string, name?: string, state = true) => {
    if (!state) {
      return undefined;
    }

    if (!element || !name) {
      return undefined;
    }

    return _bem(namespace, block, "", element, `${hasPrefix}${name}`);
  };

  // for css var
  // --el-xxx: value;
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace}-${key}`] = object[key];
      }
    }
    return styles;
  };

  // with block
  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace}-${block}-${key}`] = object[key];
      }
    }
    return styles;
  };

  const cssVarName = (name: string) => `--${namespace}-${name}`;
  const cssVarBlockName = (name: string) => `--${namespace}-${block}-${name}`;

  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    beIs,
    eIs,
    has,
    bHas,
    beHas,
    eHas,
    // css
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName,
  };
};

export type UseNamespaceReturn = ReturnType<typeof useNamespace>;
