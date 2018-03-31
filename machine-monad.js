const toString = x => !!x.value ? x.value : JSON.stringify(x);

class MachineMonad {
  constructor(machine) {
    this.state = machine.initialState;
    this.machine = machine;
    console.log(`${toString(this.state)}`);
  }
  map(event) {
    const oldState = this.state;
    // console.log('BEFORE: ', this.state)
    this.state = this.machine.transition(this.state, event).value;
    // console.log('AFTER: ', this.state)
    console.log(`${event}: ${toString(oldState)} -> ${toString(this.state)}`);
    // console.log(this.machine)
    return this;
  }
}

module.exports = MachineMonad;
