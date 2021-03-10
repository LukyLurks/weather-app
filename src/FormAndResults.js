import React from 'react';
import './FormAndResults.css';

function FormAndResults(props) {
  return (
    <div className="FormAndResults">
			<h1>OpenWeatherApp</h1>
      <SearchForm
        onSubmit={props.handleQuerySubmit}
        onChange={props.handleQueryChange}
        value={props.state.query}
      />
      <WeatherResults
				state={props.state}
				countries={props.countries}
			/>
    </div>
  );
}

function SearchForm(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <label>
        <input
          id="searchField"
          type="text"
          onChange={props.onChange}
          value={props.value}
          required
					placeholder="City or State"
					autoFocus={true}
        />
      </label>
      <button type="submit">
				<span role="img" aria-label="magnifying glass emoji">🔍</span> Search
			</button>
    </form>
  );
}

function WeatherResults(props) {
  if (props.state.data) {
    return (
      <WeatherDetails
        data={props.state.data}
				countries={props.countries}
      />
    );
  }
  return <WeatherNotFound error={props.state.error} data={props.state.data} />;
}

function WeatherNotFound(props) {
	const message = <>
		<h2>{props.error ? props.error.message : ""}</h2>
		<p>
			You can specify a country/state after a comma, for example:
		</p>
		<ul>
			<li>"paris, texas" (or "paris, tx")</li>
			<li>"melbourne, australia" (or "melbourne, au")</li>
		</ul>
	</>
  return (
    <div className="WeatherResults">{message}</div>
  );
}

class WeatherDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			countryName: '',
		};
	}
	
	componentDidMount() {
		this.getCountryName();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.data.sys.country !== this.props.data.sys.country) {
			this.getCountryName();
		}
	}

  getCelsius() {
    return `${Math.round(this.props.data.main.temp - 273.15)}°C`;
  }

  getFahrenheit() {
    return `${Math.round(this.props.data.main.temp * (9 / 5) - 459.67)}°F`;
  }

	async getCountryName() {
		if (!this.props.data) return;
		const countryCode = this.props.data.sys.country;
		const countries = await this.props.countries;
		const name = countries.find(country => country.code === countryCode).name;
		this.setState({ countryName: name });
	}

	getIconPath() {
		const iconId = this.props.data.weather[0].icon;
		return `http://openweathermap.org/img/wn/${iconId}.png`;
	}

  render() {
    return (
      <div className="WeatherResults">
				<h2>
					{this.props.data.name}, {this.state.countryName}
				</h2>
				<img id="weather-icon"
					src={this.getIconPath()}
					alt={this.props.data.weather[0].description}
				/>
        <ul>
					<li>
						{this.props.data.weather[0].description}
					</li>
          <li>
            {this.getCelsius()} / {this.getFahrenheit()}
          </li>
        </ul>
      </div>
    );
  }
}

export default FormAndResults;
