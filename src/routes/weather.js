import express from 'express';
import db from '../db.js';
import {
  saveWetterdaten,
  getOrtByName,
  reverseGeocode,
  addOrt,
  getAllOrte,
  getForecastForLatLon
} from '../services/weatherServices.js';
import { broadcastWarning } from '../websocket.js';


const router = express.Router();


router.post('/orte', async (req, res) => {
  try {
    const { lat, lon } = req.body;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Lat und Lon müssen angegeben werden.' });
    }

    const name = await reverseGeocode(lat, lon);
    if (!name) {
      return res.status(400).json({ error: 'Konnte keinen Ortsnamen ermitteln.' });
    }

    const neuerOrt = await addOrt(name, lat, lon);
    res.status(201).json(neuerOrt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Hinzufügen des Ortes.' });
  }
});

router.get('/orte', async (req, res) => {
  try {
    const orte = await getAllOrte();
    res.status(200).json(orte);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Laden der Orte.' });
  }
});

router.delete('/orte/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.execute('DELETE FROM orte WHERE id = ?', [id]);
    res.status(200).json({ message: 'Ort gelöscht' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Löschen des Ortes' });
  }
});

router.get('/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Lat und Lon müssen angegeben werden.' });
    }

    const ortsname = await reverseGeocode(lat, lon);
    if (!ortsname) {
      return res.status(400).json({ error: 'Konnte keinen Ortsnamen ermitteln.' });
    }

    let ort = await getOrtByName(ortsname);
    if (!ort) {
      ort = await addOrt(ortsname, lat, lon);
    }

    const forecast = await getForecastForLatLon(lat, lon);

    await saveWetterdaten(ort.id, forecast.temperatur, forecast.wind);

    res.status(200).json({
      ort: ortsname,
      lat,
      lon,
      ...forecast,
    });

    if (forecast.wind > 70 || forecast.temperatur > 38) {
      broadcastWarnung(`Unwetterwarnung in ${ortsname}: Temperatur ${forecast.temperatur}°C, Wind ${forecast.wind} km/h`);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Abrufen oder Speichern der Wetterdaten' });
  }
});

router.get('/wetterdaten/:ort_id', async (req, res) => {
  try {
    const ortId = req.params.ort_id;
    const [rows] = await db.execute(
      'SELECT * FROM wetterdaten WHERE ort_id = ? ORDER BY zeitpunkt DESC LIMIT 1',
      [ortId]
    );
    res.status(200).json(rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Laden der Wetterdaten' });
  }
});

router.post('/warnung', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Warnungsnachricht muss angegeben werden.' });
    }

    // Sende Warnung an alle WebSocket-Clients
    broadcastWarning(message);
    res.status(200).json({ message: 'Warnung gesendet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Senden der Warnung' });
  }
});


export default router;
