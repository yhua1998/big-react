import {
  createContainer,
  updateContainer,
} from "react-reconciler/src/fiberReconciler";
import { Container } from "./hostConfig";
import { ReactElementType } from "shared/ReactTypes";

export function createRoot(container: Container) {
  // 对于dom环境，container是真实dom节点
  const root = createContainer(container);

  /**
   * root = FiberRootNode       <-stateNode
   *            container         |
   *            current -> hostRootFiber
   *                             updateQueue
   */

  return {
    render(element: ReactElementType) {
      /**
       * ReactElementType: 描述用户界面UI的一种javascript对象（JSX）
       */
      updateContainer(element, root);
    },
  };
}
