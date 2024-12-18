package es.santander.ascender;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

public class OperacionesProductos {

    private Map<Long, Producto> ListaProductos = new HashMap<>();

    public void agregarProducto(long id, Producto producto) {
        if (ListaProductos.containsKey(id)) {
            throw new IllegalArgumentException("El producto con el ID " + id + " ya existe");
        } else {
            ListaProductos.put(id, producto);
        }
    }

    public Producto verProducto(long id) {
        if (ListaProductos.containsKey(id)) {
            return ListaProductos.get(id);
        } else {
            throw new NoSuchElementException("No se encontró el producto con ID: " + id);
        }
    }

    public void editarProducto(long id, Producto producto) {

        if (!ListaProductos.containsKey(id)) {
            throw new NoSuchElementException("No se encontró el producto con ID: " + id);
        } else {
            // Obtener el producto existente en el mapa
            Producto productoExistente = ListaProductos.get(id);

            if (producto.getNombre() != null) {
                productoExistente.setNombre(producto.getNombre());
            } else {
                throw new IllegalArgumentException("El nombre no puede estar vacio");
            }

            if (producto.getDescripcion() != null) {
                productoExistente.setDescripcion(producto.getDescripcion());
            } else {
                throw new IllegalArgumentException("La descripción no puede estar vacia");
            }

            if (producto.getCantidad() >= 0) {
                productoExistente.setCantidad(producto.getCantidad());
            }  else {
                throw new IllegalArgumentException("La cantidad no puede ser negativa");
            }

            if (producto.getPrecio() >= 0) {
                productoExistente.setPrecio(producto.getPrecio());
            } else {
                throw new IllegalArgumentException("El precio no puede ser negativo");
            }
            
            // Actualizar datos
            ListaProductos.put(id, productoExistente);
        }
    }

    public void borrarProducto(long id) {
        if (ListaProductos.containsKey(id)) {
            ListaProductos.remove(id);
        } else {
            throw new NoSuchElementException("No se encontró el producto con ID: " + id);
        }
    }

    public void comprarProducto(long id) {
        if (!ListaProductos.containsKey(id)) {
            throw new NoSuchElementException("No se encontró el producto con ID: " + id);
        } else {
            Producto productoAComprar = ListaProductos.get(id);
            if (productoAComprar.getCantidad() ==0 ) {
                throw new IllegalArgumentException("No puedes comprar un producto del que no hay stock");
            } else  {
                productoAComprar.setCantidad(productoAComprar.getCantidad() - 1);
            }
        }
    }
}
