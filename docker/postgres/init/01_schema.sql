CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    rol_id BIGINT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_usuarios_roles
        FOREIGN KEY (rol_id) REFERENCES roles(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE categorias (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE proveedores (
    id BIGSERIAL PRIMARY KEY,
    razon_social VARCHAR(200) NOT NULL,
    ruc VARCHAR(11) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    correo VARCHAR(150),
    direccion VARCHAR(255),
    contacto VARCHAR(150),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_proveedores_ruc CHECK (char_length(ruc) = 11)
);

CREATE TABLE productos (
    id BIGSERIAL PRIMARY KEY,
    categoria_id BIGINT NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    unidad_medida VARCHAR(30) NOT NULL DEFAULT 'UNIDAD',
    stock_minimo NUMERIC(12,2) NOT NULL DEFAULT 0,
    requiere_lote BOOLEAN NOT NULL DEFAULT TRUE,
    requiere_vencimiento BOOLEAN NOT NULL DEFAULT TRUE,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_productos_categorias
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_productos_stock_minimo CHECK (stock_minimo >= 0)
);

CREATE TABLE lotes (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    numero_lote VARCHAR(100) NOT NULL,
    fecha_vencimiento DATE,
    cantidad_inicial NUMERIC(12,2) NOT NULL,
    cantidad_actual NUMERIC(12,2) NOT NULL,
    costo_unitario NUMERIC(12,4) NOT NULL DEFAULT 0,
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_lotes_productos
        FOREIGN KEY (producto_id) REFERENCES productos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT uq_lotes_producto_lote UNIQUE (producto_id, numero_lote),
    CONSTRAINT chk_lotes_cantidad_inicial CHECK (cantidad_inicial >= 0),
    CONSTRAINT chk_lotes_cantidad_actual CHECK (cantidad_actual >= 0),
    CONSTRAINT chk_lotes_costo_unitario CHECK (costo_unitario >= 0)
);

CREATE TABLE compras (
    id BIGSERIAL PRIMARY KEY,
    proveedor_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    fecha_compra DATE NOT NULL DEFAULT CURRENT_DATE,
    tipo_comprobante VARCHAR(30) NOT NULL,
    numero_comprobante VARCHAR(50) NOT NULL,
    subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
    impuesto NUMERIC(14,2) NOT NULL DEFAULT 0,
    total NUMERIC(14,2) NOT NULL DEFAULT 0,
    observacion TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_compras_proveedores
        FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_compras_usuarios
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE detalle_compras (
    id BIGSERIAL PRIMARY KEY,
    compra_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    numero_lote VARCHAR(100) NOT NULL,
    fecha_vencimiento DATE,
    cantidad NUMERIC(12,2) NOT NULL,
    precio_unitario NUMERIC(12,4) NOT NULL,
    subtotal NUMERIC(14,2) NOT NULL,
    CONSTRAINT fk_detalle_compras_compras
        FOREIGN KEY (compra_id) REFERENCES compras(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_detalle_compras_productos
        FOREIGN KEY (producto_id) REFERENCES productos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE movimientos_inventario (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    lote_id BIGINT,
    usuario_id BIGINT NOT NULL,
    tipo_movimiento VARCHAR(30) NOT NULL,
    cantidad NUMERIC(12,2) NOT NULL,
    fecha_movimiento TIMESTAMP NOT NULL DEFAULT NOW(),
    observacion TEXT,
    referencia_tipo VARCHAR(50),
    referencia_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_movimientos_productos
        FOREIGN KEY (producto_id) REFERENCES productos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_movimientos_lotes
        FOREIGN KEY (lote_id) REFERENCES lotes(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_movimientos_usuarios
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_movimientos_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_movimientos_tipo
        CHECK (tipo_movimiento IN (
            'ENTRADA',
            'SALIDA',
            'AJUSTE_ENTRADA',
            'AJUSTE_SALIDA',
            'MERMA',
            'VENCIDO'
        ))
);

INSERT INTO roles (nombre, descripcion) VALUES
('ADMIN', 'Administrador del sistema'),
('ALMACEN', 'Encargado de almacén'),
('CAJERO', 'Usuario de consulta');