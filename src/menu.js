export const menuItems = [
  {
    id: "arepa-pabellon",
    nombre: "Arepa de Pabellón",
    descripcion: "Carne mechada, porotos negros, tajadas y queso duro.",
    precio: 5500,
    categoria: "Arepas",
    imagen_url: "/assets/pabellon.jpg",
    disponible: true,
    masPedido: true,
    opciones: [
      { nombre: "Extra Queso", precio: 800 },
      { nombre: "Extra Palta", precio: 1000 }
    ]
  },
  {
    id: "arepa-reina",
    nombre: "Arepa Reina Pepiada",
    descripcion: "Rellena con ensalada de pollo, palta y mayonesa.",
    precio: 5200,
    categoria: "Arepas",
    imagen_url: "/assets/reina.jpg",
    disponible: true,
    estrellas: 5
  },
  {
    id: "empanada-carne",
    nombre: "Empanada de Carne",
    descripcion: "Masa crujiente de maíz rellena de carne mechada sazonada.",
    precio: 1800,
    categoria: "Empanadas",
    imagen_url: "/assets/empanada-carne.jpg",
    disponible: true,
    nuevo: true
  },
  {
    id: "empanada-queso",
    nombre: "Empanada de Queso",
    descripcion: "Clásica empanada rellena de queso blanco fundido.",
    precio: 1600,
    categoria: "Empanadas",
    imagen_url: "/assets/empanada-queso.jpg",
    disponible: true,
    estrellas: 4
  },
  {
    id: "tequenos-racion",
    nombre: "Ración de Tequeños (6 unidades)",
    descripcion: "Deditos de queso envueltos en masa crujiente.",
    precio: 4800,
    categoria: "Tequeños",
    imagen_url: "/assets/tequenos.jpg",
    disponible: true,
    masPedido: true
  },
  {
    id: "churros-clasicos",
    nombre: "Churros con Chocolate",
    descripcion: "Ración de 6 churros con dip de chocolate caliente.",
    precio: 3800,
    categoria: "Churros",
    imagen_url: "/assets/churros.jpg",
    disponible: true,
    nuevo: true
  },
  {
    id: "pepito-mixto",
    nombre: "Pepito Mixto (Carne y Pollo)",
    descripcion: "Pan artesanal, carne, pollo, jamón, queso y papas pay.",
    precio: 8500,
    categoria: "Pepitos",
    imagen_url: "/assets/pepito.jpg",
    disponible: true,
    masPedido: true
  },
  {
    id: "papelon-limon",
    nombre: "Papelón con Limón",
    descripcion: "Bebida tradicional a base de caña de azúcar y jugo de limón.",
    precio: 1200,
    categoria: "Bebidas",
    imagen_url: "/assets/papelon.jpg",
    disponible: true
  },
  {
    id: "bebida-malta",
    nombre: "Malta (Botella)",
    descripcion: "Bebida de cebada gaseosa, clásica de Venezuela.",
    precio: 1500,
    categoria: "Bebidas",
    imagen_url: "/assets/malta.jpg",
    disponible: true
  },
  {
    id: "salsa-guacamole",
    nombre: "Guacamole de la Casa",
    descripcion: "Crema de palta artesanal (Pote 100ml).",
    precio: 800,
    categoria: "Salsas",
    imagen_url: "/assets/guacamole.jpg",
    disponible: true
  },
  {
    id: "salsa-ajo",
    nombre: "Salsa de Ajo",
    descripcion: "Nuestra famosa salsa de ajo casera (Pote 100ml).",
    precio: 700,
    categoria: "Salsas",
    imagen_url: "/assets/salsa-ajo.jpg",
    disponible: true
  },
  {
    id: "combo-arepero",
    nombre: "Combo Arepero",
    descripcion: "2 Arepas a elección + 1 Bebida + 1 Salsa.",
    precio: 9500,
    categoria: "Combos",
    imagen_url: "/assets/combo-arepas.jpg",
    disponible: true, 
    masPedido: true,
    estrellas: 5
  },
  {
    id: "combo-teque-party",
    nombre: "Combo Teque-Party",
    descripcion: "2 Raciones de Tequeños + 2 Bebidas + 2 Salsas.",
    precio: 12000,
    categoria: "Combos",
    imagen_url: "/assets/teque-party.jpg",
    disponible: true,
    nuevo: true
  }
];

export const categorias = ["Combos", "Arepas", "Empanadas", "Tequeños", "Churros", "Pepitos", "Bebidas", "Salsas"];
