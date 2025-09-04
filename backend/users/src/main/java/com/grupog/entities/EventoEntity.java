package com.grupog.entities;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "evento")
public class EventoEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idEvento;
	
	@Column(name = "nombre_del_evento")
	private String nombreEvento;
	
	@Column(name = "descripcion_del_evento")
	private String descripcion;
	
	@Column(name = "fecha_y_hora")
	private LocalDateTime fechaYHoraDelEvento;
	
	@ManyToMany
	@JoinTable(
			name = "usuarios_evento",
			joinColumns = @JoinColumn(name = "evento_id"),
			inverseJoinColumns = @JoinColumn(name = "usuario_id")
)
	private Set<UsuarioEntity> usuario = new HashSet<>();
	
	@OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private Set<DonacionEntity> donaciones = new HashSet<>();

	public Long getIdEvento() {
		return idEvento;
	}

	public void setIdEvento(Long idEvento) {
		this.idEvento = idEvento;
	}

	public String getNombreEvento() {
		return nombreEvento;
	}

	public void setNombreEvento(String nombreEvento) {
		this.nombreEvento = nombreEvento;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public LocalDateTime getFechaYHoraDelEvento() {
		return fechaYHoraDelEvento;
	}

	public void setFechaYHoraDelEvento(LocalDateTime fechaYHoraDelEvento) {
		this.fechaYHoraDelEvento = fechaYHoraDelEvento;
	}

	public Set<UsuarioEntity> getUsuario() {
		return usuario;
	}

	public void setUsuario(Set<UsuarioEntity> usuario) {
		this.usuario = usuario;
	}
	
	

}