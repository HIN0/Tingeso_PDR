import React, { useState } from 'react';
import axios from 'axios';

const RegistroSalida = () => {
    const [salida, setSalida] = useState({ fecha: '', tipoDocumento: 'Boleta', numDocumento: '', motivo: 'Varios', monto: '' });

    const motivos = ["Artículos de oficina", "Productos de limpieza", "Reparaciones", "Combustible", "Taxis", "Alimentación", "Varios"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/salidas/', salida);
            alert('Salida registrada');
        } catch (error) { console.error(error); }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registrar Salida</h2>
            <input type="date" value={salida.fecha} onChange={e => setSalida({...salida, fecha: e.target.value})} required />
            <select value={salida.tipoDocumento} onChange={e => setSalida({...salida, tipoDocumento: e.target.value})}>
                <option value="Boleta">Boleta</option>
                <option value="Factura">Factura</option>
            </select>
            <input type="text" placeholder="Nro Documento" value={salida.numDocumento} onChange={e => setSalida({...salida, numDocumento: e.target.value})} required />
            <select value={salida.motivo} onChange={e => setSalida({...salida, motivo: e.target.value})}>
                {motivos.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input type="number" placeholder="Monto" value={salida.monto} onChange={e => setSalida({...salida, monto: e.target.value})} required />
            <button type="submit">Guardar</button>
        </form>
    );
};
export default RegistroSalida;