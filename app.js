document.getElementById('url-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const url = document.getElementById('url').value;

    // Verifica que la URL sea válida
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alert('Por favor, ingrese una URL válida que comience con http:// o https://');
        return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const htmlText = await response.text();

        // Crear un documento virtual para manipular el DOM
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Remover las hojas de estilo actuales y añadir la de Bootstrap
        const links = doc.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => link.remove());

        // Añadir la hoja de estilo de Bootstrap
        const bootstrapLink = doc.createElement('link');
        bootstrapLink.rel = 'stylesheet';
        bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">';
        doc.head.appendChild(bootstrapLink);

        // Agregar clases de Bootstrap a elementos comunes
        const elementsToConvert = doc.querySelectorAll('table, button, input, div');
        elementsToConvert.forEach(element => {
            switch (element.tagName.toLowerCase()) {
                case 'table':
                    element.classList.add('table', 'table-striped');
                    break;
                case 'button':
                    element.classList.add('btn', 'btn-primary');
                    break;
                case 'input':
                    element.classList.add('form-control');
                    break;
                case 'div':
                    element.classList.add('container', 'mt-4');
                    break;
            }
        });

        // Mostrar el HTML convertido en el textarea
        const output = document.getElementById('output');
        const htmlContent = doc.documentElement.outerHTML;
        output.innerHTML = `
            <h2>Página Convertida:</h2>
            <textarea id="html-content" rows="10" cols="80">${escapeHTML(htmlContent)}</textarea>
            <button id="copy-btn">Copiar Código</button>
        `;

        // Añadir funcionalidad para copiar al portapapeles
        document.getElementById('copy-btn').addEventListener('click', function () {
            const textarea = document.getElementById('html-content');
            textarea.select();
            document.execCommand('copy');
            alert('Código copiado al portapapeles!');
        });

    } catch (error) {
        console.error('Error al obtener la URL:', error);
        alert('Hubo un problema al cargar la URL. Revisa la consola para más detalles.');
    }
});

function escapeHTML(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}