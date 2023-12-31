import { Container } from "hostConfig";
import { FiberNode, FiberRootNode } from "./fiber";
import { HostRoot } from "./workTags";
import {
  UpdateQuete,
  createUpdate,
  createUpdateQuete,
  enqueueUpdate,
} from "./updateQuete";
import { ReactElementType } from "shared/ReactTypes";
import { scheduleUpdateOnFiber } from "./workLoop";

export function createContainer(container: Container) {
  // 对与浏览器环境，为真实dom节点
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  // 创建根Fiber: FiberRootNode
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQuete();
  return root;
}

export function updateContainer(
  element: ReactElementType | null,
  root: FiberRootNode
) {
  const hostRootFiber = root.current;
  const update = createUpdate<ReactElementType | null>(element);
  enqueueUpdate(
    hostRootFiber.updateQueue as UpdateQuete<ReactElementType | null>,
    update
  );
  scheduleUpdateOnFiber(hostRootFiber);
  return element;
}
