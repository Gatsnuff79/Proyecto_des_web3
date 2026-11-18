// Importación de librerías necesarias para levantar el servidor API y conectar a MySQL
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Habilita peticiones desde el frontend (evita bloqueos CORS)
app.use(express.json());

// Configuración de conexión a la base de datos local en MySQL Workbench
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // Usuario de MySQL Workbench
    password: 'root',          // <-- ESCRIBE AQUÍ TU CONTRASEÑA DE MYSQL
    database: 'Pokemon_gen5'
});

// Verificación de conexión exitosa
db.connect((err) => {
    if (err) {
        console.error('Error al conectar con MySQL:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos Pokemon_gen5');
});

// Ruta GET principal: cruza las 4 tablas (Pokemon, Pokemon_Types, Ability y Pokedex)
app.get('/api/pokemon', (req, res) => {
    const sql = `
        SELECT 
            p.Pokemon_ID,
            p.Pokemon_Name,
            p.HP, p.ATK, p.DEF, p.SATK, p.SDEF, p.SPD,
            t1.Type_Name AS Tipo1,
            t2.Type_Name AS Tipo2,
            a.Ability_Name AS Habilidad,
            a.Ability_Desc AS Habilidad_Desc,
            px.Category AS Categoria,
            px.Weight AS Peso,
            px.Height AS Altura,
            px.Pokemon_Desc AS Descripcion
        FROM Pokemon p
        INNER JOIN Pokemon_Types t1 ON p.Type_ID1 = t1.Types_ID
        LEFT JOIN Pokemon_Types t2 ON p.Type_ID2 = t2.Types_ID
        INNER JOIN Ability a ON p.Ability_IDP = a.Ability_ID
        LEFT JOIN Pokedex px ON p.Pokemon_ID = px.Pokemon_ID
        ORDER BY p.Pokemon_ID ASC
    `;

    db.query(sql, (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(resultados);
    });
});

// Levanta el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor API escuchando en http://localhost:3000/api/pokemon');
});