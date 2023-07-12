import { ReactElementType } from "shared/ReactTypes";
import { FiberNode } from "./fiber";
import { UpdateQuete, processUpdateQueue } from "./updateQuete";
import { HostComponent, HostRoot, HostText } from "./workTags";

export const beginWork = (wip: FiberNode): FiberNode | null => {
  // 递归/递：比较返回子Fiber
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip);
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      return null;
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
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;
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


function reconcilerChildren(wip:FiberNode, children?:ReactElementType){
  const curent = wip.alternate
  reconcilerChildFibers(wip,curent?.child,children)
}