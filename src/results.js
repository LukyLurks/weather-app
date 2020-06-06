import React from 'react';
import './WeatherResults.css';

function WeatherResults(props) {
  if (props.state.data) {
    return (
      <WeatherDetails
        data={props.state.data}
        celsius={props.state.celsius}
        toggle={props.toggle}
      />
    );
  }
  return <WeatherNotFound error={props.state.error} />;
}

function WeatherNotFound(props) {
  return (
    <div className="WeatherResults">
      <p>{props.error ? props.error.message : 'No data to display'}</p>
    </div>
  );
}

class WeatherDetails extends React.Component {
  getCelsius() {
    return `${Math.round(this.props.data.main.temp - 273.15)}°C`;
  }
  getFahrenheit() {
    return `${Math.round(this.props.data.main.temp * (9 / 5) - 459.67)}°F`;
  }
  render() {
    return (
      <div className="WeatherResults">
        <ul>
          <li>
            {this.props.data.name}, {this.props.data.sys.country}
          </li>
          <li>
            {this.props.celsius ? this.getCelsius() : this.getFahrenheit()}
          </li>
          <button onClick={this.props.toggle}>°C ↔ °F</button>
        </ul>
      </div>
    );
  }
}

export default WeatherResults;
