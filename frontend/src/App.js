import React, { useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaReceipt, FaMoneyBillWave, FaFileInvoice, FaClipboardList } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Importamos SweetAlert2
import './App.css';

const API_URL = 'http://localhost:8080/api';

function App() {
  const [activeTab, setActiveTab] = useState('entradas');
  const [loading, setLoading] = useState(false);

  const [entrada, setEntrada] = useState({ fecha: '', nroRecibo: '', monto: '' });
  const [salida, setSalida] = useState({ fecha: '', tipoDocumento: 'Boleta', numDocumento: '', motivo: 'Artículos de oficina', monto: '' });
  const [fechasReporte, setFechasReporte] = useState({ inicio: '', fin: '' });
  const [datosReporte, setDatosReporte] = useState([]);

  const motivosSalida = [
    "Artículos de oficina", "Productos de limpieza", "Reparaciones", "Combustible", "Taxis", "Alimentación", "Varios"
  ];

  // Cálculos automáticos para los totales (Heurística #1: Visibilidad del estado)
  const totalIngresos = datosReporte.reduce((acc, row) => acc + (row.ingreso || 0), 0);
  const totalSalidas = datosReporte.reduce((acc, row) => acc + (row.salida || 0), 0);

  const formatCurrency = (val) => {
    if (val === '' || val === null) return '0';
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) return '0';
    return parsed.toLocaleString('es-CL');
  };

  const handleMontoChange = (e, state, setState) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setState({ ...state, monto: rawValue });
  };

  const isEntradaValid = entrada.fecha !== '' && entrada.nroRecibo.trim() !== '' && entrada.monto !== '';
  const isSalidaValid = salida.fecha !== '' && salida.numDocumento.trim() !== '' && salida.monto !== '';
  const isReporteValid = fechasReporte.inicio !== '' && fechasReporte.fin !== '';

  const handleEntradaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...entrada, monto: Number(entrada.monto) };
      await axios.post(`${API_URL}/entradas/`, payload);
      
      Swal.fire({
        icon: 'success',
        title: '¡Entrada Registrada!',
        text: `Se ingresaron $${formatCurrency(entrada.monto)} correctamente.`,
        confirmButtonColor: '#28a745'
      });
      
      setEntrada({ fecha: '', nroRecibo: '', monto: '' });
    } catch (error) {
      Swal.fire('Error', 'No se pudo registrar la entrada', 'error');
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
      
      Swal.fire({
        icon: 'success',
        title: '¡Salida Registrada!',
        text: 'El gasto ha sido guardado en el sistema.',
        timer: 2000,
        showConfirmButton: false
      });
      
      setSalida({ ...salida, numDocumento: '', monto: '' });
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al guardar la salida', 'error');
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
        Swal.fire('Sin registros', 'No hay movimientos en las fechas seleccionadas', 'info');
      } else {
        // Ventana flotante moderna con los totales solicitados
        const ingresosNum = res.data.reduce((acc, row) => acc + (row.ingreso || 0), 0);
        const salidasNum = res.data.reduce((acc, row) => acc + (row.salida || 0), 0);

        Swal.fire({
          title: 'Resumen Generado',
          html: `
            <div style="text-align: left; font-size: 1.1em;">
              <p>🟢 <b>Total Entradas:</b> $${ingresosNum.toLocaleString('es-CL')}</p>
              <p>🔴 <b>Total Salidas:</b> $${salidasNum.toLocaleString('es-CL')}</p>
              <hr>
              <p>💰 <b>Saldo Neto:</b> $${(ingresosNum - salidasNum).toLocaleString('es-CL')}</p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Ver detalles en tabla'
        });
      }
    } catch (error) {
      Swal.fire('Error Crítico', 'Error al generar reporte: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 style={{textAlign: 'center'}}>Control de Caja Chica</h1>
      
      <div className="tabs">
        <button className={`tab-button ${activeTab === 'entradas' ? 'active' : ''}`} onClick={() => setActiveTab('entradas')}>Entradas</button>
        <button className={`tab-button ${activeTab === 'salidas' ? 'active' : ''}`} onClick={() => setActiveTab('salidas')}>Salidas</button>
        <button className={`tab-button ${activeTab === 'reporte' ? 'active' : ''}`} onClick={() => setActiveTab('reporte')}>Reporte</button>
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
            <button type="submit" className="submit-btn" style={{ flex: 1 }} disabled={loading || !isReporteValid}>
              {loading ? 'Consultando...' : 'Generar Reporte'}
            </button>
          </form>

          {datosReporte.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Nro</th><th>Fecha</th><th>Tipo Documento</th><th>Número Documento</th>
                    <th>Motivo</th><th>Ingreso</th><th>Salida</th><th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {datosReporte.map((row) => (
                    <tr key={row.nro}>
                      <td>{row.nro}</td><td>{row.fecha}</td>
                      <td>{row.tipoDoc || '-'}</td><td>{row.numDoc || '-'}</td>
                      <td>{row.motivo}</td>
                      <td style={{ color: 'green' }}>{formatCurrency(row.ingreso)}</td>
                      <td style={{ color: 'red' }}>{formatCurrency(row.salida)}</td>
                      <td style={{ fontWeight: 'bold' }}>{formatCurrency(row.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
                {/* FILA DE TOTALES AL FINAL */}
                <tfoot>
                  <tr style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold', borderTop: '2px solid #ccc' }}>
                    <td colSpan="5" style={{ textAlign: 'right', paddingRight: '15px' }}>TOTALES:</td>
                    <td style={{ color: 'green' }}>{formatCurrency(totalIngresos)}</td>
                    <td style={{ color: 'red' }}>{formatCurrency(totalSalidas)}</td>
                    <td style={{ backgroundColor: '#e8f4fd' }}>{formatCurrency(totalIngresos - totalSalidas)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;