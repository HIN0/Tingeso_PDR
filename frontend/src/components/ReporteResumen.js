import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ReporteResumen = () => {
    const [fechas, setFechas] = useState({ inicio: '', fin: '' });
    const [datos, setDatos] = useState([]);

    // Funciones para calcular totales basándose en los datos actuales
    const totalIngresos = datos.reduce((acc, row) => acc + (row.ingreso || 0), 0);
    const totalSalidas = datos.reduce((acc, row) => acc + (row.salida || 0), 0);

    const consultar = async () => {
        if (!fechas.inicio || !fechas.fin) {
            Swal.fire('Atención', 'Selecciona un rango de fechas', 'warning');
            return;
        }

        try {
            const res = await axios.get(`http://localhost:8080/api/resumen/?inicio=${fechas.inicio}&fin=${fechas.fin}`);
            setDatos(res.data);
            
            if (res.data.length > 0) {
                // Ventana flotante moderna que resalta los totales encontrados
                Swal.fire({
                    title: 'Reporte Generado',
                    html: `
                        <div style="text-align: left;">
                            <p><b>Total Entradas:</b> $${totalIngresos.toLocaleString()}</p>
                            <p><b>Total Salidas:</b> $${totalSalidas.toLocaleString()}</p>
                            <hr>
                            <p><b>Saldo Final:</b> $${(totalIngresos - totalSalidas).toLocaleString()}</p>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'Ver Tabla Completa',
                    confirmButtonColor: '#28a745'
                });
            } else {
                Swal.fire('Sin registros', 'No hay movimientos en este periodo', 'info');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Reporte Resumen</h2>
            <div style={{ marginBottom: '20px' }}>
                <input type="date" onChange={e => setFechas({...fechas, inicio: e.target.value})} />
                <input type="date" onChange={e => setFechas({...fechas, fin: e.target.value})} />
                <button onClick={consultar} style={{ marginLeft: '10px' }}>Generar Reporte</button>
            </div>

            <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th>Nro</th><th>Fecha</th><th>Tipo Doc</th><th>Num Doc</th>
                        <th>Motivo</th><th>Ingreso</th><th>Salida</th><th>Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map(row => (
                        <tr key={row.nro}>
                            <td>{row.nro}</td><td>{row.fecha}</td><td>{row.tipoDoc}</td>
                            <td>{row.numDoc}</td><td>{row.motivo}</td>
                            <td>{row.ingreso}</td><td>{row.salida}</td><td>{row.saldo}</td>
                        </tr>
                    ))}
                </tbody>
                {/* Nueva sección de Totales al final de la tabla */}
                {datos.length > 0 && (
                    <tfoot>
                        <tr style={{ backgroundColor: '#eee', fontWeight: 'bold' }}>
                            <td colSpan="5">TOTALES</td>
                            <td style={{ color: 'green' }}>{totalIngresos.toLocaleString()}</td>
                            <td style={{ color: 'red' }}>{totalSalidas.toLocaleString()}</td>
                            <td>{(totalIngresos - totalSalidas).toLocaleString()}</td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default ReporteResumen;