import React from 'react';
import FormAndResults from './search';

class WeatherApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      data: null,
      error: null,
      celsius: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleScale = this.toggleScale.bind(this);
  }

  handleChange({ target }) {
    this.setState({ query: target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const query = this.state.query;
    const key = 'f90f55ac16dce1d2e99f1bc07cc2c077';

    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${key}`
    );
    try {
      if (!response.ok) throw Error(response.statusText);
      const data = await response.json();
      this.setState({ data, error: null });
    } catch (error) {
      this.setState({ error, data: null });
    }
  }

  toggleScale() {
    this.setState((state) => ({ celsius: !state.celsius }));
  }

  render() {
    return (
      <div className="WeatherApp">
        <FormAndResults
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          toggleScale={this.toggleScale}
          state={this.state}
        />
      </div>
    );
  }
}

export default WeatherApp;
