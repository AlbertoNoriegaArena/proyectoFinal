package es.santander.ascender;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;
import java.util.NoSuchElementException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class OperacionesProductosTest {

    private OperacionesProductos ListaProductos;

    private Producto producto1;
    private Producto producto2;

    @BeforeEach
    void setUp() {

        ListaProductos = new OperacionesProductos();

        producto1 = new Producto(1, "Producto A", "Descripción A", 10, 100.0f);
        producto2 = new Producto(2, "Producto B", "Descripción B", 0, 150.0f); // Producto sin stock

        // Agrega los productos a la lista
        ListaProductos.getProductos().put(1L, producto1); 
        ListaProductos.getProductos().put(2L, producto2); 
    }

    @Test
    void testAgregarProducto() {
        
        Producto producto = new Producto(3,"Producto 3", "Descripción 3", 10, 50.0f);
        
        ListaProductos.agregarProducto(producto);
    
        long idAgregado = ListaProductos.getProductos().keySet().stream().max(Long::compare).get();
        Producto productoAgregado = ListaProductos.verProducto(idAgregado);
        
        assertEquals("Producto 3", productoAgregado.getNombre());
        assertEquals("Descripción 3", productoAgregado.getDescripcion());
        assertEquals(10, productoAgregado.getCantidad());
        assertEquals(50.0f, productoAgregado.getPrecio(), 0.01f); 
    }

    @Test
    void testBorrarProducto() {

        Producto productoAntesDeBorrar = ListaProductos.verProducto(1);
        assertEquals("Producto A", productoAntesDeBorrar.getNombre());

        ListaProductos.borrarProducto(1);

        assertThrows(NoSuchElementException.class, () -> ListaProductos.verProducto(1));
    }

    @Test
    void testComprarProducto() {
        //Compra valida
        ListaProductos.comprarProducto(1);
        assertEquals(9, producto1.getCantidad());

        //compra no valida => producto id:2 cantidad=0
        assertThrows(IllegalArgumentException.class, () -> ListaProductos.comprarProducto(2));
    }

    @Test
    void testComprarProductoCantidad() {
        //Compra valida
        ListaProductos.comprarProductoCantidad(1, 3);
        // prodcuto1 => cantidad 10 -3 =7 
        assertEquals(7, producto1.getCantidad()); 

        // Caso donde no hay suficiente stock
        assertThrows(IllegalArgumentException.class, () -> ListaProductos.comprarProductoCantidad(1, 15)); 
        //compra no valida => producto id:2 cantidad=0
        assertThrows(IllegalArgumentException.class, () -> ListaProductos.comprarProductoCantidad(2, 1)); 
    }

    @Test
    void testReponerUnidades() {
        Producto productoAntesDeReponer = ListaProductos.verProducto(1);

        productoAntesDeReponer.setCantidad(100);
        // Llamar al método para reponer 50 unidades
        ListaProductos.reponerUnidades(1, 50);

        // Comprobar que la cantidad del producto es 150 después de la reposición
        assertEquals(150, productoAntesDeReponer.getCantidad());
    }

    @Test
    void testEditarProducto() {
        // Crear un producto de ejemplo para editar
        Producto productoEditado = new Producto(1, "Producto a editar", "Descripción a editar", 5, 80.0f);
        
        // Editar el producto con id 1
        ListaProductos.editarProducto(1, productoEditado);

        Producto productoActualizado = ListaProductos.verProducto(1);
        
        // Verificar que los campos se han actualizado correctamente
        assertEquals("Producto a editar", productoActualizado.getNombre());
        assertEquals("Descripción a editar", productoActualizado.getDescripcion());
        assertEquals(5, productoActualizado.getCantidad());
        assertEquals(80.0f, productoActualizado.getPrecio(), 0.01f);

        assertThrows(IllegalArgumentException.class, () -> ListaProductos.editarProducto(2, new Producto(2, null, "Des", 10, 100.0f))); 
        assertThrows(IllegalArgumentException.class, () -> ListaProductos.editarProducto(2, new Producto(2, "Producto", null, 10, 100.0f))); 
        assertThrows(IllegalArgumentException.class, () -> ListaProductos.editarProducto(2, new Producto(2, "Producto", "Des", -1, 100.0f))); 
        assertThrows(IllegalArgumentException.class, () -> ListaProductos.editarProducto(2, new Producto(2, "Producto", "Des", 10, -1))); 


    }

    @Test
    void testVerProducto() {
        // producto de id 1 que existe
        Producto producto = ListaProductos.verProducto(1);
        assertEquals("Producto A", producto.getNombre());
        assertEquals("Descripción A", producto.getDescripcion());
        assertEquals(10, producto.getCantidad());
        assertEquals(100.0f, producto.getPrecio(), 0.01f);

        // Id que no existe
        assertThrows(NoSuchElementException.class, () -> ListaProductos.verProducto(10)); 
    }

    @Test
    public void testListarProductosDisponibles() {
        // Obtener productos disponibles
        Map<Long, Producto> productosDisponibles = ListaProductos.listarProductosDisponibles();

        // De los dos prodcutos solo el 1 está en stock
        assertEquals(1, productosDisponibles.size()); 

        // Verificar que producto2 no está en la lista (porque tiene 0 cantidad)
        assertFalse(productosDisponibles.containsValue(producto2));

        // Verificar que producto1 está en la lista
        assertTrue(productosDisponibles.containsValue(producto1));
    }
}
