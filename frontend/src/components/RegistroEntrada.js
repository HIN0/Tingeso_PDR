import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const RegistroEntrada = () => {
    const [entrada, setEntrada] = useState({ fecha: '', nroRecibo: '', monto: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/entradas/', entrada);
            
            // Ventana flotante de éxito centrada y llamativa
            Swal.fire({
                title: '¡Entrada Registrada!',
                text: `El recibo N° ${entrada.nroRecibo} se guardó correctamente.`,
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Entendido',
                background: '#fff',
                backdrop: `rgba(0,0,123,0.4)` // Oscurece el fondo para resaltar la ventana
            });

            setEntrada({ fecha: '', nroRecibo: '', monto: '' });
        } catch (error) { 
            console.error(error);
            // Heurística #9: Ayudar a reconocer y recuperarse de errores
            Swal.fire({
                title: 'Fallo en el Registro',
                text: 'Hubo un error al conectar con el servidor. Por favor, revisa tu conexión.',
                icon: 'error',
                confirmButtonText: 'Reintentar'
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* ... resto del JSX igual al archivo original ... */}
            <h2>Registrar Entrada</h2>
            <input type="date" value={entrada.fecha} onChange={e => setEntrada({...entrada, fecha: e.target.value})} required />
            <input type="text" placeholder="Nro Recibo" value={entrada.nroRecibo} onChange={e => setEntrada({...entrada, nroRecibo: e.target.value})} required />
            <input type="number" placeholder="Monto" value={entrada.monto} onChange={e => setEntrada({...entrada, monto: e.target.value})} required />
            <button type="submit">Guardar</button>
        </form>
    );
};
export default RegistroEntrada;