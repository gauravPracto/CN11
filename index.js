const express = require("express");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const PORT = 3000;
const app = express();

Sentry.init({
  dsn: "https://51c09111b1cc4d59bcffe08aefb7c944@o1143369.ingest.sentry.io/6203722",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// All controllers should live here
app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  res.send({
    "dsn-id":
      "https://51c09111b1cc4d59bcffe08aefb7c944@o1143369.ingest.sentry.io/6203722",
    success: "False",
  });
});

app.listen(PORT, (err) =>
  err ? console.log(err.message) : console.log(`running on port ${PORT}`)
);
