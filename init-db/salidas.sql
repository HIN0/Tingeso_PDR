CREATE TABLE IF NOT EXISTS salidas (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    tipo_documento VARCHAR(20) NOT NULL,
    num_documento VARCHAR(50) NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    monto DECIMAL(15,2) NOT NULL
);

INSERT INTO salidas (fecha, tipo_documento, num_documento, motivo, monto) VALUES 
('2026-03-01', 'Factura', 'F-100', 'Artículos de Oficina', 50000.00),
('2026-03-02', 'Boleta', 'B-55', 'Limpieza', 25000.00),
('2026-03-03', 'Factura', 'F-101', 'Reparaciones Menores', 120000.00);