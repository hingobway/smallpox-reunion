import React, { Component } from 'react';

class Caption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      captions: Array(this.props.images.length)
    };
  }
  handleChange = e => {
    const { captions } = this.state;
    captions[parseInt(e.target.getAttribute('image'), 10)] = e.target.value;
    this.setState({ captions });
  };

  render() {
    return (
      <div>
        <p>
          Caption each photo, and include an approximation of when it was taken
          (i.e. "Summer 1978" or "1975")
        </p>
        <div className="album py-5">
          <div className="container">
            <div className="row">
              {this.props.images.map((cur, ind) => (
                <div className="col-md-4" key={ind}>
                  <div className="card mb-4 shadow-sm">
                    <img
                      className="card-img-top"
                      src={cur.url}
                      alt={'image ' + (ind + 1)}
                      width={348}
                    />
                    <div className="card-body">
                      <p className="card-text">
                        <textarea
                          className="form-control"
                          placeholder="Caption"
                          maxLength="140"
                          image={ind}
                          onChange={this.handleChange}
                        />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => this.props.onSubmit(this.state.captions)}
        >
          Submit
        </button>
      </div>
    );
  }
}

export default Caption;
