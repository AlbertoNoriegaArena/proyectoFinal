package es.santander.ascender;

import java.util.Map;

public class App {

    public static void main(String[] args) {

        // Crear instancia de OperacionesProductos
        OperacionesProductos ListaProductos = new OperacionesProductos();

        // Crear algunos productos
        Producto producto1 = new Producto(1L, "Producto 1", "Descripción 1", 10, 100.0f);
        Producto producto2 = new Producto(2L, "Producto 2", "Descripción 2", 5, 200.0f);

        // Agregar productos a la lista
        ListaProductos.agregarProducto(producto1);
        ListaProductos.agregarProducto(producto2);

        // Mostrar productos agregados
        System.out.println("Productos en el sistema:");
        mostrarProductos(ListaProductos.getProductos());

        // Comprar 3 unidades del producto 1
        System.out.println("\nComprando 3 unidades de Producto 1");
        ListaProductos.comprarProductoCantidad(1, 3); // Aquí, el id debería ser el correspondiente al producto1
        System.out.println("Cantidad del producto 1 después de la compra: " + ListaProductos.verProducto(1).getCantidad());

        // Edición del producto 2 
        System.out.println("\nEditando Producto 2");
        Producto productoEditado = new Producto(2L, "Producto 2 Editado", "Descripción Editada", 10, 250.0f);
        ListaProductos.editarProducto(2, productoEditado);

        // Mostrar productos después de la edición
        System.out.println("Producto 2 después de la edición:");
        System.out.println("Nombre: " + ListaProductos.verProducto(2).getNombre());
        System.out.println("Nombre: " + ListaProductos.verProducto(2).getDescripcion());
        System.out.println("Cantidad: " + ListaProductos.verProducto(2).getCantidad());
        System.out.println("Precio: " + ListaProductos.verProducto(2).getPrecio());

        // Reponer unidades de producto 1
        System.out.println("\nReponiendo 5 unidades al Producto 1");
        ListaProductos.reponerUnidades(1, 5);
        System.out.println("Cantidad producto 1 después de la reposición:");
        System.out.println("Cantidad: " + ListaProductos.verProducto(1).getCantidad());

        // Borrar un producto
        System.out.println("\nBorrando Producto 2");
        ListaProductos.borrarProducto(2);

        // Verificar si el producto fue borrado (esto debería lanzar una excepción)
        try {
            ListaProductos.verProducto(2);
        } catch (Exception e) {
            System.out.println("Error al ver Producto 2: " + e.getMessage());
        }
    }

    // Método auxiliar para mostrar productos
    private static void mostrarProductos(Map<Long, Producto> productos) {
        for (Map.Entry<Long, Producto> entry : productos.entrySet()) {
            Producto producto = entry.getValue();
            System.out.println("ID: " + entry.getKey() + ", Nombre: " + producto.getNombre() + ", Descripción: " + producto.getDescripcion() + ", Precio: "
                    + producto.getPrecio() + ", Cantidad: " + producto.getCantidad());
        }
    }
}
