package es.santander.ascender;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

public class OperacionesProductos {

    private Map<Long, Producto> ListaProductos = new HashMap<>();

    public void agregarProducto(Producto producto) {
        // Si el mapa está vacío, asignamos el primer id como 1
        long nuevoId = ListaProductos.isEmpty() ? 1 : ListaProductos.keySet().stream().max(Long::compare).get() + 1;
    
        // Agregar el producto con el nuevo id generado
        ListaProductos.put(nuevoId, producto);
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

    public void comprarProductoCantidad(long id, int cantidadAComprar) {
        if (!ListaProductos.containsKey(id)) {
            throw new NoSuchElementException("No se encontró el producto con ID: " + id);
        } else {
            Producto productoAComprar = ListaProductos.get(id);
            if (productoAComprar.getCantidad() ==0 ) {
                throw new IllegalArgumentException("No puedes comprar un producto del que no hay stock");
            } else if (productoAComprar.getCantidad() < cantidadAComprar ) {
                throw new IllegalArgumentException("No hay suficiente stock. Solo hay disponibles " + productoAComprar.getCantidad() + " unidades" );
            } else {
                productoAComprar.setCantidad(productoAComprar.getCantidad() - cantidadAComprar);
            }
        }
    }

    public void reponerUnidades(long id, int cantidadAReponer) {
        if (!ListaProductos.containsKey(id)) {
            throw new NoSuchElementException("No se encontró el producto con ID: " + id);
        } else {
            Producto productoAReponer = ListaProductos.get(id);
            
            productoAReponer.setCantidad(productoAReponer.getCantidad() + cantidadAReponer);
        }
    }

    public Map<Long, Producto> listarProductosDisponibles() {
        Map<Long, Producto> productosDisponibles = new HashMap<>();
        for (Map.Entry<Long, Producto> entry : ListaProductos.entrySet()) {
            if (entry.getValue().getCantidad() > 0) {
                productosDisponibles.put(entry.getKey(), entry.getValue());
            }
        }
        return productosDisponibles;
    }

    public Map<Long, Producto> getProductos() {
        return ListaProductos;
    }

    public void setProductos(Map<Long, Producto> productos) {
        this.ListaProductos = productos;
    }

}
