import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'API Sistema de Inventario - Botica',
      version: '1.0.0',
      description:
        'Documentación del backend del sistema de inventario para botica'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ],
    tags: [
      { name: 'Health', description: 'Estado general de la API' },
      { name: 'Auth', description: 'Autenticación y perfil del usuario' },
      { name: 'Dashboard', description: 'Resumen general del sistema' },
      { name: 'Roles', description: 'Gestión y consulta de roles' },
      { name: 'Usuarios', description: 'Gestión de usuarios' },
      { name: 'Categorias', description: 'Gestión de categorías' },
      { name: 'Proveedores', description: 'Gestión de proveedores' },
      { name: 'Productos', description: 'Gestión de productos' },
      { name: 'Lotes', description: 'Gestión de lotes' },
      { name: 'Compras', description: 'Registro y consulta de compras' },
      { name: 'Movimientos', description: 'Trazabilidad del inventario' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error de validación' },
            details: {
              nullable: true,
              example: null
            }
          }
        },

        PaginationMeta: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 25 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 3 }
          }
        },

        Role: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'ADMIN' },
            descripcion: {
              type: 'string',
              example: 'Administrador del sistema'
            },
            estado: { type: 'boolean', example: true },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-06T15:30:00.000Z'
            }
          }
        },

        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombres: { type: 'string', example: 'Admin' },
            apellidos: { type: 'string', example: 'Principal' },
            correo: {
              type: 'string',
              format: 'email',
              example: 'admin@botica.com'
            },
            estado: { type: 'boolean', example: true },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-06T15:30:00.000Z'
            },
            rol: { type: 'string', example: 'ADMIN' }
          }
        },

        Categoria: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'ANALGESICOS' },
            descripcion: {
              type: 'string',
              example: 'Medicamentos para dolor y fiebre'
            },
            estado: { type: 'boolean', example: true },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-06T15:30:00.000Z'
            }
          }
        },

        Proveedor: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            razon_social: {
              type: 'string',
              example: 'DISTRIBUIDORA FARMACEUTICA DEL SUR S.A.C.'
            },
            ruc: { type: 'string', example: '20456789123' },
            telefono: { type: 'string', example: '966123456' },
            correo: {
              type: 'string',
              format: 'email',
              example: 'ventas@difsur.com'
            },
            direccion: {
              type: 'string',
              example: 'Av. Ejército 123, Ayacucho'
            },
            contacto: { type: 'string', example: 'Carlos Medina' },
            estado: { type: 'boolean', example: true },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-06T15:30:00.000Z'
            }
          }
        },

        Producto: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            categoria_id: { type: 'integer', example: 1 },
            categoria: { type: 'string', example: 'ANALGESICOS' },
            codigo: { type: 'string', example: 'PARA500TAB' },
            nombre: {
              type: 'string',
              example: 'Paracetamol 500 mg tabletas'
            },
            descripcion: { type: 'string', example: 'Caja x 100 tabletas' },
            unidad_medida: { type: 'string', example: 'CAJA' },
            stock_minimo: { type: 'number', example: 20 },
            requiere_lote: { type: 'boolean', example: true },
            requiere_vencimiento: { type: 'boolean', example: true },
            estado: { type: 'boolean', example: true },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-06T15:30:00.000Z'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-06T16:00:00.000Z'
            }
          }
        },

        Lote: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            producto_id: { type: 'integer', example: 1 },
            producto_codigo: { type: 'string', example: 'PARA500TAB' },
            producto_nombre: {
              type: 'string',
              example: 'Paracetamol 500 mg tabletas'
            },
            numero_lote: { type: 'string', example: 'LT-2026-001' },
            fecha_vencimiento: {
              type: 'string',
              format: 'date',
              example: '2027-12-31'
            },
            cantidad_inicial: { type: 'number', example: 100 },
            cantidad_actual: { type: 'number', example: 80 },
            costo_unitario: { type: 'number', example: 0.85 },
            fecha_ingreso: {
              type: 'string',
              format: 'date',
              example: '2026-04-06'
            },
            estado: { type: 'boolean', example: true },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-06T15:30:00.000Z'
            }
          }
        },

        CompraDetalle: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            compra_id: { type: 'integer', example: 1 },
            producto_id: { type: 'integer', example: 1 },
            producto_codigo: { type: 'string', example: 'PARA500TAB' },
            producto_nombre: {
              type: 'string',
              example: 'Paracetamol 500 mg tabletas'
            },
            numero_lote: { type: 'string', example: 'LT-2026-003' },
            fecha_vencimiento: {
              type: 'string',
              format: 'date',
              example: '2028-01-31'
            },
            cantidad: { type: 'number', example: 40 },
            precio_unitario: { type: 'number', example: 0.95 },
            subtotal: { type: 'number', example: 38.0 }
          }
        },

        Compra: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            proveedor_id: { type: 'integer', example: 1 },
            proveedor: {
              type: 'string',
              example: 'DISTRIBUIDORA FARMACEUTICA DEL SUR S.A.C.'
            },
            usuario_id: { type: 'integer', example: 1 },
            usuario: { type: 'string', example: 'Admin Principal' },
            fecha_compra: {
              type: 'string',
              format: 'date',
              example: '2026-04-06'
            },
            tipo_comprobante: { type: 'string', example: 'FACTURA' },
            numero_comprobante: { type: 'string', example: 'F001-000124' },
            subtotal: { type: 'number', example: 38.0 },
            impuesto: { type: 'number', example: 0 },
            total: { type: 'number', example: 38.0 },
            observacion: {
              type: 'string',
              example: 'Compra con usuario tomado del token'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-06T15:30:00.000Z'
            }
          }
        },

        Movimiento: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            producto_id: { type: 'integer', example: 1 },
            producto_codigo: { type: 'string', example: 'PARA500TAB' },
            producto_nombre: {
              type: 'string',
              example: 'Paracetamol 500 mg tabletas'
            },
            lote_id: { type: 'integer', example: 1 },
            numero_lote: { type: 'string', example: 'LT-2026-003' },
            usuario_id: { type: 'integer', example: 1 },
            usuario: { type: 'string', example: 'Admin Principal' },
            tipo_movimiento: { type: 'string', example: 'ENTRADA' },
            cantidad: { type: 'number', example: 40 },
            fecha_movimiento: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-06T15:45:00.000Z'
            },
            observacion: {
              type: 'string',
              example: 'Ingreso por compra F001-000124'
            },
            referencia_tipo: { type: 'string', example: 'COMPRA' },
            referencia_id: { type: 'integer', example: 1 },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-06T15:45:00.000Z'
            }
          }
        },

        DashboardResumen: {
          type: 'object',
          properties: {
            total_productos_activos: { type: 'integer', example: 12 },
            productos_stock_bajo: { type: 'integer', example: 3 },
            lotes_por_vencer_30: { type: 'integer', example: 2 },
            lotes_vencidos_con_stock: { type: 'integer', example: 1 }
          }
        },

        LoginRequest: {
          type: 'object',
          required: ['correo', 'password'],
          properties: {
            correo: {
              type: 'string',
              format: 'email',
              example: 'admin@botica.com'
            },
            password: {
              type: 'string',
              example: 'Admin123*'
            }
          }
        },

        LoginResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login correcto' },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                usuario: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    nombres: { type: 'string', example: 'Admin' },
                    apellidos: { type: 'string', example: 'Principal' },
                    correo: {
                      type: 'string',
                      example: 'admin@botica.com'
                    },
                    rol: { type: 'string', example: 'ADMIN' }
                  }
                }
              }
            }
          }
        },

        UsuarioCreateRequest: {
          type: 'object',
          required: ['rol_id', 'nombres', 'apellidos', 'correo', 'password'],
          properties: {
            rol_id: { type: 'integer', example: 2 },
            nombres: { type: 'string', example: 'Javier' },
            apellidos: { type: 'string', example: 'Curo' },
            correo: {
              type: 'string',
              format: 'email',
              example: 'javier@botica.com'
            },
            password: { type: 'string', example: 'Clave123' }
          }
        },

        CategoriaRequest: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: {
              type: 'string',
              example: 'ANALGESICOS'
            },
            descripcion: {
              type: 'string',
              example: 'Medicamentos para dolor y fiebre'
            }
          }
        },

        ProveedorRequest: {
          type: 'object',
          required: ['razon_social', 'ruc'],
          properties: {
            razon_social: {
              type: 'string',
              example: 'DISTRIBUIDORA FARMACEUTICA DEL SUR S.A.C.'
            },
            ruc: {
              type: 'string',
              example: '20456789123'
            },
            telefono: {
              type: 'string',
              example: '966123456'
            },
            correo: {
              type: 'string',
              format: 'email',
              example: 'ventas@difsur.com'
            },
            direccion: {
              type: 'string',
              example: 'Av. Ejército 123, Ayacucho'
            },
            contacto: {
              type: 'string',
              example: 'Carlos Medina'
            }
          }
        },

        ProductoRequest: {
          type: 'object',
          required: ['categoria_id', 'codigo', 'nombre'],
          properties: {
            categoria_id: {
              type: 'integer',
              example: 1
            },
            codigo: {
              type: 'string',
              example: 'PARA500TAB'
            },
            nombre: {
              type: 'string',
              example: 'Paracetamol 500 mg tabletas'
            },
            descripcion: {
              type: 'string',
              example: 'Caja x 100 tabletas'
            },
            unidad_medida: {
              type: 'string',
              example: 'CAJA'
            },
            stock_minimo: {
              type: 'number',
              example: 20
            },
            requiere_lote: {
              type: 'boolean',
              example: true
            },
            requiere_vencimiento: {
              type: 'boolean',
              example: true
            }
          }
        },

        CompraRequest: {
          type: 'object',
          required: [
            'proveedor_id',
            'tipo_comprobante',
            'numero_comprobante',
            'detalles'
          ],
          properties: {
            proveedor_id: {
              type: 'integer',
              example: 1
            },
            fecha_compra: {
              type: 'string',
              format: 'date',
              example: '2026-04-06'
            },
            tipo_comprobante: {
              type: 'string',
              example: 'FACTURA'
            },
            numero_comprobante: {
              type: 'string',
              example: 'F001-000124'
            },
            observacion: {
              type: 'string',
              example: 'Compra con usuario tomado del token'
            },
            detalles: {
              type: 'array',
              items: {
                type: 'object',
                required: ['producto_id', 'cantidad', 'precio_unitario'],
                properties: {
                  producto_id: {
                    type: 'integer',
                    example: 1
                  },
                  numero_lote: {
                    type: 'string',
                    example: 'LT-2026-003'
                  },
                  fecha_vencimiento: {
                    type: 'string',
                    format: 'date',
                    example: '2028-01-31'
                  },
                  cantidad: {
                    type: 'number',
                    example: 40
                  },
                  precio_unitario: {
                    type: 'number',
                    example: 0.95
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/docs/*.ts']
});