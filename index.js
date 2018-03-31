const { Machine } = require("xstate");
const MachineMonad = require("./machine-monad");

const always = x => () => x;
const T = () => true;
const F = () => false;
const prop = key => obj => (obj || {})[key];
const path = keys => obj => (keys || []).reduce((acc, i) => prop(i)(acc), obj);

const light = {
  key: "light",
  initial: "off",
  states: {
    off: { on: { b: "on" } },
    on: { on: { "b^": "off" } }
  }
};

const alarm1status = {
  key: "alarm1status",
  initial: "disabled",
  states: {
    disabled: {
      on: {
        d: {
          enabled: {
            cond: state => path(["alarm1", "off"])(state) === true
          }
        }
      }
    },
    enabled: {
      on: {
        d: {
          disabled: {
            cond: state => path(["alarm1", "on"])(state) === true
          }
        }
      }
    }
  }
};

const alarm2status = {
  key: "alarm2status",
  initial: "disabled",
  states: {
    disabled: {
      on: {
        d: {
          enabled: {
            cond: state => path(["alarm2", "off"])(state) === true
          }
        }
      }
    },
    enabled: {
      on: {
        d: {
          disabled: {
            cond: state => path(["alarm2", "on"])(state) === true
          }
        }
      }
    }
  }
};

const chimeStatus = {
  key: 'chimeStatus',
  initial: 'disabled',
  states: {
    disabled: {
      on: {
        d: {
          'enabled.quiet': {
            // in chime.off
            cond: T
          }
        }
      }
    },
    enabled: {
      key: 'enabled',
      initial: 'quiet',
      on: {
        d: {
          disabled: {
            // in chime.on
            cond: T
          }
        }
      },
      states: {
        quiet: {
          on: {
            chimeTimer: {
              beep: {
                // T is whole hour
                cond: T,
              }
            }
          }
        },
        beep: {
          on: {
            chimeTimer: {
              beep: {
                // 2 sec in beep
                cond: T,
              }
            }
          }
        }
      }
    },
  }
}

/*
const lightMachine = new MachineMonad(Machine(light));
lightMachine
  .map('b')
  .map('b')
  .map('b')
  .map('b^')
*/

/*
const alarm1statusMachine = new MachineMonad(Machine(alarm1status));
alarm1statusMachine
  .map("d")
  .map('d')
*/

/*
const alarm2statusMachine = new MachineMonad(Machine(alarm2status));
alarm2statusMachine
  .map("d")
  .map('d')
*/
const chimeStatusMachine = new MachineMonad(Machine(chimeStatus));
chimeStatusMachine
  .map("d")
  .map("chimeTimer")
  .map("d")
  .map("d")
  .map("chimeTimer")
  .map("chimeTimer")
  .map("d")
