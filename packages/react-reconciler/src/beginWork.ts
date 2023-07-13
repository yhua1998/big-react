import { ReactElementType } from "shared/ReactTypes";
import { FiberNode } from "./fiber";
import { UpdateQuete, processUpdateQueue } from "./updateQuete";
import {
  HostComponent,
  FunctionComponent,
  HostRoot,
  HostText,
} from "./workTags";
import { mountChildFibers, reconcilerChildFibers } from "./childFibers";
import { renderWithHooks } from "./fiberHooks";

export const beginWork = (wip: FiberNode): FiberNode | null => {
  // 递归/递：比较返回子Fiber
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip);
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      return null;
    case FunctionComponent:
      return updateFunctionComponent(wip);
    default:
      if (__DEV__) {
        console.warn("beginWork未实现类型");
      }
  }
  return null;
};

function updateHostRoot(wip: FiberNode) {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue as UpdateQuete<Element>;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  // 更新后的状态
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;
  // 对于HostRoot 是jsx
  const nextChildren = wip.memoizedState;
  reconcilerChildren(wip, nextChildren);
  return wip.child;
}

function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children;
  reconcilerChildren(wip, nextChildren);
  return wip.child;
}

function updateFunctionComponent(wip: FiberNode): FiberNode | null {
  // 执行函数获取UI元素
  const nextChildren = renderWithHooks(wip);
  reconcilerChildren(wip, nextChildren);
  return wip.child;
}

function reconcilerChildren(wip: FiberNode, children?: ReactElementType) {
  const current = wip.alternate;
  if (current !== null) {
    // update
    wip.child = reconcilerChildFibers(wip, current?.child, children);
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, children);
  }
  return wip.child;
}
