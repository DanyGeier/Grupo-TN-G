package com.grupog.controllers;

import com.grupog.entities.ItemInventarioEntity;
import com.grupog.repositories.ItemInventarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/inventario")
public class ItemInventarioController {

    private final ItemInventarioRepository repository;

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
}

