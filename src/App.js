import React from 'react';
import './App.css';
import './reset.css';
import FormAndResults from './FormAndResults.js';

class WeatherApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      data: null,
      error: null,
      celsius: true,
    };

		this.countries = fetch(
			'countries.json',
			{
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}
		).then(response => response.json());

		this.usStates = fetch(
			'usstates.json',
			{
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}
		).then(response => response.json());

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleTempScale = this.toggleTempScale.bind(this);
		this.preprocessQuery = this.preprocessQuery.bind(this);
  }

  handleChange({ target }) {
    this.setState({ query: target.value });
  }

	async preprocessQuery(event) {
		event.preventDefault();
		const query = this.state.query.trim();
		if (/(,\s?(\w{3,}))$/.test(query)) {
			const specifiedPlace = query.match(/(,\s?(?<country>\w{3,}))$/)[2].toLowerCase();
			try {
				this.countries.then(data => {
					for (const entry of data) {
						if (specifiedPlace === entry.name.toLowerCase()) {
							const newQuery = query.replace(specifiedPlace, entry.code);
							return this.handleSubmit(newQuery);
						}
					}
				});
				this.usStates.then(data => {
					for (const entry of data) {
						if (specifiedPlace === entry.name.toLowerCase()) {
							const newQuery = query.replace(specifiedPlace, entry.code) + ', us';
							return this.handleSubmit(newQuery);
						}
					}
				});
			} catch (e) {
				console.log(e);
			}
		}
		return this.handleSubmit(query);
	}

  async handleSubmit(query) {
    const key = 'f90f55ac16dce1d2e99f1bc07cc2c077';
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${key}`
    );
    try {
      if (!response.ok) throw Error(response.statusText);
      const data = await response.json();
      this.setState({ data, error: null });
    } catch (error) {
			// Users from the US won't have to enter both their state code and "US"
			if (response.status === 404 && !/(?:us)$/i.test(query.slice(-2))) {
				this.handleSubmit(query + ', us');
			} else {
				this.setState({ error, data: null });
			}
    }
  }

  toggleTempScale() {
    this.setState((state) => ({ celsius: !state.celsius }));
  }

  /**
   * Gets the main weather condition name, so we can adjust the
   * background accordingly. See https://openweathermap.org/weather-conditions
   */
  getMainWeather() {
    if (!this.state.data) return 'Clear';
    if (/7\d\d/.test(`${this.state.data.weather[0].id}`)) {
      return 'Obscured';
    }
    return this.state.data.weather[0].main;
  }

  render() {
    return (
      <div className={`WeatherApp ${this.getMainWeather()}`}>
        <FormAndResults
          handleChange={this.handleChange}
          handleSubmit={this.preprocessQuery}
          toggleTempScale={this.toggleTempScale}
          state={this.state}
					countries={this.countries}
        />
      </div>
    );
  }
}

export default WeatherApp;
