import internals from "shared/internals";
import { FiberNode } from "./fiber";
import { Dispatch, Dispatcher } from "react/src/currentDispatcher";
import {
  UpdateQuete,
  createUpdate,
  createUpdateQuete,
  enqueueUpdate,
} from "./updateQuete";
import { Action } from "shared/ReactTypes";
import { scheduleUpdateOnFiber } from "./workLoop";

let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;

interface Hook {
  memoizedState: any;
  updateQueue: unknown;
  next: Hook | null;
}

const { currentDispatcher } = internals;

export function renderWithHooks(wip: FiberNode) {
  currentlyRenderingFiber = wip;
  wip.memoizedState = null;
  wip.updateQueue = null;

  const current = wip.alternate;
  if (current !== null) {
    if (__DEV__) {
      console.warn("未实现renderWithHook更新");
    }
  } else {
    currentDispatcher.current = HooksDispatcherOnMount;
  }

  // 对于函数组件FunctionComponent：type是函数
  const Component = wip.type;
  // props是函数参数
  const props = wip.pendingProps;
  const children = Component(props);

  currentlyRenderingFiber = null;
  // 
  workInProgressHook = null;
  return children;
}

const HooksDispatcherOnMount: Dispatcher = {
  useState: mountState,
};

function mountState<State>(
  initialState: (() => State) | State
): [State, Dispatch<State>] {
  const hook = mountWorkInProgressHook();
  let memoizedState:State;
  if (initialState instanceof Function) {
    memoizedState = initialState();
  } else {
    memoizedState = initialState;
  }
  hook.memoizedState = memoizedState

  if(currentlyRenderingFiber === null){
    console.warn("mountState时currentlyRenderingFiber不存在")
  }
  const queue = createUpdateQuete<State>();
  hook.updateQueue = queue;

  //@ts-ignore
  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
  queue.dispatch = dispatch;
  return [memoizedState, dispatch];
}

function dispatchSetState<State>(
  fiber: FiberNode,
  updateQuete: UpdateQuete<State>,
  action: Action<State>
) {
  const update = createUpdate(action);
  enqueueUpdate(updateQuete, update);
  scheduleUpdateOnFiber(fiber);
}

function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    updateQueue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    // 第一个Hook
    if (currentlyRenderingFiber === null) {
      throw new Error("请在函数组件内调用Hook");
    } else {
      workInProgressHook = hook;
      currentlyRenderingFiber.memoizedState = workInProgressHook;
    }
  } else {
    workInProgressHook.next = hook;
    workInProgressHook = hook;
  }
  return workInProgressHook;
}
