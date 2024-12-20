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

    // Botón comprar producto
    $('#tablaProductos').on('click', '.comprarProducto', function () {
        const productoId = $(this).data('id');
        const productoNombre = $(this).closest('tr').find('td').first().text(); // Obtener el nombre del producto desde la tabla
        const productoCantidad = $(this).closest('tr').find('td:nth-child(3)').text();
        const productoPrecio = parseFloat($(this).closest('tr').find('td:nth-child(4)').text()); // Obtener el precio del producto y convertirlo a número

        // Si la cantidad es 0, mostrar mensaje de fuera de stock
        if (parseInt(productoCantidad) === 0) {
            Swal.fire({
                icon: 'warning',
                title: `Producto fuera de stock`,
                text: `Lo sentimos, ${productoNombre} no está disponible en este momento.`,
                confirmButtonText: 'Aceptar'
            });
            return; // Salir de la función para no mostrar el rango
        }


        // Mostrar un cuadro de confirmación para comprar el producto
        Swal.fire({
            title: `Comprar ${productoNombre}`,
            html: `
                <div>
                <label for="cantidad">Selecciona la cantidad a comprar (${productoCantidad} unidades en stock)</label>
                <div class="inputCantidadSeleccionada">
                <input id="cantidadRange" type="range" min="0" max="${productoCantidad}" value="0" class="swal2-input" 
                    oninput="updateValues(this.value, ${productoPrecio})">
                <input id="cantidadInput" type="number" min="0" max="${productoCantidad}" value="0" class="swal2-input"
                    oninput="updateValues(this.value, ${productoPrecio})">
                    </div>
                <p>Cantidad seleccionada: <span id="valorRango">0</span></p>
                <p>Coste total: <span id="coste">0.00</span></p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Sí, comprar',
            cancelButtonText: 'Cancelar',
            focusConfirm: false,
            width: 'auto', // Asegura que el modal no sea más grande de lo necesario
            preConfirm: () => {
                const cantidad = document.getElementById('cantidadInput').value;

                if (cantidad === 0) {
                    Swal.showValidationMessage('Por favor, selecciona al menos 1 unidad.');
                    return false;
                }
                return cantidad;

            }
        }).then((result) => {
            if (result.isConfirmed) {

                const cantidadSeleccionada = result.value;

                // Realizar la solicitud POST para realizar la compra
                $.ajax({
                    url: `http://localhost:1234/api/productos/${productoId}/compra`,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(cantidadSeleccionada), // Enviar la cantidad seleccionada en el cuerpo de la solicitud
                    success: function (datos) {
                        // Cuando la compra se realiza, datos contiene la respuesta del servidor
                        Swal.fire({
                            icon: 'success',
                            title: datos,
                            confirmButtonText: 'Aceptar'
                        });

                        // Refrescar la tabla después de comprar el producto
                        cargarTablaProductos();
                    },
                    error: function (xhr, status, error) {
                        if (xhr.status === 400) {
                            Swal.fire({
                                icon: 'error',
                                title: xhr.responseText,
                                confirmButtonText: 'Aceptar'
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al comprar el producto',
                                text: 'Hubo un problema al realizar la compra. Intenta nuevamente.',
                                confirmButtonText: 'Aceptar'
                            });
                        }
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
                <td>
                    <button type="button" class="btn btn-primary verProducto" data-id="${producto.id}">  <i class="fas fa-eye"></i></button>
                    <button type="button" class="btn btn-danger borrarProducto" data-id="${producto.id}"> <i class="fas fa-trash"></i></button>
                    <button type="button" class="btn btn-info comprarProducto" data-id="${producto.id}"> <i class="fas fa-shopping-cart"></i></button>
                </td> 
            </tr>`;
            $('#tablaProductos tbody').append(fila);
        });

        // Inicializar DataTable con los nuevos datos
        $('#tablaProductos').DataTable({
            "destroy": true,
            "responsive": true,
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
            "columnDefs": [
                {
                    "targets": [0],  // Columna 0 (nombre del producto)
                    "width": "20%"    // Definir el ancho al 20%
                },
                {
                    "targets": [1],  // Columna 1 (descripción)
                    "width": "30%"    // Definir el ancho al 30%
                },
                {
                    "targets": [2],  // Columna 2 (cantidad)
                    "width": "10%"    // Definir el ancho al 10%
                },
                {
                    "targets": [3],  // Columna 3 (precio)
                    "width": "10%"    // Definir el ancho al 15%
                },
                {
                    "targets": [4], // Columnas de los botones
                    "width": "20%"    // Definir el ancho al 10% para las columnas de los botones
                }
            ]
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
                        <input type="number" id="cantidad" class="form-control" placeholder="Cantidad" value="${producto.cantidad || 0}">
                    </div>
                    <div class="my-4">
                        <label for="precio" class="form-label">Precio</label>
                        <input type="number" id="precio" class="form-control" placeholder="Precio en €" value="${producto.precio || 0}">
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

// Función para actualizar tanto el rango como el input numérico de comprar
function updateValues(cantidadSeleccionada, productoPrecio) {

    document.getElementById('cantidadRange').value = cantidadSeleccionada;
    document.getElementById('cantidadInput').value = cantidadSeleccionada;

    document.getElementById('valorRango').innerText = cantidadSeleccionada;

    const coste = (cantidadSeleccionada * productoPrecio).toFixed(2);
    document.getElementById('coste').innerText = `${coste} €`;
}