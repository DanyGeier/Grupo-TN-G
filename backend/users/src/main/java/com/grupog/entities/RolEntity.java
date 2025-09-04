package com.grupog.entities;

//import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "rol")
//@Data
public class RolEntity implements GrantedAuthority{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_rol")
	private Long idRol;
	
	@Column(name = "nombre_rol", unique = true, nullable = false)
	private String nombreRol;

	public String getAuthority() {
        return "ROLE_" + nombreRol;
	}
	
}