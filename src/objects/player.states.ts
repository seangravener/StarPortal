import { createMachine } from "xstate";

export const flyingStateMachine = createMachine({
  initial: "Flying",
  states: {
    Flying: {
      on: {
        "fly-left": {
          target: "FlyingLeft",
        },
        "fly-right": {
          target: "FlyingRight",
        },
        accelerate: {
          target: "ThrustForward",
        },
      },
    },
    FlyingLeft: {
      on: {
        "fly-straight": {
          target: "Flying",
        },
      },
    },
    FlyingRight: {
      on: {
        "fly-straight": {
          target: "Flying",
        },
      },
    },
    ThrustForward: {
      on: {
        "fly-straight": {
          target: "Flying",
        },
      },
    },
  },
  id: "Ship Movement",
});
