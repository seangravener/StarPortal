import { interpret, createMachine } from "xstate";

export const flyingStateMachine = createMachine({
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "fly-left": "FlyingLeft",
        "fly-right": "FlyingRight",
        "fly-up": "FlyingUp",
        "fly-down": "FlyingDown",
      },
    },
    IdleAfterLeft: {
      on: {
        "stop-fly-left": "Idle",
      },
    },
    IdleAfterRight: {
      on: {
        "stop-fly-right": "Idle",
      },
    },
    FlyingLeft: {
      on: {
        "stop-horizontal": "Idle",
      },
    },
    FlyingRight: {
      on: {
        "stop-horizontal": "Idle",
      },
    },
    FlyingUp: {
      on: {
        "stop-vertical": "Idle",
      },
    },
    FlyingDown: {
      on: {
        "stop-vertical": "Idle",
      },
    },
  },
});

export const flyingService = interpret(flyingStateMachine);
