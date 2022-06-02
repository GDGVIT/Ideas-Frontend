<script>
  import { register } from 'register-service-worker';

  register('/service-worker.js', {
    registrationOptions: { scope: './' },
    ready(registration) {
      console.log('Service worker is active.');
    },
    registered(registration) {
      console.log('Service worker has been registered.');
    },
    cached(registration) {
      console.log('Content has been cached for offline use.');
    },
    updatefound(registration) {
      console.log('New content is downloading.');
    },
    updated(registration) {
      console.log('New content is available; please refresh.');
    },
    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
</script>

<main>
  <h1>DSC Ideas Hub</h1>
  <p>Get things made.</p>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
