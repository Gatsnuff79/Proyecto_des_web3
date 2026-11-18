// Arreglo global donde se guardan los registros traídos desde MySQL
let pokemonGen5 = [];

// Mapa de sprites para los IDs 157 al 162 (Formas alternativas al final de tu tabla)
const spritesFormasAlternativas = {
    157: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10019.png', // Tornadus-Therian
    158: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10020.png', // Thundurus-Therian
    159: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10021.png', // Landorus-Therian
    160: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10022.png', // Kyurem-Black
    161: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10023.png', // Kyurem-White
    162: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10018.png'  // Meloetta-Pirouette
};

// Función asíncrona que consulta nuestra API conectada a MySQL
async function obtenerPokemonDB() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/pokemon');
        pokemonGen5 = await respuesta.json();
        renderizarPokemon(pokemonGen5);
    } catch (error) {
        console.error('Error al conectar con el backend:', error);
        document.getElementById('contenedorResultados').innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger fw-bold">
                    No se pudo conectar con la API. Asegúrate de ejecutar "node server.js" en la carpeta backend.
                </div>
            </div>
        `;
    }
}

// Función que construye y dibuja las tarjetas de Bootstrap en el DOM
function renderizarPokemon(lista) {
    const contenedor = document.getElementById('contenedorResultados');
    contenedor.innerHTML = '';

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-4">
                <p class="text-muted fs-5">No se encontraron Pokémon que coincidan con tu búsqueda.</p>
            </div>
        `;
        return;
    }

    lista.forEach(poke => {
        // Victini es ID 1 en Pokemon_gen5 y #494 en la Pokédex Nacional (493 + 1 = 494)
        const urlImagen = poke.Pokemon_ID <= 156
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${493 + poke.Pokemon_ID}.png`
            : (spritesFormasAlternativas[poke.Pokemon_ID] || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png');

        // Solo muestra el segundo tipo si es distinto de 'Nothing'
        const badgeTipo2 = (poke.Tipo2 && poke.Tipo2 !== 'Nothing')
            ? `<span class="badge bg-secondary ms-1">${poke.Tipo2}</span>`
            : '';

        contenedor.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 border-warning shadow-sm">
                    <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                        <span class="fw-bold">#${poke.Pokemon_ID} ${poke.Pokemon_Name}</span>
                        <small class="text-warning">${poke.Categoria || 'Unova'}</small>
                    </div>
                    <img src="${urlImagen}" class="sprite-pokemon mx-auto mt-3" alt="${poke.Pokemon_Name}">
                    <div class="card-body text-center d-flex flex-column justify-content-between">
                        <div>
                            <div class="mb-2">
                                <span class="badge bg-primary">${poke.Tipo1}</span>
                                ${badgeTipo2}
                            </div>
                            <p class="small text-muted mb-2">${poke.Descripcion || 'Sin descripción registrada.'}</p>
                            <p class="small mb-2">
                                <strong>Altura:</strong> ${poke.Altura ?? '-'} m | 
                                <strong>Peso:</strong> ${poke.Peso ?? '-'} kg
                            </p>
                            <p class="mb-3">
                                <strong>Habilidad:</strong> 
                                <span class="text-decoration-underline" style="cursor: help;" title="${poke.Habilidad_Desc}">${poke.Habilidad}</span>
                            </p>
                        </div>
                        <div class="bg-light p-2 rounded border small">
                            <div class="d-flex justify-content-around mb-1">
                                <span><strong>HP:</strong> ${poke.HP}</span>
                                <span><strong>ATK:</strong> ${poke.ATK}</span>
                                <span><strong>DEF:</strong> ${poke.DEF}</span>
                            </div>
                            <div class="d-flex justify-content-around">
                                <span><strong>SATK:</strong> ${poke.SATK}</span>
                                <span><strong>SDEF:</strong> ${poke.SDEF}</span>
                                <span><strong>SPD:</strong> ${poke.SPD}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// Función de Filtro DOM dinámico ejecutada al escribir en el input
function filtrarDOM() {
    const texto = document.getElementById('inputFiltro').value.toLowerCase();

    const filtrados = pokemonGen5.filter(poke =>
        poke.Pokemon_Name.toLowerCase().includes(texto) ||
        poke.Tipo1.toLowerCase().includes(texto) ||
        (poke.Tipo2 && poke.Tipo2.toLowerCase().includes(texto)) ||
        poke.Habilidad.toLowerCase().includes(texto) ||
        (poke.Categoria && poke.Categoria.toLowerCase().includes(texto))
    );

    renderizarPokemon(filtrados);
}

// Ejecuta la carga inicial al abrir la página
obtenerPokemonDB();