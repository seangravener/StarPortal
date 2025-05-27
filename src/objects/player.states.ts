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
    FlyingLeft: {
      on: {
        "stop-horizontal": "Idle",
        "fly-right": "FlyingRight",
        "fly-up": "FlyingLeftUp",
        "fly-down": "FlyingLeftDown",
      },
    },
    FlyingRight: {
      on: {
        "stop-horizontal": "Idle",
        "fly-left": "FlyingLeft",
        "fly-up": "FlyingRightUp",
        "fly-down": "FlyingRightDown",
      },
    },
    FlyingUp: {
      on: {
        "stop-vertical": "Idle",
        "fly-down": "FlyingDown",
        "fly-left": "FlyingLeftUp",
        "fly-right": "FlyingRightUp",
      },
    },
    FlyingDown: {
      on: {
        "stop-vertical": "Idle",
        "fly-up": "FlyingUp",
        "fly-left": "FlyingLeftDown",
        "fly-right": "FlyingRightDown",
      },
    },
    FlyingLeftUp: {
      on: {
        "stop-horizontal": "FlyingUp",
        "stop-vertical": "FlyingLeft",
        "fly-right": "FlyingRightUp",
        "fly-down": "FlyingLeftDown",
      },
    },
    FlyingLeftDown: {
      on: {
        "stop-horizontal": "FlyingDown",
        "stop-vertical": "FlyingLeft",
        "fly-right": "FlyingRightDown",
        "fly-up": "FlyingLeftUp",
      },
    },
    FlyingRightUp: {
      on: {
        "stop-horizontal": "FlyingUp",
        "stop-vertical": "FlyingRight",
        "fly-left": "FlyingLeftUp",
        "fly-down": "FlyingRightDown",
      },
    },
    FlyingRightDown: {
      on: {
        "stop-horizontal": "FlyingDown",
        "stop-vertical": "FlyingRight",
        "fly-left": "FlyingLeftDown",
        "fly-up": "FlyingRightUp",
      },
    },
  },
});

export const flyingService = interpret(flyingStateMachine);
