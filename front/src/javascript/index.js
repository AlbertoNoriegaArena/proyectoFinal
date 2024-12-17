$(document).ready(function () {

    // Inicializar la tabla cuando la página cargue
    cargarTablaProductos();

    //Botón agregar producto
    $('.agregarProducto').on('click', function () {

        Swal.fire({
            title: 'Nuevo Producto',
            html: `
                <form id="formNuevoProducto">
                    <div class="my-4">
                        <label for="nombre" class="form-label">Nombre del producto</label>
                        <input type="text" id="nombre" class="form-control" placeholder="Nombre del producto">
                    </div>
                    <div class="my-4">
                         <label for="descripcion" class="form-label">Descripción</label>
                         <textarea id="descripcion" class="form-control" placeholder="Descripción" rows="4" cols="50"></textarea>
                    </div>
                    <div class="my-4">
                        <label for="cantidad" class="form-label">Cantidad</label>
                        <input type="number" id="cantidad" class="form-control" placeholder="Cantidad">
                    </div>
                    <div class="my-4">
                        <label for="precio" class="form-label">Precio</label>
                        <input type="number" id="precio" class="form-control" placeholder="Precio en €">
                    </div>
                </form>
            `,
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

                // Validación campos vacíos
                if (!nombre || !descripcion || !cantidad || !precio) {
                    Swal.showValidationMessage('Por favor, complete todos los campos');
                    return false;
                }

                // Validaciones adicionales con lo que tenemos en el backend
                if (nombre.length > 30) {
                    Swal.showValidationMessage('El nombre no debe exceder los 30 caracteres');
                    return false;
                }
                if (descripcion.length > 150) {
                    Swal.showValidationMessage('La descripción no debe exceder los 150 caracteres');
                    return false;
                }
                if (cantidad < 0) {
                    Swal.showValidationMessage('La cantidad debe ser un número positivo');
                    return false;
                }
                if (precio < 0) {
                    Swal.showValidationMessage('El precio debe ser un número positivo');
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
                            text: `${datos.nombre} agregado con éxito.`,
                            confirmButtonText: 'Aceptar'
                        });

                        // Refrescar la tabla después de añadir producto
                        cargarTablaProductos();
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al agregar el producto',
                            text: 'Hubo un problema al agregar el producto. Intente nuevamente.',
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
            let fila = `<tr>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precio}</td>
                <td><button type="button" class="btn btn-primary VerProducto">Ver Producto</button></td> 
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
