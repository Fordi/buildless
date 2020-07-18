const { requestIdleCallback } = window;
export default ({ work, cleanup }) => {
  const next = [];
  const worked = [];
  let working = false;
  const loop = (deadline) => {
    if (!working) return;
    if (next.length && deadline && deadline.timeRemaining() >= 1) {
      console.log('Working...');
      while (next.length && deadline && deadline.timeRemaining() >= 1) {
        const unit = next.shift();
        let item = work(unit);
        worked.push(unit);
        if (item) next.push(item);
      }
      console.log('Cleaning up');
      cleanup(worked.splice(0, worked.length));
    }
    requestIdleCallback(loop);
  }
  return { 
    run: () => {
      working = true;
      requestIdleCallback(loop);
    },
    add: item => next.push(item),
    stop: () => {
      working = false;
    }
  };
};
