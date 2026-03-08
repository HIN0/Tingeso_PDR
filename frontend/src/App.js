import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8080/api';

function App() {
  const [activeTab, setActiveTab] = useState('entradas');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Estados de formularios
  const [entrada, setEntrada] = useState({ fecha: '', nroRecibo: '', monto: '' });
  const [salida, setSalida] = useState({ fecha: '', tipoDocumento: 'Boleta', numDocumento: '', motivo: 'Artículos de oficina', monto: '' });
  const [fechasReporte, setFechasReporte] = useState({ inicio: '', fin: '' });
  const [datosReporte, setDatosReporte] = useState([]);

  const motivosSalida = [
    "Artículos de oficina", 
    "Productos de limpieza", 
    "Reparaciones", 
    "Combustible", 
    "Taxis", 
    "Alimentación", 
    "Varios"
  ];

  const showMessage = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  const handleEntradaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...entrada, monto: Number(entrada.monto) };
      await axios.post(`${API_URL}/entradas/`, payload);
      showMessage('success', 'Entrada registrada correctamente.');
      setEntrada({ fecha: '', nroRecibo: '', monto: '' });
    } catch (error) {
      showMessage('error', `Error al registrar entrada: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSalidaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...salida, monto: Number(salida.monto) };
      await axios.post(`${API_URL}/salidas/`, payload);
      showMessage('success', 'Salida registrada correctamente.');
      setSalida({ ...salida, numDocumento: '', monto: '' });
    } catch (error) {
      showMessage('error', `Error al registrar salida: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generarReporte = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/resumen/?inicio=${fechasReporte.inicio}&fin=${fechasReporte.fin}`);
      setDatosReporte(res.data);
      if(res.data.length === 0) {
        showMessage('success', 'No hay registros en estas fechas.');
      } else {
        setStatus({ type: '', message: '' });
      }
    } catch (error) {
      showMessage('error', `Error al generar el reporte: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 style={{textAlign: 'center'}}>Control de Caja Chica</h1>
      
      {status.message && (
        <div className={`alert ${status.type}`}>{status.message}</div>
      )}

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'entradas' ? 'active' : ''}`} 
          onClick={() => setActiveTab('entradas')}
        >Entradas</button>
        <button 
          className={`tab-button ${activeTab === 'salidas' ? 'active' : ''}`} 
          onClick={() => setActiveTab('salidas')}
        >Salidas</button>
        <button 
          className={`tab-button ${activeTab === 'reporte' ? 'active' : ''}`} 
          onClick={() => setActiveTab('reporte')}
        >Reporte</button>
      </div>

      {activeTab === 'entradas' && (
        <form onSubmit={handleEntradaSubmit}>
          <div className="form-group">
            <label>Fecha de Ingreso</label>
            <input type="date" value={entrada.fecha} onChange={e => setEntrada({...entrada, fecha: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Número de Recibo</label>
            <input type="text" value={entrada.nroRecibo} onChange={e => setEntrada({...entrada, nroRecibo: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Monto</label>
            <input type="number" min="1" value={entrada.monto} onChange={e => setEntrada({...entrada, monto: e.target.value})} required />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Procesando...' : 'Registrar Entrada'}
          </button>
        </form>
      )}

      {activeTab === 'salidas' && (
        <form onSubmit={handleSalidaSubmit}>
          <div className="form-group">
            <label>Fecha de Salida</label>
            <input type="date" value={salida.fecha} onChange={e => setSalida({...salida, fecha: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Tipo Documento</label>
            <select value={salida.tipoDocumento} onChange={e => setSalida({...salida, tipoDocumento: e.target.value})}>
              <option value="Boleta">Boleta</option>
              <option value="Factura">Factura</option>
            </select>
          </div>
          <div className="form-group">
            <label>Número de Documento</label>
            <input type="text" value={salida.numDocumento} onChange={e => setSalida({...salida, numDocumento: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Motivo</label>
            <select value={salida.motivo} onChange={e => setSalida({...salida, motivo: e.target.value})}>
              {motivosSalida.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Monto</label>
            <input type="number" min="1" value={salida.monto} onChange={e => setSalida({...salida, monto: e.target.value})} required />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Procesando...' : 'Registrar Salida'}
          </button>
        </form>
      )}

      {activeTab === 'reporte' && (
        <div>
          <form onSubmit={generarReporte} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Fecha Inicio</label>
              <input type="date" value={fechasReporte.inicio} onChange={e => setFechasReporte({...fechasReporte, inicio: e.target.value})} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Fecha Fin</label>
              <input type="date" value={fechasReporte.fin} onChange={e => setFechasReporte({...fechasReporte, fin: e.target.value})} required />
            </div>
            <div className="form-group" style={{ flex: 1, justifyContent: 'flex-end' }}>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Consultando...' : 'Generar Reporte'}
              </button>
            </div>
          </form>

          {datosReporte.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Nro</th>
                    <th>Fecha</th>
                    <th>Tipo Doc</th>
                    <th>Num Doc</th>
                    <th>Motivo</th>
                    <th>Ingreso</th>
                    <th>Salida</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {datosReporte.map((row) => (
                    <tr key={row.nro}>
                      <td>{row.nro}</td>
                      <td>{row.fecha}</td>
                      <td>{row.tipoDoc || '-'}</td>
                      <td>{row.numDoc || '-'}</td>
                      <td>{row.motivo}</td>
                      <td style={{ color: 'green' }}>{row.ingreso ? row.ingreso.toLocaleString('es-CL') : '0'}</td>
                      <td style={{ color: 'red' }}>{row.salida ? row.salida.toLocaleString('es-CL') : '0'}</td>
                      <td style={{ fontWeight: 'bold' }}>{row.saldo.toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;