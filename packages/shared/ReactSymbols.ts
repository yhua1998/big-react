const suppertSymbol = typeof Symbol === 'function' && Symbol.for

export const REACT_ELEMENT_TYPE = suppertSymbol ? Symbol.for('react.element') : 0xeac7