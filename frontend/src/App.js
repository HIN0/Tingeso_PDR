import React, { useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaReceipt, FaMoneyBillWave, FaFileInvoice, FaClipboardList } from 'react-icons/fa';
import './App.css';

const API_URL = 'http://localhost:8080/api';

function App() {
  const [activeTab, setActiveTab] = useState('entradas');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // El monto se guarda como string de solo números ('440000') para facilitar el manejo
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

  // Función para formatear el dinero visualmente (ej: 440000 -> 440.000)
  const formatCurrency = (val) => {
    if (val === '') return '';
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) return '';
    return parsed.toLocaleString('es-CL');
  };

  // Función para limpiar el texto y dejar solo los números
  const handleMontoChange = (e, state, setState) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setState({ ...state, monto: rawValue });
  };

  const isEntradaValid = entrada.fecha !== '' && entrada.nroRecibo.trim() !== '' && entrada.monto !== '';
  const isSalidaValid = salida.fecha !== '' && salida.numDocumento.trim() !== '' && salida.monto !== '';
  // Validación estricta para el reporte
  const isReporteValid = fechasReporte.inicio !== '' && fechasReporte.fin !== '';

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
        <div className="form-wrapper">
          <form onSubmit={handleEntradaSubmit}>
            <div className="form-group">
              <label>Fecha de Ingreso</label>
              <div className="input-icon-wrapper">
                <FaCalendarAlt className={`input-icon ${entrada.fecha === '' ? 'icon-error' : 'icon-success'}`} />
                <input 
                  type="date" 
                  value={entrada.fecha} 
                  onChange={e => setEntrada({...entrada, fecha: e.target.value})} 
                  className={entrada.fecha === '' ? 'input-error' : 'input-success'}
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Número de Recibo</label>
              <div className="input-icon-wrapper">
                <FaReceipt className={`input-icon ${entrada.nroRecibo.trim() === '' ? 'icon-error' : 'icon-success'}`} />
                <input 
                  type="text" 
                  placeholder="Ingrese el número de recibo"
                  value={entrada.nroRecibo} 
                  onChange={e => setEntrada({...entrada, nroRecibo: e.target.value})} 
                  className={entrada.nroRecibo.trim() === '' ? 'input-error' : 'input-success'}
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Monto</label>
              <div className="input-icon-wrapper">
                <FaMoneyBillWave className={`input-icon ${entrada.monto === '' ? 'icon-error' : 'icon-success'}`} />
                <input 
                  type="text" 
                  placeholder="Ingrese el monto"
                  value={formatCurrency(entrada.monto)} 
                  onChange={e => handleMontoChange(e, entrada, setEntrada)} 
                  className={entrada.monto === '' ? 'input-error' : 'input-success'}
                  required 
                />
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading || !isEntradaValid}>
              {loading ? 'Procesando...' : 'Registrar Entrada'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'salidas' && (
        <div className="form-wrapper">
          <form onSubmit={handleSalidaSubmit}>
            <div className="form-group">
              <label>Fecha de Salida</label>
              <div className="input-icon-wrapper">
                <FaCalendarAlt className={`input-icon ${salida.fecha === '' ? 'icon-error' : 'icon-success'}`} />
                <input 
                  type="date" 
                  value={salida.fecha} 
                  onChange={e => setSalida({...salida, fecha: e.target.value})} 
                  className={salida.fecha === '' ? 'input-error' : 'input-success'}
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Tipo Documento</label>
              <div className="input-icon-wrapper">
                <FaFileInvoice className="input-icon icon-success" />
                <select 
                  value={salida.tipoDocumento} 
                  onChange={e => setSalida({...salida, tipoDocumento: e.target.value})}
                  className="input-success"
                >
                  <option value="Boleta">Boleta</option>
                  <option value="Factura">Factura</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Número de Documento</label>
              <div className="input-icon-wrapper">
                <FaReceipt className={`input-icon ${salida.numDocumento.trim() === '' ? 'icon-error' : 'icon-success'}`} />
                <input 
                  type="text" 
                  placeholder="Ingrese el número de documento"
                  value={salida.numDocumento} 
                  onChange={e => setSalida({...salida, numDocumento: e.target.value})} 
                  className={salida.numDocumento.trim() === '' ? 'input-error' : 'input-success'}
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Motivo</label>
              <div className="input-icon-wrapper">
                <FaClipboardList className="input-icon icon-success" />
                <select 
                  value={salida.motivo} 
                  onChange={e => setSalida({...salida, motivo: e.target.value})}
                  className="input-success"
                >
                  {motivosSalida.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Monto</label>
              <div className="input-icon-wrapper">
                <FaMoneyBillWave className={`input-icon ${salida.monto === '' ? 'icon-error' : 'icon-success'}`} />
                <input 
                  type="text" 
                  placeholder="Ingrese el monto"
                  value={formatCurrency(salida.monto)} 
                  onChange={e => handleMontoChange(e, salida, setSalida)} 
                  className={salida.monto === '' ? 'input-error' : 'input-success'}
                  required 
                />
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading || !isSalidaValid}>
              {loading ? 'Procesando...' : 'Registrar Salida'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'reporte' && (
        <div>
          <form onSubmit={generarReporte} style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Fecha Inicio</label>
              <div className="input-icon-wrapper">
                <FaCalendarAlt className={`input-icon ${fechasReporte.inicio === '' ? 'icon-error' : 'icon-success'}`} />
                <input 
                  type="date" 
                  value={fechasReporte.inicio} 
                  onChange={e => setFechasReporte({...fechasReporte, inicio: e.target.value})} 
                  className={fechasReporte.inicio === '' ? 'input-error' : 'input-success'}
                  required 
                />
              </div>
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Fecha Fin</label>
              <div className="input-icon-wrapper">
                <FaCalendarAlt className={`input-icon ${fechasReporte.fin === '' ? 'icon-error' : 'icon-success'}`} />
                <input 
                  type="date" 
                  value={fechasReporte.fin} 
                  onChange={e => setFechasReporte({...fechasReporte, fin: e.target.value})} 
                  className={fechasReporte.fin === '' ? 'input-error' : 'input-success'}
                  required 
                />
              </div>
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <button type="submit" className="submit-btn" disabled={loading || !isReporteValid}>
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
                    <th>Tipo Documento</th>
                    <th>Número Documento</th>
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