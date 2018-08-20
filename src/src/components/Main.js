import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <main role="main">
    <section className="jumbotron text-center">
      <div className="container">
        <h1 className="jumbotron-heading">
          Bangladesh Smallpox Coming-Together
        </h1>
        <p className="lead text-muted">
          <b>MIRROR LAKE NH &ndash; SEPTEMBER 29 - OCTOBER 1, 2018</b>
          <br />
          As part of our coming together, we are asking you to provide 6
          pictures of your life to this online collection.
        </p>
        <p>
          <Link to="/about" className="btn btn-primary my-2 mr-1">
            Learn More
          </Link>
          <Link to="/submit" className="btn btn-secondary my-2">
            Submit your Entry
          </Link>
        </p>
      </div>
    </section>
  </main>
);
