const $ = (selector) => document.getElementById(selector);

const $form = $("form");
const $list = $("list");
const $card = $("card");
const $submitButton = $("submit-button");
const $errorMessage = $("error-message");

const getPokemonData = async (pokemon) => {
  try {
    const URL = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    const response = await fetch(URL);
    if (!response.ok) throw new Error(response.status);
    const data = await response.json();
    return {
      img: data?.sprites?.other?.dream_world?.front_default,
      name: data?.name,
      hp: data?.stats[0]?.base_stat,
      experience: data?.base_experience,
      attack: data?.stats[1]?.base_stat,
      defense: data?.stats[2]?.base_stat,
      special: data?.stats[3]?.base_stat,
    };
  } catch (error) {
    showError(error);
  }
};

const showError = (error) => {
  $submitButton.removeAttribute("aria-busy");
  $submitButton.removeAttribute("disabled");
  const message = `
    <h4>${error}</h4>
    <h5>Oops! it seems that pokemon does not exist</h5>
  `;
  $card.innerHTML = message;
};

$form.addEventListener("submit", (e) => {
  e.preventDefault();
  if ($form.search.value.trim() === "") {
    $errorMessage.style.display = "block";
  } else {
    $errorMessage.style.display = "none";
    $submitButton.setAttribute("aria-busy", true);
    $submitButton.setAttribute("disabled", true);
    getPokemonData($form.search.value.toLowerCase().trim()).then((data) => {
      showPokemonData(data);
      $submitButton.removeAttribute("aria-busy");
      $submitButton.removeAttribute("disabled");
      $form.search.value = "";
    });
  }
});

const showPokemonData = (pokemon) => {
  const elementData = `
    <div class="card__img-container">
      <img
        src=${pokemon.img}
        alt=${pokemon.name} image
        class="card__img"
      />
    </div>
    <h1>${pokemon.name} <span class="card__hp">${pokemon.hp} hp</span></h1>
    <ul class="card__list">
      <li class="card__item">${pokemon.experience} <small>exp</small></li>
      <li class="card__item">${pokemon.attack} <small>attack</small></li>
      <li class="card__item">${pokemon.defense} <small>defense</small></li>
      <li class="card__item">${pokemon.special} <small>special</small></li>
    </ul>
  `;
  $card.innerHTML = elementData;
};
