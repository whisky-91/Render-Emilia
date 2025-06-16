document.addEventListener("DOMContentLoaded", () => {
  // Espera a que el DOM esté cargado
  document.body.classList.add("bg-white");
  const app = document.getElementById("app"); // Busca el div con ID `app`
  if (app) {
    // y coloca un mensaje de estado inicial.
    app.innerHTML = `<p class="text-success">¡Frontend listo y esperando datos de Sakila!</p>`;
  }
});

// Se define la estructura esperada de los objetos de tipo película.
interface Film {
  // Aun así, más abajo se usa Record<string, any>[]
  film_id: number; // en vez de `Film[]`, lo que indica que la
  title: string; // respuesta real puede tener campos adicionales
  description: string | null; // o no conocidos.
  release_year: number | null;
  language_id: number;
  rental_duration: number;
  rental_rate: number;
  length: number | null;
  replacement_cost: number;
  rating: string | null;
}

// Valores globales
let filmsData: Record<string, any>[] = []; // Todas las películas cargadas desde la API
let filteredFilms: Record<string, any>[] = []; // Películas que están siendo mostradas actualmente

let currentPage = 1; // Página actual de la paginación
const pageSize = 10; // Número de resultados por página

// Carga todas las películas de la base de datos.
const loadFilms = async () => {
  try {
    //Realiza un fetch HTTP GET a /api/films
    const response = await fetch("/api/films");
    filmsData = await response.json(); // Guarda los resultados
    filteredFilms = [...filmsData];
    renderFilms(); // Lamada a la función para mostrar los resultados
    renderPagination();
  } catch (error) {
    // Captura el error, de haberlo
    console.error("Error al cargar películas:", error); // Muestra el error en consola
  }
};

// Carga las películas disponibles
const loadAvailableFilms = async () => {
  try {
    const response = await fetch("/api/films/available");
    filmsData = await response.json();
    filteredFilms = [...filmsData];
    renderFilms();
    renderPagination();
  } catch (error) {
    console.error("Error al cargar películas disponibles:", error);
  }
};

// Filtra películas por **título** o **descripción**, sin distinguir mayúsculas/minúsculas
const filterFilms = (searchTerm: string) => {
  if (!searchTerm) {
    filteredFilms = [...filmsData];
  } else {
    const term = searchTerm.toLowerCase();
    filteredFilms = filmsData.filter(
      (film) =>
        film.title.toLowerCase().includes(term) ||
        (film.description && film.description.toLowerCase().includes(term))
    );
  }
  currentPage = 1; // Reinicia la paginación a la primera página después de filtrar
  renderFilms(); // Se carga la tabla
  renderPagination(); // Se carga la paginación
};

