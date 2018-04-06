'use strict';
// window.onload because it is most supported.
window.onload = () => {
  const dice = document.getElementById('dice');

  // EVENT LISTENERS:
  dice.addEventListener('click', () => {
    let fate = _roll_of_a_dice();
    console.log(fate);
  });

}
