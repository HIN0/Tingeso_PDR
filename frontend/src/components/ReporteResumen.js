import React, { useState } from 'react';
import axios from 'axios';

const ReporteResumen = () => {
    const [fechas, setFechas] = useState({ inicio: '', fin: '' });
    const [datos, setDatos] = useState([]);

    const consultar = async () => {
        const res = await axios.get(`http://localhost:8080/api/resumen/?inicio=${fechas.inicio}&fin=${fechas.fin}`);
        setDatos(res.data);
    };

    return (
        <div>
            <h2>Reporte Resumen</h2>
            <input type="date" onChange={e => setFechas({...fechas, inicio: e.target.value})} />
            <input type="date" onChange={e => setFechas({...fechas, fin: e.target.value})} />
            <button onClick={consultar}>Generar Reporte</button>

            <table border="1" style={{ marginTop: '20px', width: '100%' }}>
                <thead>
                    <tr>
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
            </table>
        </div>
    );
};
export default ReporteResumen;