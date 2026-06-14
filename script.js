document.addEventListener('DOMContentLoaded', function () {
  
  const path = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.top-nav .nav-link');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === path || (path === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });

  
  const filterButtons = document.querySelectorAll('.filter-btn');
  const recipeCards = document.querySelectorAll('.recipe-card[data-category]');
  if (filterButtons.length && recipeCards.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function () {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        const category = this.dataset.filter;
        recipeCards.forEach(card => {
          card.style.display = category === 'all' || card.dataset.category === category ? '' : 'none';
        });
      });
    });
  }

  const params = new URLSearchParams(window.location.search);
  const categoryFilter = params.get('category');
  if (categoryFilter && filterButtons.length) {
    const matchingButton = Array.from(filterButtons).find(btn => btn.dataset.filter === categoryFilter);
    if (matchingButton) {
      matchingButton.click();
    }
  }

  const calculators = document.querySelectorAll('.recipe-calculator');
  calculators.forEach(initCalculator);
});

function initCalculator(calculator) {
  const defaultServings = Number(calculator.dataset.defaultServings) || 4;
  const servingsInput = calculator.querySelector('.servings-input');
  const ingredientInputs = Array.from(calculator.querySelectorAll('.ingredient-qty'));
  let isSyncing = false;

  function roundValue(value) {
    return Math.round(value * 10) / 10;
  }

  function updateIngredients(scale) {
    ingredientInputs.forEach(input => {
      const baseline = Number(input.dataset.baseline) || 0;
      input.value = baseline ? roundValue(baseline * scale) : input.value;
    });
  }

  function syncFromServings() {
    if (isSyncing) return;
    isSyncing = true;
    const servings = Number(servingsInput.value) || defaultServings;
    const scale = servings / defaultServings;
    updateIngredients(scale);
    isSyncing = false;
  }

  function syncFromIngredient(changedInput) {
    if (isSyncing) return;
    isSyncing = true;
    const baseline = Number(changedInput.dataset.baseline) || 1;
    const current = Number(changedInput.value) || baseline;
    const scale = current / baseline;
    servingsInput.value = roundValue(defaultServings * scale);
    updateIngredients(scale);
    isSyncing = false;
  }

  servingsInput.addEventListener('input', syncFromServings);
  ingredientInputs.forEach(input => {
    input.addEventListener('input', () => syncFromIngredient(input));
  });

  const resetButton = calculator.querySelector('.reset-calculator');
  if (resetButton) {
    resetButton.addEventListener('click', function (event) {
      event.preventDefault();
      isSyncing = true;
      servingsInput.value = defaultServings;
      updateIngredients(1);
      isSyncing = false;
    });
  }
}
