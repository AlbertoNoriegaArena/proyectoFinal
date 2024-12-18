$(document).ready(function () {

    // Inicializar la tabla cuando la página cargue
    cargarTablaProductos();

    //Botón agregar producto
    $('.agregarProducto').on('click', function () {
        Swal.fire({
            title: 'Nuevo Producto',
            html: crearFormularioProducto(),
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            focusConfirm: false,
            preConfirm: () => {
                // Capturar los valores del formulario
                const nombre = $("#nombre").val().trim();
                const descripcion = $("#descripcion").val().trim();
                const cantidad = $("#cantidad").val();
                const precio = $("#precio").val();

                // Validar los campos
                const validacion = validarFormulario(nombre, descripcion, cantidad, precio);
                if (validacion !== true) {
                    Swal.showValidationMessage(validacion);
                    return false;
                }

                return { nombre, descripcion, cantidad, precio };
            }
        }).then((datosFormulario) => {
            if (datosFormulario.isConfirmed) {
                console.log('Datos del formulario:', datosFormulario.value);

                // Realizar el POST a la API
                $.ajax({
                    url: 'http://localhost:1234/api/productos',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(datosFormulario.value), // Convertir el objeto a JSON
                    success: function (datos) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Producto agregado',
                            text: `${datos.nombre} agregado con éxito`,
                            confirmButtonText: 'Aceptar'
                        });

                        // Refrescar la tabla después de añadir producto
                        cargarTablaProductos();
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al agregar el producto',
                            text: 'Hubo un problema al agregar el producto. Intentalo de nuevo',
                            confirmButtonText: 'Aceptar'
                        });
                    }
                });
            }
        });

    });

    //Botón ver producto
    $('#tablaProductos').on('click', '.verProducto', function () {
        const productoId = $(this).data('id');

        // Obtener los datos del producto desde la API
        $.ajax({
            url: `http://localhost:1234/api/productos/${productoId}`,
            type: 'GET',
            success: function (producto) {
                // Mostrar el modal con los datos del producto
                Swal.fire({
                    title: `Producto: ${producto.nombre}`,
                    html: crearFormularioProducto(producto),
                    showCancelButton: true,
                    confirmButtonText: 'Actualizar',
                    cancelButtonText: 'Cancelar',
                    focusConfirm: false,
                    preConfirm: () => {
                        // Capturar los valores del formulario
                        const nombre = $("#nombre").val().trim();
                        const descripcion = $("#descripcion").val()
                        const cantidad = $("#cantidad").val();
                        const precio = $("#precio").val();

                        // Validar los campos
                        const validacion = validarFormulario(nombre, descripcion, cantidad, precio);
                        if (validacion !== true) {
                            Swal.showValidationMessage(validacion);
                            return false;
                        }

                        return { nombre, descripcion, cantidad, precio };
                    }
                }).then((datosFormulario) => {
                    if (datosFormulario.isConfirmed) {
                        console.log('Datos del formulario:', datosFormulario.value);

                        // Realizar el POST a la API
                        $.ajax({
                            url: `http://localhost:1234/api/productos/${productoId}`,
                            type: 'PUT',
                            contentType: 'application/json',
                            data: JSON.stringify(datosFormulario.value), // Convertir el objeto a JSON
                            success: function (datos) {
                                Swal.fire({
                                    icon: 'success',
                                    title: `${datos.nombre}`,
                                    text: `actualizado con éxito`,
                                    confirmButtonText: 'Aceptar'
                                });

                                // Refrescar la tabla después de añadir producto
                                cargarTablaProductos();
                            },
                            error: function () {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error al actualizar el producto',
                                    text: 'Hubo un problema al actualizar el producto. Intentalo de nuevo',
                                    confirmButtonText: 'Aceptar'
                                });
                            }
                        });
                    }
                });
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al obtener el producto',
                    text: 'Hubo un problema al obtener los datos del producto.',
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    });

    // Botón borrar producto
    $('#tablaProductos').on('click', '.borrarProducto', function () {
        const productoId = $(this).data('id');
        const productoNombre = $(this).closest('tr').find('td').first().text(); // Obtener el nombre del producto desde la tabla

        // Mostrar un cuadro de confirmación para borrar el producto
        Swal.fire({
            title: `¿Estás seguro de eliminar el producto ${productoNombre}?`,
            text: "¡Esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            focusConfirm: false
        }).then((result) => {
            if (result.isConfirmed) {
                // Realizar la solicitud DELETE para eliminar el producto
                $.ajax({
                    url: `http://localhost:1234/api/productos/${productoId}`,
                    type: 'DELETE',
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: 'Producto eliminado',
                            text: `${productoNombre} ha sido eliminado con éxito.`,
                            confirmButtonText: 'Aceptar'
                        });

                        // Refrescar la tabla después de borrar el producto
                        cargarTablaProductos();
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al eliminar el producto',
                            text: 'Hubo un problema al eliminar el producto. Intenta nuevamente.',
                            confirmButtonText: 'Aceptar'
                        });
                    }
                });
            }
        });
    });
});



