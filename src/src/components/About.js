import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <main role="main">
    <section className="jumbotron text-center pt-5">
      <div className="container">
        <h1 className="jumbotron-heading">About the Project</h1>
        <p className="lead text-muted">
          We're very excited to announce the Smallpox Reunion Official Photo
          Site! Here are the rules and workings in full. <br />
          After you've read them, <Link to="/submit">submit your entry</Link>!
        </p>
      </div>
    </section>
    <section className="container">
      <h3>The Process</h3>
      <ul>
        <li>
          Find three photos from your experience in Bangladesh, from about
          1972-1976.
        </li>
        <li>Find three photos from your life since, 1978-2018.</li>
        <li>Upload the photos to the submission page.</li>
        <li>
          Caption each photo with a title and an approximation of when it was
          taken.
        </li>
        <li>
          You can browse everyone's photos on the{' '}
          <Link to="/results">Submissions</Link> page.
        </li>
      </ul>
      <p>
        <i>NOTE:</i> You can only submit once per email. If there was an error
        you'd like fixed, contact{' '}
        <a href="mailto:smallpox@hingobway.me">smallpox@hingobway.me</a>.
      </p>
      <h3>Problems?</h3>
      <p>
        Email <a href="mailto:smallpox@hingobway.me">smallpox@hingobway.me</a>{' '}
        with any questions.
      </p>
    </section>
  </main>
);
