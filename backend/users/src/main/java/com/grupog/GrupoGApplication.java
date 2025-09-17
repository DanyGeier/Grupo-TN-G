package com.grupog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EntityScan("com.grupog.entities")
@ComponentScan(basePackages = { "com.grupog", "com.grupog.grpc.service" })
public class GrupoGApplication {

	public static void main(String[] args) {
		SpringApplication.run(GrupoGApplication.class, args);
	}

}
