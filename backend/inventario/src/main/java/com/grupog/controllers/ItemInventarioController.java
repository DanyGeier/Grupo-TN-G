package com.grupog.controllers;

import com.grupog.entities.ItemInventarioEntity;
import com.grupog.events.OfertaDonacionEvent;
import com.grupog.consumers.OfertaDonacionProducer;
import com.grupog.repositories.ItemInventarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/inventario")
public class ItemInventarioController {

    private final ItemInventarioRepository repository;

    @Value("${mi.organizacion.id}")
    private Long idOrganizacion;

    @Autowired
    private OfertaDonacionProducer ofertaDonacionProducer;

    public ItemInventarioController(ItemInventarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok().body("OK");
    }

    @GetMapping("/items")
    public ResponseEntity<List<ItemInventarioEntity>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping("/oferta-donaciones")
    public ResponseEntity<String> ofrecerDonacion(@RequestBody OfertaDonacionEvent oferta) {
        if (oferta.getIdOferta() == null) {
            oferta.setIdOferta((UUID.randomUUID().toString()));
        }
        oferta.setIdOrganizacionDonante(idOrganizacion);
        ofertaDonacionProducer.enviarMensaje(oferta);
        return ResponseEntity.ok("Oferta de donacion enviada con ID: " + oferta.getIdOferta());
    }
}
