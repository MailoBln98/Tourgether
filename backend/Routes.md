## Dokumentation der Backend-Routen

Diese Datei dokumentiert die Routen des Backends der Tourgether-Anwendung. Jede Route ist mit ihrem HTTP-Methode, Pfad und einer kurzen Beschreibung versehen.

### Authentifizierung
- **POST /api/auth/register**
  - Registriert einen neuen Benutzer.
  - Erwartet JSON mit `name`, `email` und `password`.
  - Gibt 201 bei Erfolg, 400 bei fehlenden Daten oder 409 bei bereits registrierter E-Mail zurück.

- **POST /api/auth/verify/<token>**
  - Bestätigt die E-Mail-Adresse eines Benutzers.
  - Erwartet den Bestätigungstoken in der URL.
  - Gibt 200 bei Erfolg, 400 bei ungültigem oder abgelaufenem Token zurück.

- **POST /api/auth/login**
  - Meldet einen Benutzer an.
    - Erwartet JSON mit `email` und `password`.
    - Gibt 200 mit JWT Zugangstoken bei Erfolg, 400 bei fehlenden Daten oder 401 bei ungültigen Anmeldedatenoder nicht verifizierter E-Mail zurück.

- **POST /api/users/batch**
  - Gibt mehrere Benutzer anhand ihrer UUIDs zurück.
  - Erwartet ein JSON-Objekt mit einem Array von `user_ids`.
  - Gibt 200 mit den Benutzerdaten zurück oder 400 bei fehlenden oder ungültigen Daten.

#### JWT-Token
Die user id (`_id`) ist im JWT-Token enthalten, um den aktuell eingeloggten Benutzer zu identifizieren

### GPX-Routen
- **POST /api/upload_gpx**
  - Lädt eine GPX-Route hoch.
  - Erwartet ein Multipart/Form-Data-Request mit den folgenden Feldern:
    - 'gpx_file': Die GPX-Datei selbst.
    - 'start_time': Das Startdatum und die Startzeit im ISO 8601-Format (z.B. "2023-10-27T10:00:00Z").
    - 'start_point': Eine Zeichenfolge, die den Startpunkt als Koordinaten beschreibt (z.B. "52.45693768689539, 13.526196936079945").
  - Gibt 200 und routen ID bei Erfolg, 400 bei fehlenden Daten zurück.

- **GET /api/routes**
  - Gibt alle GPX-Routen zurück.
    - Gibt eine Liste aller Routen mit Ersteller und Teilnehmern im JSON-Format zurück.
    ```json
    [
      {
        "_id": "route_id",
        "gpx": "raw_gpx_data",
        "name": "route_name",
        "owner_uuid": "creator_id",
        "owner_name": "creator_name",
        "start_time": "ISO 8601 format",
        "start_point": "GPS coordinates",
        "registered_users": ["user_id1", "user_id2"],
      }
    ]
    ```

- **POST /api/routes/<route_id>/ride**
    - Fügt den aktuellen eingeloggten Benutzer als Teilnehmer zu einer GPX-Route hinzu.
    - Erwartet die Route-ID in der URL.
    - gibt 200 bei Erfolg, 404 bei nicht existierender Route zurück.

- **DELETE /api/routes/<route_id>/ride**
    - Entfernt den aktuellen eingeloggten Benutzer als Teilnehmer von einer GPX-Route.
    - Erwartet die Route-ID in der URL.
    - Gibt 200 bei Erfolg, 404 bei nicht existierender Route, 204 wenn der Nutzer gar nicht für die Route angemeldet war zurück.
    
