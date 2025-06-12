# Weather Website Projekt by Exel
Das Ziel diese Website ist, das der User die Möglichkeit hat, Latitude und Longitude eingeben kann und dann zu diesen Koordinaten 
die Temperatur, die Windstärke und den aktuellen Zeitpunkt der Daten bekommt. Man kann Orte hinzufügen (diese werden auch in die Datenbank gespeichert) damit man nicht immer Lat. und Long. angeben muss. Das Backend gibt nach eingabe der Koordinaten den Namen des Ortes zurück. (Z.b 48 - 16.3  ist Wien).

## Projekt starten
Projekt von meinem git #link runterladen und in den Projektordner (SYT-ENDPROJEKT) eine Powershell öffnen
```
docker compose build --no-cache
docker compose up -d
```

**Frontend: http://localhost:4200**

**Backend: http://localhost:3000/api/v1/weather**

**Swagger Doku: http://localhost:3000/api/v1/weather/api-docs**