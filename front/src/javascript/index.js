

// Solicitud GET con todos los productos
$.get('http://localhost:1234/api/productos', function(data) {
    
    data.forEach(function(producto) {
        let fila = `<tr>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.cantidad}</td>
            <td>${producto.precio}</td>
        </tr>`;
        $('#tablaProductos tbody').append(fila); 
    });
}).fail(function() {
    Swal.fire({
        icon: 'error',
        text: "Error al cargar los datos",
        confirmButtonText: 'Aceptar'
    });
});