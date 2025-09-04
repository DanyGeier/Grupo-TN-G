package com.example.grupog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.grupog.entities")
public class GrupoGApplication {

	public static void main(String[] args) {
		SpringApplication.run(GrupoGApplication.class, args);
	}

}
