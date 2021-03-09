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
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.toggleTempScale = this.toggleTempScale.bind(this);
		this.preprocessQuery = this.preprocessQuery.bind(this);
  }

	componentDidMount() {
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
	}

  handleQueryChange({ target }) {
    this.setState({ query: target.value });
  }

	/**
	 * Allows for more intuitive/user-friendly queries that the API doesn't
	 * normally accept, like specifying country/state names in full letters
	 * instead of ISO codes, etc.
	 */
	async preprocessQuery(event) {
		event.preventDefault();
		const query = this.state.query.trim();
		// ', tx' or ',australia' in stuff like 'paris, tx' or 'melbourne,australia'
		const querySuffix = /(,\s?(?<place>\w{2,}))$/i;
		if (querySuffix.test(query)) {
			const specifiedPlace = query.match(querySuffix)[2].toLowerCase();
			try {
				const countries = await this.countries;
				for (const entry of countries) {
					if (specifiedPlace === entry.name.toLowerCase()) {
						const newQuery = query.replace(specifiedPlace, entry.code);
						return this.sendQuery(newQuery);
					}
				}
				const usStates = await this.usStates;
				for (const entry of usStates) {
					if (specifiedPlace === entry.name.toLowerCase()) {
						const newQuery = query.replace(specifiedPlace, entry.code) + ', us';
						return this.sendQuery(newQuery);
					}
					if (specifiedPlace === entry.code.toLowerCase()) {
						const newQuery = query + ', us';
						return this.sendQuery(newQuery);
					}
				}
			} catch (e) {
				console.log(e);
			}
		}
		return this.sendQuery(query);
	}

  async sendQuery(query) {
    const key = 'f90f55ac16dce1d2e99f1bc07cc2c077';
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${key}`
    );
    try {
      if (!response.ok) throw Error(response.statusText);
      const data = await response.json();
      this.setState({ data, error: null });
    } catch (error) {
			this.setState({ error, data: null });
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
          handleQueryChange={this.handleQueryChange}
          handleQuerySubmit={this.preprocessQuery}
          toggleTempScale={this.toggleTempScale}
          state={this.state}
					countries={this.countries}
        />
      </div>
    );
  }
}

export default WeatherApp;
