let activeFloor = 1;
const buttons = document.querySelectorAll(".floor-btn");
const floors = document.querySelectorAll(".floor");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    moveTo(Number(btn.dataset.floor));
  });
});

function moveTo(floor) {
  if (floor === activeFloor) return;

  activeFloor = floor;

  buttons.forEach(b => b.classList.remove("active"));
  document.querySelector(`[data-floor="${floor}"]`)?.classList.add("active");

  floors.forEach(f => f.classList.remove("active"));
  const target = document.getElementById("floor" + floor);

  if (target) {
    target.classList.add("active");
    gsap.fromTo(target,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );
  }

  if (window.goToFloor) window.goToFloor(floor);
  if (window.onFloorChange) window.onFloorChange(floor);
}

let startY = 0;

window.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
});

window.addEventListener("touchend", e => {
  const diff = e.changedTouches[0].clientY - startY;

  if (Math.abs(diff) < 50) return;

  if (diff < 0 && activeFloor < 5) moveTo(activeFloor + 1);
  if (diff > 0 && activeFloor > 1) moveTo(activeFloor - 1);
});
