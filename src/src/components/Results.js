import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import zlib from 'zlib';

import '../Results.css';

const $ = window.$;

const encode = obj => zlib.deflateSync(JSON.stringify(obj)).toString('base64');
const decode = str =>
  JSON.parse(zlib.unzipSync(Buffer.from(str, 'base64')).toString());

export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = { ready: false, entries: [], modal: {} };
  }

  domain = this.props.domain;

  componentDidMount() {
    axios.get(this.domain + '/api/entry/all').then(({ data }) => {
      this.setState({ entries: data.entries, ready: true });
      $(window.location.hash)
        .get(0)
        .scrollIntoView();
    });
  }

  makeBig = e => {
    const modal = decode(e.currentTarget.getAttribute('info'));
    this.setState({ modal });
    $('#pictureLarge').modal();
  };

  render() {
    if (this.state.ready) {
      const image = user => (img, ind) => {
        const info = {
          url: img.url,
          caption: img.caption,
          user: user
        };
        return (
          <div
            key={ind}
            className="card mx-2"
            info={encode(info)}
            onClick={this.makeBig}
            style={{ cursor: 'pointer', minWidth: 240 }}
          >
            <img src={img.url} className="card-img-top" alt="pic" />
            <div className="card-body">
              <p className="card-text">
                <i>{img.caption}</i>
              </p>
            </div>
          </div>
        );
      };

      const entries = this.state.entries.map((cur, ind) => (
        <div
          key={ind}
          id={cur.user.name
            .toLowerCase()
            .replace(/(?!^)(?!\.)\W(?!$)/g, '-')
            .replace(/^(?!\.)\W|(?!\.)\W$|\./g, '')}
        >
          <h3>{cur.user.name}</h3>
          <h5>
            <i>Before:</i>
          </h5>
          <div className="imgs-cont">
            <div className="img-cont">
              {cur.before.map(image(cur.user.name))}
            </div>
          </div>
          <h5>
            <i>After:</i>
          </h5>
          <div className="imgs-cont">
            <div className="img-cont">
              {cur.after.map(image(cur.user.name))}
            </div>
          </div>
          <hr />
        </div>
      ));

      return (
        <main role="main">
          <div className="modal fade" id="pictureLarge" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{this.state.modal.user}</h5>
                </div>
                <div className="modal-body">
                  <img
                    src={this.state.modal.url}
                    style={{ width: '100%' }}
                    alt="pic"
                  />
                </div>
                <div
                  className="modal-footer"
                  style={{ justifyContent: 'flex-start' }}
                >
                  <p>{this.state.modal.caption}</p>
                </div>
              </div>
            </div>
          </div>

          <section className="jumbotron text-center pt-5">
            <div className="container">
              <h1 className="jumbotron-heading">Submissions</h1>
              <p className="lead text-muted">
                Browse through submitted photos. Click on any photo to enlarge
                it.
              </p>
            </div>
          </section>
          <section className="container">
            {entries.length ? (
              entries
            ) : (
              <p className="text-muted text-center">
                Nothing here yet. <Link to="/submit">Submit yours!</Link>
              </p>
            )}
          </section>
        </main>
      );
    } else
      return (
        <div className="row justify-content-center mt-4">
          <div className="spinner active" />
        </div>
      );
  }
}
