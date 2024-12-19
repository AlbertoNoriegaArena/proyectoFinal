package es.santander.ascender.individual.controller;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.santander.ascender.individual.model.Producto;
import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "/productos")
public class ProductoController {

    private Map<Long, Producto> productos = new HashMap<>();

    public ProductoController() {
        productos.put(1l, new Producto(1, "Producto A", "Descripción A", 100.0f, 10));
        productos.put(2l, new Producto(2, "Producto B", "Descripción B", 150.0f, 0));
        productos.put(3l, new Producto(3, "Producto C", "Descripción C", 200.0f, 5));
        productos.put(4l, new Producto(4, "Producto D", "Descripción D", 50.0f, 10));
        productos.put(5l, new Producto(5, "Producto E", "Descripción E", 150.0f, 0));
        productos.put(6l, new Producto(6, "Producto F", "Descripción F", 20.0f, 20));
    }


    @GetMapping("/{id}")
    public HttpEntity<Producto> get(@PathVariable("id") long id) {
        if (!productos.containsKey(id)) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok().body(productos.get(id));
        }
    }

    @GetMapping
    public HttpEntity<Collection<Producto>> get() {
        return ResponseEntity.ok().body(productos.values());
    }

    @PostMapping
    public ResponseEntity<Producto> create(@RequestBody Producto producto) {
        long cuenta = productos.values().size();
        
        long maxId = 0;
        if (cuenta != 0) {
            maxId = productos.values().stream()
                                .map(p -> p.getId())
                                .mapToLong(id -> id)
                                .max()
                                .orElse(0);
        }
        producto.setId(maxId + 1);

        productos.put(producto.getId(), producto);

        return ResponseEntity.status(HttpStatus.CREATED).body(producto);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Producto> update(@PathVariable Long id, @Valid @RequestBody Producto productoActualizado) {
        Producto productoExistente = productos.get(id);
        
        if (productoExistente == null) {
            return ResponseEntity.notFound().build();
        }
    
        productoExistente.setNombre(productoActualizado.getNombre());
        productoExistente.setDescripcion(productoActualizado.getDescripcion());
        productoExistente.setPrecio(productoActualizado.getPrecio());
        productoExistente.setCantidad(productoActualizado.getCantidad());
        
        return ResponseEntity.ok(productoExistente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Producto productoExistente = productos.get(id);

        if (productoExistente == null) {
            return ResponseEntity.notFound().build();
        }

        productos.remove(id);

        return ResponseEntity.noContent().build();
    }

    // Cambio de compra para que se pueda vender mas de una unidad
    @PostMapping("/{id}/compra")
    public ResponseEntity<String> comprarProductos(@PathVariable Long id, @Valid @RequestBody int cantidad) {
        Producto producto = productos.get(id);

        if (producto == null) {
            return ResponseEntity.notFound().build();
            
        }

        if (cantidad <= 0) {
            return ResponseEntity.badRequest().body("La cantidad debe ser mayor a 0.");
        }

        if (cantidad > producto.getCantidad() ) {
            return ResponseEntity.badRequest().body("Las cantidad introducida no está disponible en stock.");
        }

        producto.setCantidad(producto.getCantidad() - cantidad);

        return ResponseEntity.ok("Compra realizada con éxito. Producto: " + producto.getNombre() + "\n Coste: " + producto.getPrecio() * cantidad + " €");
    }


    public Map<Long, Producto> getProductos() {
        return productos;
    }

    public void setProductos(Map<Long, Producto> productos) {
        this.productos = productos;
    }    
}
