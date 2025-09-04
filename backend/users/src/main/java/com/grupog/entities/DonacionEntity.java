package com.grupog.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table (name = "donacion")
public class DonacionEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idDonacion;
	
	@Column(name = "categoria", nullable = false)
	private String categoria;
	
	@Column(name = "descripcion_de_la_donacion")
	private String descripcion;
	
	@Column(name = "cantidad", nullable = false)
	private Integer cantidad;
	
	private boolean eliminado = false;
	
	@Column(name = "fecha_y_hora_alta", nullable = false, updatable = false)
	private LocalDateTime fechaAlta;
	
	@Column(name = "fecha_y_hora_modificacion")
	private LocalDateTime fechaModificacion;
	
	@Column(name = "usuario_alta", nullable = false, updatable = false)
	private int usuarioAlta;
	
	@Column(name = "usuario_modificacion")
	private int usuarioModificacion;
	
	@ManyToOne
	@JoinColumn(name = "usuario_id", nullable = false)
	private UsuarioEntity usuario;
	
	@ManyToOne
	@JoinColumn(name = "evento_id", nullable = false)
	private EventoEntity evento;
	
	@PrePersist
	public void prePersist() {
		this.fechaAlta = LocalDateTime.now();
	}
	
	@PreUpdate
	public void preUpdate() {
		this.fechaModificacion = LocalDateTime.now();
	}

	public Long getIdDonacion() {
		return idDonacion;
	}

	public void setIdDonacion(Long idDonacion) {
		this.idDonacion = idDonacion;
	}

	public String getCategoria() {
		return categoria;
	}

	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Integer getCantidad() {
		return cantidad;
	}

	public void setCantidad(Integer cantidad) {
		this.cantidad = cantidad;
	}

	public boolean isEliminado() {
		return eliminado;
	}

	public void setEliminado(boolean eliminado) {
		this.eliminado = eliminado;
	}

	public LocalDateTime getFechaAlta() {
		return fechaAlta;
	}

	public void setFechaAlta(LocalDateTime fechaAlta) {
		this.fechaAlta = fechaAlta;
	}

	public LocalDateTime getFechaModificacion() {
		return fechaModificacion;
	}

	public void setFechaModificacion(LocalDateTime fechaModificacion) {
		this.fechaModificacion = fechaModificacion;
	}

	public int getUsuarioAlta() {
		return usuarioAlta;
	}

	public void setUsuarioAlta(int usuarioAlta) {
		this.usuarioAlta = usuarioAlta;
	}

	public int getUsuarioModificacion() {
		return usuarioModificacion;
	}

	public void setUsuarioModificacion(int usuarioModificacion) {
		this.usuarioModificacion = usuarioModificacion;
	}
	
	
}
