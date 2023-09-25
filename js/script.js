// Función para mostrar el modal con la información del personaje
function mostrarModal(personaje) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');

    // Construir el contenido del modal
    modalContent.innerHTML = `
        <p><strong>Nombre:</strong> ${personaje.name}</p>
        <p><strong>Estado:</strong> ${personaje.status}</p>
        <p><strong>Especie:</strong> ${personaje.species}</p>
        <p><strong>Origen:</strong> ${personaje.originName}</p>
        <p><strong>Episodios:</strong> ${personaje.episodes.join(', ')}</p>
        <img src="${personaje.image}" alt="${personaje.name}">
    `;

    modal.style.display = 'block'; // Mostrar el modal

    // Cerrar el modal al hacer clic en el botón "Cerrar"
    document.getElementById('cerrarModal').addEventListener('click', function () {
        modal.style.display = 'none'; // Ocultar el modal
    });
}

// Agregar evento hover a la imagen para cambiar el cursor
document.getElementById('resultado').addEventListener('mouseover', function (e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.cursor = 'pointer'; // Cambiar el cursor a una mano al pasar sobre la imagen
    }
});

// Agregar evento click a la imagen para mostrar el modal
document.getElementById('resultado').addEventListener('click', function (e) {
    if (e.target.tagName === 'IMG') {
        // Obtener la información del personaje a partir de los datos del atributo 'data-personaje'
        const personaje = JSON.parse(e.target.getAttribute('data-personaje'));
        mostrarModal(personaje); // Mostrar el modal con la información del personaje
    }
});

// Función para obtener información de la localización y residentes
async function obtenerInformacion() {
    try {
        const localizacionId = document.getElementById('localizacionId').value;

        // Realizar una solicitud a la API de Rick & Morty para obtener la localización
        const localizacionResponse = await fetch(`https://rickandmortyapi.com/api/location/${localizacionId}`);
        const localizacionData = await localizacionResponse.json();

        // Verificar el ID de la localización y establecer el color de fondo
        const backgroundColor = obtenerColorFondo(localizacionData.id);

        // Actualizar el color de fondo de la página
        document.body.style.backgroundColor = backgroundColor;

        // Obtener los 5 primeros residentes
        const residentes = localizacionData.residents.slice(0, 5);

        // Recorrer los residentes y obtener la información requerida
        const residentesInfo = [];
        for (const residentUrl of residentes) {
            const residentResponse = await fetch(residentUrl);
            const residentData = await residentResponse.json();
            const episodios = await obtenerEpisodios(residentData.episode.slice(0, 3));
            residentesInfo.push({
                name: residentData.name,
                status: residentData.status,
                species: residentData.species,
                originName: residentData.origin.name,
                image: residentData.image,
                episodes: episodios
            });
        }

        // Ordenar residentes alfabéticamente
        residentesInfo.sort((a, b) => a.name.localeCompare(b.name));

        // Mostrar la información de los residentes en la página
        mostrarInformacionResidentes(residentesInfo);
    } catch (error) {
        console.error('Error al obtener la información:', error);
    }
}

// Función para obtener episodios por URL
async function obtenerEpisodios(episodioUrls) {
    const episodios = [];
    for (const episodioUrl of episodioUrls) {
        const episodioResponse = await fetch(episodioUrl);
        const episodioData = await episodioResponse.json();
        episodios.push(episodioData.name);
    }
    return episodios;
}

// Función para determinar el color de fondo según el ID de la localización
function obtenerColorFondo(localizacionId) {
    if (localizacionId < 50) {
        return 'green';
    } else if (localizacionId >= 50 && localizacionId < 80) {
        return 'blue';
    } else {
        return 'red';
    }
}

// Función para mostrar la información de los residentes en la página
function mostrarInformacionResidentes(residentesInfo) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = ''; // Limpiar el contenido anterior

    // Recorrer la información de los residentes y crear elementos HTML para cada uno
    residentesInfo.forEach((personaje, index) => {
        const personajeDiv = document.createElement('div');
        personajeDiv.classList.add('personaje');

        // Crear una imagen con un atributo 'data-personaje' que contiene la información del personaje en formato JSON
        const imagen = document.createElement('img');
        imagen.src = personaje.image;
        imagen.alt = personaje.name;
        imagen.setAttribute('data-personaje', JSON.stringify(personaje)); // Almacenar la información del personaje como un atributo de datos

        // Mostrar el nombre del personaje debajo de la imagen
        const nombre = document.createElement('p');
        nombre.textContent = personaje.name;

        // Agregar la imagen y el nombre al contenedor del personaje
        personajeDiv.appendChild(imagen);
        personajeDiv.appendChild(nombre);

        // Agregar el contenedor del personaje al resultado
        resultadoDiv.appendChild(personajeDiv);
    });
}

// Llamar a la función cuando se envíe el formulario
document.getElementById('formulario').addEventListener('submit', function (e) {
    e.preventDefault();
    obtenerInformacion();
});