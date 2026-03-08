import React, { useState } from 'react';
import axios from 'axios';

const RegistroEntrada = () => {
    const [entrada, setEntrada] = useState({ fecha: '', nroRecibo: '', monto: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/entradas/', entrada);
            alert('Entrada registrada con éxito');
            setEntrada({ fecha: '', nroRecibo: '', monto: '' });
        } catch (error) { console.error(error); }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registrar Entrada</h2>
            <input type="date" value={entrada.fecha} onChange={e => setEntrada({...entrada, fecha: e.target.value})} required />
            <input type="text" placeholder="Nro Recibo" value={entrada.nroRecibo} onChange={e => setEntrada({...entrada, nroRecibo: e.target.value})} required />
            <input type="number" placeholder="Monto" value={entrada.monto} onChange={e => setEntrada({...entrada, monto: e.target.value})} required />
            <button type="submit">Guardar</button>
        </form>
    );
};
export default RegistroEntrada;