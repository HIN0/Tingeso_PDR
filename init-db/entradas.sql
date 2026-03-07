CREATE TABLE IF NOT EXISTS entradas (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    nro_recibo VARCHAR(20) NOT NULL,
    monto DECIMAL(15,2) NOT NULL
);

INSERT INTO entradas (fecha, nro_recibo, monto) VALUES 
('2024-03-01', 'REC-001', 500000.00),
('2024-03-15', 'REC-002', 200000.00);