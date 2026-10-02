# Backend deployment checklist

1. Provision MongoDB Atlas.
2. Set `MONGODB_URI`, `JWT_SECRET`, and optional Twilio variables.
3. Build with `mvn clean package -DskipTests`.
4. Run `java -jar target/careernest-backend-1.0.0.jar`.
5. Confirm `GET /api/jobs` returns JSON.
6. Point the frontend `VITE_API_URL` to `<backend>/api`.
7. Restrict CORS to the production frontend origin before a public production launch.

## Twilio

Set:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

The app intentionally falls back to console logging when these are absent, so registration/job application flows remain usable during development.
