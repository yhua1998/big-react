import { beginWork } from "./beginWork";
import { commitMutationEffect } from "./commitWork";
import { completeWork } from "./completeWork";
import { FiberNode, FiberRootNode, createWorkInProcess } from "./fiber";
import { MutationMask, NoFlags } from "./fiberFlags";
import { HostRoot } from "./workTags";

// 工作树
let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
  // 新建工作树
  workInProgress = createWorkInProcess(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // 获取根节点
  const root = markUpdateFromFiberToRoot(fiber);
  renderRoot(root);
}

// 获取root:FiberRootNode
function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber; // 当前调度更新的节点
  let parent = node.return;
  // 向上查找
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  // 找到hostRootFiber
  if (node.tag === HostRoot) {
    // FiberRootNode
    return node.stateNode;
  }
  return null;
}

function renderRoot(root: FiberRootNode) {
  // 创建workinProgress
  prepareFreshStack(root);

  do {
    try {
      workLoop();
      break;
    } catch (e) {
      if (__DEV__) {
        console.log("workLoop发生错误");
      }
      workInProgress = null;
    }
  } while (true);
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;

  commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork;
  if (finishedWork === null) {
    return;
  }
  if (__DEV__) {
    console.warn("commit阶段开始", finishedWork);
  }
  root.finishedWork = null;

  const subtreeHasEffect =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
  if (subtreeHasEffect || rootHasEffect) {
    commitMutationEffect(finishedWork);
    root.current = finishedWork;
  } else {
    root.current = finishedWork;
  }
}

function workLoop() {
  while (workInProgress != null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber: FiberNode) {
  // next是fiber的孩子
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;

  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;

  do {
    completeWork(node);
    const sibling = node.sibling;

    if (sibling != null) {
      workInProgress = sibling;
      return;
    }
    node = node?.return;
    workInProgress = node;
  } while (node !== null);
}
