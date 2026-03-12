import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const RegistroSalida = () => {
    const [salida, setSalida] = useState({ fecha: '', tipoDocumento: 'Boleta', numDocumento: '', motivo: 'Varios', monto: '' });
    const motivos = ["Artículos de oficina", "Productos de limpieza", "Reparaciones", "Combustible", "Taxis", "Alimentación", "Varios"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/salidas/', salida);
            
            Swal.fire({
                icon: 'success',
                title: 'Gasto Registrado',
                text: 'La salida de caja ha sido procesada.',
                showClass: { popup: 'animate__animated animate__fadeInDown' }, // Animación moderna
                hideClass: { popup: 'animate__animated animate__fadeOutUp' }
            });
        } catch (error) { 
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'No se pudo procesar la salida. Verifica los montos ingresados.',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* ... JSX original ... */}
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