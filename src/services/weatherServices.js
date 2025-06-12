import axios from 'axios';
import db from '../db.js';

export async function reverseGeocode(lat, lon) {
  const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
    params: {
      lat,
      lon,
      format: 'json',
    },
    headers: {
      'User-Agent': 'Wetter-App',
    },
  });

  return (
    response.data.address?.city ||
    response.data.address?.town ||
    response.data.address?.village ||
    'Unbekannt'
  );
}

export async function saveWetterdaten(ort_id, temperatur, windstaerke) {
  await db.execute(
    `INSERT INTO wetterdaten (ort_id, temperatur, windstaerke) VALUES (?, ?, ?)`,
    [ort_id, temperatur, windstaerke]
  );
}

export async function getForecastForLatLon(lat, lon) {
  try {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true,
      },
    });

    const weather = response.data.current_weather;

    return {
      temperatur: weather.temperature,
      wind: weather.windspeed,
      zeitpunkt: weather.time,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Fehler beim Abrufen der Wetterdaten.');
  }
}



export async function getOrtByName(name) {
  const [rows] = await db.execute('SELECT * FROM orte WHERE name = ?', [name]);
  return rows[0];
}

export async function addOrt(name, lat, lon) {
  const [result] = await db.execute(
    'INSERT INTO orte (name, lat, lon) VALUES (?, ?, ?)',
    [name, lat, lon]
  );

  const insertedId = result.insertId;

  const [rows] = await db.execute('SELECT * FROM orte WHERE id = ?', [insertedId]);
  return rows[0];
}

export async function getAllOrte() {
  const [rows] = await db.execute('SELECT * FROM orte');
  return rows;
}
