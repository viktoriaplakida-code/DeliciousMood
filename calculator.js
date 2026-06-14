const servingsInput = document.getElementById("servings");

const ingredientInputs = document.querySelectorAll(".ingredient-input");

const defaultServings = 4;

function updateIngredientsByServings() {

    const servings = Number(servingsInput.value);

    ingredientInputs.forEach(input => {

        const base = Number(input.dataset.base);

        input.value = Math.round(
            (base * servings) / defaultServings
        );

    });

}

servingsInput.addEventListener(
    "input",
    updateIngredientsByServings
);

ingredientInputs.forEach(changedInput => {

    changedInput.addEventListener("input", () => {

        const newValue = Number(changedInput.value);

        const base = Number(changedInput.dataset.base);

        const ratio = newValue / base;

        ingredientInputs.forEach(input => {

            const currentBase = Number(input.dataset.base);

            input.value = Math.round(
                currentBase * ratio
            );

        });

        servingsInput.value = Math.round(
            defaultServings * ratio
        );

    });

});

document
    .getElementById("resetBtn")
    .addEventListener("click", () => {

        servingsInput.value = defaultServings;

        ingredientInputs.forEach(input => {

            input.value = input.dataset.base;

        });

    });