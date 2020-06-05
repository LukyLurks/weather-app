import React from 'react';
import WeatherResults from './results';

function FormAndResults(props) {
  return (
    <>
      <SearchForm
        onSubmit={props.handleSubmit}
        onChange={props.handleChange}
        value={props.state.query}
      />
      <WeatherResults state={props.state} toggle={props.toggleScale} />
    </>
  );
}

function SearchForm(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <label>
        Search for a city. You can specify a country code, or an American state.
        <br />
        Examples: "Melbourne, AU" for Melbourne in Australia, "Paris, TX, US"
        for Paris in Texas, etc.
        <br />
        <input
          id="searchField"
          type="text"
          onChange={props.onChange}
          value={props.value}
          required
        />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}

export default FormAndResults;
