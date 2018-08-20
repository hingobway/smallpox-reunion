import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Caption from './Caption';

import axios from 'axios';
import form from 'form-data';
import $ from 'jquery';

import '../dropzone.css';
import '../Submit.css';

const Dropzone = window.Dropzone;

const Alert = props => {
  const cases = {
    USER_ALREADY_SUBMITTED: 'Someone already submitted with that email.',
    MISSING_USER_INFORMATION: 'Not all fields were filled out correctly.',
    UPLOAD_FAILED: 'The server had a problem. Try again in a few minutes.'
  };
  let msgs = [
    'Your submission was received.', // 0
    'An error occurred uploading your photos' +
      (props.case
        ? cases[props.case]
          ? `: ${cases[props.case]}`
          : `: ${props.case}`
        : '.')
  ];
  let types = ['success', 'danger'];
  return (
    <div className={'alert alert-' + types[props.msg]} role="alert">
      {msgs[props.msg]}
    </div>
  );
};

export default class Submit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      alert: [],
      loading: false,
      caption: null
    };

    this.formRef = React.createRef();
  }

  domain = this.props.domain;

  before;
  after;

  handleErr = err => {
    if (err.response) {
      this.setState({
        alert: [1, err.response.data.error],
        loading: false
      });
      console.log(
        err.response.status,
        err.response.statusText,
        err.response.data
      );
    } else console.log(err);
    this.clearForm();
  };

  componentDidMount() {
    const opts = {
      url: '#',
      autoProcessQueue: false,
      maxFiles: 3,
      maxFilesize: 10,
      acceptedFiles: 'image/*',
      dictFileTooBig: 'Sorry, we only take files of {{maxFilesize}} MB or less.'
    };
    this.before = new Dropzone('#before-photo', opts);
    this.after = new Dropzone('#after-photo', opts);
  }

  clearForm() {
    if (!this.state.caption) {
      this.formRef.current.reset();
      this.before.removeAllFiles(true);
      this.after.removeAllFiles(true);
    }
    this.setState({
      name: '',
      email: '',
      caption: null
    });
    setTimeout(() => this.setState({ alert: [] }), 8000);
  }

  handleChange = e => {
    let name = e.target.name;
    let val = e.target.value;
    this.setState({
      [name]: val
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });
    this.scrollToTop();
    let data = new form();
    data.append('name', this.state.name);
    data.append('email', this.state.email);
    this.before.getQueuedFiles().forEach(cur => data.append('before', cur));
    this.after.getQueuedFiles().forEach(cur => data.append('after', cur));
    axios
      .post(this.domain + '/api/entry/upload', data)
      .then(({ data }) => {
        this.setState({
          caption: data.images,
          loading: false
        });
      })
      .catch(this.handleErr);
  };

  submitCaptions = captions => {
    const data = {
      captions: this.state.caption.map((cur, ind) => ({
        id: cur.id,
        caption: captions[ind]
      }))
    };
    axios
      .post(this.domain + '/api/image/caption/bulk', data)
      .then(() => {
        this.setState({ alert: [0] });
        this.clearForm();
      })
      .catch(this.handleErr);
  };

  scrollToTop() {
    $('html, body').animate({ scrollTop: 0 }, 225);
  }

  render() {
    return (
      <main role="main">
        {this.state.alert.length !== 0 ? (
          <Alert msg={this.state.alert[0]} case={this.state.alert[1]} />
        ) : null}
        <div
          className={
            'container mt-4 mover' + (this.state.loading ? ' active' : '')
          }
        >
          <div className="row justify-content-center">
            <div
              className={'spinner' + (this.state.loading ? ' active' : '')}
            />
          </div>
          <h1 className="mt-1">Submit an Entry</h1>
          {this.state.caption ? (
            <Caption
              images={this.state.caption}
              onSubmit={this.submitCaptions}
            />
          ) : (
            <div>
              <p>
                Use this form to submit your photos. If you have any questions,
                we encourage you to read the <Link to="/about">about page</Link>{' '}
                before submitting.
              </p>
              <form
                className="mt-2"
                onSubmit={this.handleSubmit}
                ref={this.formRef}
              >
                <div className="form-group">
                  <label htmlFor="userName">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    name="name"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="userEmail">Email</label>
                  <input
                    type="email"
                    className="form-control mb-5"
                    id="userEmail"
                    name="email"
                    onChange={this.handleChange}
                  />
                </div>
                <h5>Life during the epidemic: 1972-1977 (Up to 3 photos)</h5>
                <div className="dropzone2 mb-4" id="before-photo">
                  Drag photo(s) here or click.
                </div>
                <h5>Life since: 1978-Now (Up to 3 photos)</h5>
                <div className="dropzone2 mb-2" id="after-photo">
                  Drag photo(s) here or click.
                </div>
                <button type="submit" className="btn btn-primary">
                  Next
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    );
  }
}
