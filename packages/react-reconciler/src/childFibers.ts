import { ReactElementType } from "shared/ReactTypes";
import { FiberNode, createFiberFromElement } from "./fiber";
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { HostText } from "./workTags";
import { Placement } from "./fiberFlags";

function ChildReconciler(shouldTrackEffect: boolean) {
  function reconcilerSinglleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElementType
  ) {
    const fiber = createFiberFromElement(element);
    fiber.return = returnFiber;
    return fiber;
  }

  function reconcilerSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | null
  ) {
    const fiber = new FiberNode(HostText, { content }, null);
    fiber.return = returnFiber;
    return fiber;
  }

  function placeSingleChild(fiber: FiberNode) {
    if (shouldTrackEffect && fiber.alternate === null) {
      fiber.flags |= Placement;
    }
    return fiber;
  }

  return function reconcilerChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild?: ReactElementType
  ) {
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcilerSinglleElement(returnFiber, currentFiber, newChild)
          );
        default:
          if (__DEV__) {
            console.log("为实现的reconciler类型", newChild);
          }
          break;
      }
    }
    if (typeof newChild === "string" || typeof newChild === "number") {
      return placeSingleChild(
        reconcilerSingleTextNode(returnFiber, currentFiber, newChild)
      );
    }

    if (__DEV__) {
      console.log("为实现的reconciler类型", newChild);
    }
    return null;
  };
}

export const reconcilerChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
