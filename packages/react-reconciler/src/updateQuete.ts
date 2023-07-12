import { Action } from "shared/ReactTypes";

export interface Update<State> {
  action: Action<State>;
}

export interface UpdateQuete<State> {
  shared: {
    pending: Update<State> | null;
  };
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action,
  };
};

export const createUpdateQuete = <State>() => {
  return {
    shared: {
      pending: null,
    },
  } as UpdateQuete<State>;
};

export const enqueueUpdate = <State>(
  updateQueue: UpdateQuete<State>,
  update: Update<State>
) => {
  updateQueue.shared.pending = update;
};

export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null
): { memoizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
  };
  if (pendingUpdate !== null) {
    const action = pendingUpdate.action;
    if (action instanceof Function) {
      result.memoizedState = action(baseState);
    } else {
      result.memoizedState = action;
    }
  }
  return result;
};