const renderFilms = () => {
  // Se declara una función anónima de flecha
  const app = document.getElementById("app"); // Busca el elemento HTML con el id="app"
  if (!app) return; // Si no existe, se cancela la ejecución con return

  if (filteredFilms.length === 0) {
    app.innerHTML = `
      <div class="mb-3 d-flex align-items-center flex-wrap gap-2">
        <button id="btn-all-films" class="btn btn-outline-primary">Películas</button>
        <button id="btn-available-films" class="btn btn-outline-success">Stock</button>
        <div class="input-group" style="width: 350px;">
          <input type="text" id="search-input" class="form-control" placeholder="Buscar por título o descripción...">
          <button class="btn btn-primary" type="button" id="filter-button">
            Filtrar
          </button>
          <button class="btn btn-outline-danger" type="button" id="clear-search">
            Limpiar
          </button>
        </div>
      </div>
      <p class="text-warning">No se encontraron resultados.</p>
    `;
    setupViewButtons();
    setupSearchInput();
    return;
  }

  const startIndex = (currentPage - 1) * pageSize; // Índice del primer elemento de la página actual
  const paginatedFilms = filteredFilms.slice(startIndex, startIndex + pageSize);

  // Extrae nombres de claves que serán los nombres de las columnas en la tabla
  const columnNames = Object.keys(paginatedFilms[0]);

  // Renderizado de botones e input
  const buttons = `
    <div class="mb-3 d-flex align-items-center flex-wrap gap-2">
      <button id="btn-all-films" class="btn btn-outline-primary">Películas</button>
      <button id="btn-available-films" class="btn btn-outline-success">Stock</button>
      <div class="input-group" style="width: 350px;">
        <input type="text" id="search-input" class="form-control" placeholder="Buscar por título o descripción...">
        <button class="btn btn-primary" type="button" id="filter-button">
          Filtrar
        </button>
        <button class="btn btn-primary" type="button" id="clear-search">
          Limpiar
        </button>
      </div>
      <span class="badge bg-info ms-2">${filteredFilms.length} resultados</span>
    </div>
  `;

  // Tabla dinámica y paginación al final
  const table = `
    ${buttons}
    <table class="table table-success table-striped">
      <thead class="table-dark">
        <tr>
          ${columnNames
            .map((col) => `<th>${col.replace("_", " ").toUpperCase()}</th>`)
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${paginatedFilms
          .map(
            (film) => `
          <tr>
            ${columnNames.map((col) => `<td>${film[col] ?? ""}</td>`).join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <div id="pagination" class="d-flex justify-content-center mt-3"></div>
  `;

  // Inyección en el DOM
  app.innerHTML = table;
  renderPagination(); // Muestra los botones de navegación de páginas
  setupViewButtons(); // Asocia eventos a los botones de "Todas las películas" y "Disponibles"
  setupSearchInput(); // Asocia eventos al campo de búsqueda y sus botones
};

const renderPagination = () => {
  // Se busca el elemento con id="pagination"
  const paginationDiv = document.getElementById("pagination");
  if (!paginationDiv) return; // Si no existe ese elemento en el DOM, se detiene la ejecución

  // Calcula el total de páginas necesarias
  const totalPages = Math.ceil(filteredFilms.length / pageSize);
  // Es la cantidad máxima de botones numerados visibles en la paginación (configurable)
  const maxVisible = 7;
  let buttons = "";

  // Si solo hay una página, no mostrar nada
  if (totalPages <= 1) {
    paginationDiv.innerHTML = "";
    return;
  }

  // Si no estamos en la primera página, se muestra el botón para ir a la página 1
  if (currentPage > 1) {
    buttons += `<button class="btn btn-outline-secondary me-2" data-page="1">1</button>`;
    // Si estamos más allá de la página 2, se agrega "..." para indicar que hay
    // páginas anteriores no mostradas.
    if (currentPage > 2) {
      buttons += `<span class="me-2 align-self-center">...</span>`;
    }
  }

  // Cálculo del rango de páginas visibles
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  // Botones numéricos del rango visible
  for (let i = startPage; i <= endPage; i++) {
    buttons += `<button class="btn ${
      i === currentPage ? "btn-primary" : "btn-outline-primary"
    } me-1" data-page="${i}">${i}</button>`;
  }

  // Botón con número de la última página (si no está visible ya)
  if (currentPage < totalPages && endPage < totalPages) {
    if (currentPage < totalPages - 1) {
      buttons += `<span class="me-1 align-self-center">...</span>`;
    }
    buttons += `<button class="btn btn-outline-secondary" data-page="${totalPages}">${totalPages}</button>`;
  }

  // El HTML acumulado se coloca dentro del contenedor de paginación
  paginationDiv.innerHTML = buttons;

  // Eventos de cambio de página
  // Se buscan todos los botones que tengan el atributo data-page
  const allButtons = paginationDiv.querySelectorAll("button[data-page]");
  allButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Se les asigna un evento click
      // Obtiene el número de página desde el atributo
      const page = Number(btn.getAttribute("data-page"));
      if (!isNaN(page)) {
        currentPage = page; // Actualiza currentPage
        renderFilms(); // Vuelve a renderizar el contenido con la nueva página
      }
    });
  });
};

// Agrega eventos a los botones para cargar los datos correspondientes
const setupViewButtons = () => {
  const btnAll = document.getElementById("btn-all-films");
  const btnAvailable = document.getElementById("btn-available-films");

  btnAll?.addEventListener("click", () => {
    currentPage = 1;
    loadFilms();
  });

  btnAvailable?.addEventListener("click", () => {
    currentPage = 1;
    loadAvailableFilms();
  });
};

// Funcionalidad de filtro
const setupSearchInput = () => {
  const searchInput = document.getElementById(
    "search-input"
  ) as HTMLInputElement;
  const filterButton = document.getElementById("filter-button");
  const clearSearch = document.getElementById("clear-search");

  // Filtrar al presionar el botón "Filtrar"
  if (filterButton) {
    filterButton.addEventListener("click", () => {
      if (searchInput) {
        filterFilms(searchInput.value);
      }
    });
  }

  if (searchInput) {
    // Permitir búsqueda al presionar Enter
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        filterFilms(searchInput.value);
      }
    });
  }

  // Limpiar el campo y restaurar todos los datos al hacer clic en "Limpiar"
  if (clearSearch) {
    clearSearch.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      filterFilms("");
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  loadFilms();
});