function cargarTablaProductos() {

    // Si la tabla ya está inicializada, la destruimos y la volvemos a inicializar
    if ($.fn.DataTable.isDataTable('#tablaProductos')) {
        $('#tablaProductos').DataTable().clear().destroy(); // Destruir la tabla actual y limpiar los datos
    }

    // Solicitud GET para obtener los productos
    $.get('http://localhost:1234/api/productos', function (data) {
        // Llenar la tabla con los datos obtenidos
        data.forEach(function (producto) {

            let precioFormateado = parseFloat(producto.precio).toFixed(2);
            let fila = `<tr>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.cantidad}</td>
                <td>${precioFormateado}</td>
                <td> <button type="button" class="btn btn-primary verProducto" data-id="${producto.id}">Ver Producto</button> </td> 
                <td> <button type="button" class="btn btn-danger borrarProducto" data-id="${producto.id}">Borrar</button> </td> 
                <td> <button type="button" class="btn btn-info comprarProducto" data-id="${producto.id}">Comprar</button></td> 
            </tr>`;
            $('#tablaProductos tbody').append(fila);
        });

        // Inicializar DataTable con los nuevos datos
        $('#tablaProductos').DataTable({
            "pageLength": 5, // paginación a 5
            "lengthMenu": [5, 10, 25],
            "language": {
                "decimal": "",
                "emptyTable": "No hay datos disponibles en la tabla",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                "infoEmpty": "Mostrando 0 a 0 de 0 registros",
                "infoFiltered": "(filtrado de _MAX_ registros totales)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ registros",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "No se encontraron registros coincidentes",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                },
                "aria": {
                    "sortAscending": ": activar para ordenar la columna de manera ascendente",
                    "sortDescending": ": activar para ordenar la columna de manera descendente"
                }
            },
        });
    }).fail(function () {
        Swal.fire({
            icon: 'error',
            text: "Error al cargar los datos",
            confirmButtonText: 'Aceptar'
        });
    });
}

function crearFormularioProducto(producto = {}) {
    let formulario = `
        
                <form id="formNuevoProducto">
                    <div class="my-4">
                        <label for="nombre" class="form-label">Nombre del producto</label>
                        <input type="text" id="nombre" class="form-control" placeholder="Nombre del producto" value="${producto.nombre || ''}">
                    </div>
                    <div class="my-4">
                         <label for="descripcion" class="form-label">Descripción</label>
                         <textarea id="descripcion" class="form-control" placeholder="Descripción" rows="4" cols="50" >${producto.descripcion || ''}</textarea>
                    </div>
                    <div class="my-4">
                        <label for="cantidad" class="form-label">Cantidad</label>
                        <input type="number" id="cantidad" class="form-control" placeholder="Cantidad" value="${producto.cantidad || ''}">
                    </div>
                    <div class="my-4">
                        <label for="precio" class="form-label">Precio</label>
                        <input type="number" id="precio" class="form-control" placeholder="Precio en €" value="${producto.precio || ''}">
                    </div>
                </form>
    `;

    return formulario;
}

// Función de validación
function validarFormulario(nombre, descripcion, cantidad, precio) {
    if (!nombre || !descripcion || !cantidad || !precio) {
        return 'Por favor, complete todos los campos';
    }
    if (nombre.length > 30) {
        return 'El nombre no debe exceder los 30 caracteres';
    }
    if (descripcion.length > 150) {
        return 'La descripción no debe exceder los 150 caracteres';
    }
    if (cantidad < 0) {
        return 'La cantidad debe ser un número positivo';
    }
    if (precio < 0) {
        return 'El precio debe ser un número positivo';
    }
    return true; // Si pasa todas las validaciones, retorna true
}
