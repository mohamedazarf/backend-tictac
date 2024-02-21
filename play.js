const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());


app.use(express.static('public'));

const port = 3000;
const cors = require('cors');
app.use(cors());

// Importer le module sqlite3
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('jeux.db');

// Ouvrir la connexion à la base de données
db.serialize(() => {
    // Créer la table jeux
    db.run(`CREATE TABLE jeux (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temps_jeu DATETIME,
        resultat TEXT CHECK (resultat IN ('gagné', 'perdu'))
    )`, (err) => {
        if (err) {
            console.error('Erreur lors de la création de la table : ', err.message);
        } else {
            console.log('Table jeux créée avec succès.');
        }
    });

    db.run(`CREATE TABLE game (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temps_jeu DATETIME,
        winner TEXT CHECK (winner IN ('X', 'O'))
    )`, (err) => {
        if (err) {
            console.error('Erreur lors de la création de la table "game" : ', err.message);
        } else {
            console.log('Table "game" créée avec succès.');
        }
    });
});


// db.serialize(() => {
//     // Ajouter la colonne "gagnant"
//     db.run(`ALTER TABLE jeux ADD COLUMN gagnant TEXT`, (err) => {
//         if (err) {
//             console.error('Erreur lors de l\'ajout de la colonne : ', err.message);
//         } else {
//             console.log('Colonne ajoutée avec succès.');
//         }
//     });
// });





app.get('/gagner', (req, res) => {
    // Insérer une nouvelle entrée dans la table jeux
    db.run(`INSERT INTO jeux (temps_jeu, resultat) VALUES (?, ?)`, [new Date(), 'gagné'], (err) => {
        if (err) {
            console.error('Erreur lors de l\'insertion des données : ', err.message);
            res.status(500).send('Erreur lors de l\'insertion des données');
        } else {
            console.log('Données insérées avec succès.');
            res.send('Données insérées avec succès.');
        }
    });
});

app.get('/win', (req, res) => {
    const winner = req.query.winner; // Récupérer le gagnant depuis la requête GET
  
    // Insérer une nouvelle entrée dans la table "game" avec le gagnant
    db.run(`INSERT INTO game (temps_jeu, winner) VALUES (?, ?)`, [new Date(), winner], (err) => {
      if (err) {
        console.error('Erreur lors de l\'insertion des données : ', err.message);
        res.status(500).send('Erreur lors de l\'insertion des données');
      } else {
        console.log('Données insérées avec succès.');
        res.send('Données insérées avec succès.');
      }
    });
  });
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    return date.toLocaleString('fr-FR', options);
}
app.get('/show', (req, res) => {
    db.all(`SELECT * FROM jeux`, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des données : ', err.message);
            res.status(500).send('Erreur lors de la récupération des données');
        } else {
            // Formater chaque timestamp dans le tableau de données
            const formattedRows = rows.map(row => ({
                id: row.id,
                temps_jeu: formatTimestamp(row.temps_jeu),
                resultat: row.resultat
            }));
            console.log('Données récupérées avec succès : ', formattedRows);
            res.send(formattedRows);
        }
    });
});

app.get('/games', (req, res) => {
    // Récupérer toutes les entrées de la table "game"
    db.all(`SELECT * FROM game`, (err, rows) => {
      if (err) {
        console.error('Erreur lors de la récupération des données : ', err.message);
        res.status(500).send('Erreur lors de la récupération des données');
      } else {
        // Formater les données récupérées si nécessaire
        console.log('Données récupérées avec succès : ', rows);
        res.send(rows);
      }
    });
  });
  

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
app.get("/api",(req,res)=>{
    res.send("from backend")
})



