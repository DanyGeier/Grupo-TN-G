import { useState, useEffect } from 'react';
import { obtenerInformeEventos } from '../../services/informeEventosApi';
import type { EventoAgrupadoPorMes, FiltroEventosInput } from '../../models/informeEventos';
import { obtenerUsuarios } from "../usuarios/api/usuarios";
import type { Usuario } from '../../models/usuario';
import './InformeEventos.css';

export default function InformeEventos() {
  const [filtros, setFiltros] = useState<FiltroEventosInput>({
    usuarioId: 0,
    fechaDesde: '',
    fechaHasta: '',
    repartoDonaciones: '',
  });

  const [resultado, setResultado] = useState<EventoAgrupadoPorMes[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuarioActual, setUsuarioActual] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUsuarioActual(user);

      // Si no es PRESIDENTE ni COORDINADOR, pre-seleccionar su propio usuario
      if (user.rol !== 'PRESIDENTE' && user.rol !== 'COORDINADOR') {
        setFiltros(prev => ({ ...prev, usuarioId: user.id }));
      }
    }
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const handleBuscar = async () => {
    if (!filtros.usuarioId) {
      setError('El usuario es obligatorio');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const filtroEnviar: FiltroEventosInput = {
        usuarioId: filtros.usuarioId,
        ...(filtros.fechaDesde && { fechaDesde: filtros.fechaDesde + 'T00:00:00' }),
        ...(filtros.fechaHasta && { fechaHasta: filtros.fechaHasta + 'T23:59:59' }),
        ...(filtros.repartoDonaciones && { repartoDonaciones: filtros.repartoDonaciones }),
      };

      const data = await obtenerInformeEventos(filtroEnviar);
      setResultado(data.informeEventosPropios || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el informe');
      setResultado([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    const esAdmin = usuarioActual?.rol === 'PRESIDENTE' || usuarioActual?.rol === 'COORDINADOR';
    setFiltros({
      usuarioId: esAdmin ? 0 : usuarioActual?.id || 0,
      fechaDesde: '',
      fechaHasta: '',
      repartoDonaciones: '',
    });
    setResultado([]);
    setError(null);
  };

  const esAdmin = usuarioActual?.rol === 'PRESIDENTE' || usuarioActual?.rol === 'COORDINADOR';

  return (
    <div className="informe-eventos-container">
      <div className="informe-eventos-header">
        <h1>📊 Informe de Participación en Eventos</h1>
      </div>

      <div className="filtros-card">
        <h3>Filtros</h3>
        <div className="filtros-grid">
          <div className="form-group">
            <label htmlFor="usuario">Usuario: *</label>
            <select
              id="usuario"
              value={filtros.usuarioId}
              onChange={(e) => setFiltros({ ...filtros, usuarioId: Number(e.target.value) })}
              disabled={!esAdmin}
              className="form-control"
            >
              <option value={0}>Selecciona un usuario</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre} {u.apellido} ({u.rol})
                </option>
              ))}
            </select>
            {!esAdmin && <small className="text-muted">Solo puedes ver tus propios eventos</small>}
          </div>

          <div className="form-group">
            <label htmlFor="fechaDesde">Fecha Desde:</label>
            <input
              type="date"
              id="fechaDesde"
              value={filtros.fechaDesde}
              onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaHasta">Fecha Hasta:</label>
            <input
              type="date"
              id="fechaHasta"
              value={filtros.fechaHasta}
              onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="repartoDonaciones">Reparto de Donaciones:</label>
            <select
              id="repartoDonaciones"
              value={filtros.repartoDonaciones}
              onChange={(e) => setFiltros({ ...filtros, repartoDonaciones: e.target.value })}
              className="form-control"
            >
              <option value="">Todos</option>
              <option value="SI">Sí</option>
              <option value="NO">No</option>
            </select>
          </div>
        </div>

        <div className="filtros-acciones">
          <button onClick={handleBuscar} className="btn-buscar" disabled={loading}>
            {loading ? '⏳ Buscando...' : '🔍 Buscar'}
          </button>
          <button onClick={handleLimpiar} className="btn-limpiar">
            🧹 Limpiar
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {resultado.length > 0 && (
        <div className="resultados-container">
          <h3>Resultados</h3>
          {resultado.map((mesData) => (
            <div key={mesData.mes} className="mes-card">
              <h4 className="mes-titulo">{mesData.mes}</h4>
              <div className="eventos-lista">
                {mesData.eventos.map((evento, idx) => (
                  <div key={idx} className="evento-item">
                    <div className="evento-header">
                      <span className="evento-dia">Día {evento.dia}</span>
                      <span className={`evento-donaciones ${evento.donaciones ? 'con-donaciones' : 'sin-donaciones'}`}>
                        {evento.donaciones ? '✅ Con donaciones' : '❌ Sin donaciones'}
                      </span>
                    </div>
                    <h5 className="evento-nombre">{evento.nombreEvento}</h5>
                    {evento.descripcion && (
                      <p className="evento-descripcion">{evento.descripcion}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && resultado.length === 0 && !error && filtros.usuarioId !== 0 && (
        <div className="sin-resultados">
          📭 No se encontraron eventos para los filtros seleccionados
        </div>
      )}
    </div>
  );
}

