const diskCountInput = document.getElementById('diskCount');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const applyMoveBtn = document.getElementById('applyMoveBtn');
const moveInput = document.getElementById('moveInput');
const moveCountEl = document.getElementById('moveCount');
const expectedCountEl = document.getElementById('expectedCount');
const messageEl = document.getElementById('message');

const rods = {
  A: [],
  B: [],
  C: [],
};

let isAnimating = false;
let moveSequence = [];
let currentMoveIndex = 0;

function getDiskCount() {
  const value = Number(diskCountInput.value);
  return Number.isInteger(value) && value >= 1 && value <= 8 ? value : 0;
}

function updateExpectedCount() {
  const n = getDiskCount();
  expectedCountEl.textContent = n > 0 ? Math.pow(2, n) - 1 : 0;
}

function buildDisk(size, total) {
  const disk = document.createElement('div');
  disk.className = 'disk';
  const width = 84 + (size * 18);
  disk.style.width = `${width}px`;
  disk.style.height = '26px';
  disk.style.marginBottom = '4px';
  disk.style.position = 'relative';
  disk.dataset.size = size;
  return disk;
}

function render() {
  Object.keys(rods).forEach((rodName) => {
    const rod = document.getElementById(`tower${rodName}`);
    const existing = rod.querySelector('.disks');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.className = 'disks';

    rods[rodName].forEach((diskSize) => {
      const disk = buildDisk(diskSize, rods[rodName].length);
      container.appendChild(disk);
    });

    rod.appendChild(container);
  });
}

function resetGame() {
  const n = getDiskCount();
  if (!n) {
    messageEl.textContent = 'Please enter a number from 1 to 8.';
    return;
  }

  rods.A = Array.from({ length: n }, (_, index) => n - index);
  rods.B = [];
  rods.C = [];
  moveSequence = [];
  currentMoveIndex = 0;
  isAnimating = false;
  moveCountEl.textContent = '0';
  moveInput.value = '';
  messageEl.textContent = `Ready to solve ${n} disk(s). Type moves like A->C.`;
  updateExpectedCount();
  render();
}

function generateMoves(n, from, to, aux) {
  if (n === 1) {
    moveSequence.push({ from, to });
    return;
  }

  generateMoves(n - 1, from, aux, to);
  moveSequence.push({ from, to });
  generateMoves(n - 1, aux, to, from);
}

function performMove(from, to) {
  const fromRod = rods[from];
  const toRod = rods[to];

  if (!fromRod.length) {
    return false;
  }

  const disk = fromRod[fromRod.length - 1];
  const topTarget = toRod[toRod.length - 1];

  if (topTarget !== undefined && disk > topTarget) {
    return false;
  }

  fromRod.pop();
  toRod.push(disk);
  moveCountEl.textContent = String(++currentMoveIndex);
  render();

  if (rods.C.length === getDiskCount()) {
    messageEl.textContent = `Solved! You completed the puzzle in ${currentMoveIndex} moves.`;
  }

  return true;
}

function applyManualMove() {
  const value = moveInput.value.trim().toUpperCase().replace(/\s+/g, '');
  const match = value.match(/^([ABC])->([ABC])$/);

  if (!match) {
    messageEl.textContent = 'Use format A->C.';
    return;
  }

  const from = match[1];
  const to = match[2];

  if (from === to) {
    messageEl.textContent = 'A rod cannot move to itself.';
    return;
  }

  const success = performMove(from, to);

  if (!success) {
    messageEl.textContent = 'That move is not allowed. Try a smaller disk on top.';
    return;
  }

  moveInput.value = '';
  messageEl.textContent = `Moved disk from ${from} to ${to}.`;
}

function playAnimation() {
  if (isAnimating) return;

  const n = getDiskCount();
  if (!n) {
    messageEl.textContent = 'Please enter a valid disk count first.';
    return;
  }

  isAnimating = true;
  messageEl.textContent = 'Animating solution...';
  generateMoves(n, 'A', 'C', 'B');

  let delay = 0;
  moveSequence.forEach((step) => {
    setTimeout(() => {
      performMove(step.from, step.to);
      if (currentMoveIndex === moveSequence.length) {
        isAnimating = false;
        messageEl.textContent = `Completed in ${moveSequence.length} moves.`;
      }
    }, delay);
    delay += 450;
  });
}

startBtn.addEventListener('click', () => {
  resetGame();
  playAnimation();
});

applyMoveBtn.addEventListener('click', applyManualMove);
resetBtn.addEventListener('click', resetGame);
diskCountInput.addEventListener('input', updateExpectedCount);
moveInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    applyManualMove();
  }
});

updateExpectedCount();
resetGame();
