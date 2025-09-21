package com.grupog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = { "com.grupog" })
public class EventosApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventosApplication.class, args);
    }

}
