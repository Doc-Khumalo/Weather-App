import React from 'react';
import { render, ReactDOM } from 'react-dom';
import axios from 'axios';
import './src/components/weather.css';

function setIcon(data) {
    const icon = data[0].weather[0].icon;
    const des = data[0].weather[0].description;
    const URL =  `http://openweathermap.org/img/w/${icon}.png`;

    return (
        <img src={URL} alt={des} className="img-circle weatherIcon" />
    );
}

function sortByDate(data) {
    const d = data
            .map((d) => {
                const t = (new Date(d['dt_txt'])).toString().substring(0,3)
                const obj = {
                    time: t,
                    temp: d.main.temp,
                    len: 1
                };
                return obj;
            })
            .reduce((last,now, currentIndex) => {
                if(currentIndex === 0) {
                    last.push(now);
                    return last;
                }
                var index = last.findIndex((i, index) => {
                    return i.time === now.time;
                });

                if(index === -1) {
                    last.push(now);
                } else {
                    let item = last[index];
                    item.len += 1;
                    item.temp = (item.temp + now.temp) / 2;
                }

                return last;
            },[]);
    d.forEach((i) => {
        i.temp = parseInt(i.temp - 273.15);
    });
    return d;
}

class SearchBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {term: ''};
	}

	handleInputChange(term) {
		this.setState({term});
	}

	handleFormSubmit(e) {
		e.preventDefault();
		this.props.fetchWeather(this.state.term);
		this.setState({term: ''});
	}

	render() {
		return (
			<form onSubmit={(e) => { this.handleFormSubmit(e) }} className="input-group">
				<input
					placeholder="Get a five-day forecast in your favorite cities"
					className="form-control"
					value={this.state.term}
					onChange={(e) => this.handleInputChange(e.target.value)} />
				<span className="input-group-btn">
					<button type="submit" className="btn btn-secondary">Submit</button>
				</span>
			</form>
		);
	}
}

class Forecast extends React.Component {
    renderWeatherForecast(data) {
        const d = sortByDate(data);
        return d.map((i) => {
                return (
                    <li key={i.time} className="list-item">
                        <span>{i.time.toUpperCase()}</span>
                        <span>{i.temp + "˚C"}</span>
                    </li>
                );
            });
    }
    render() {
        // console.log(this.renderWeatherForecast(this.props.data));
        return (
            <ul className="pull-right list">
                {this.renderWeatherForecast(this.props.data)}
            </ul>
        );
    }
}

class CityCard extends React.Component {
    inThreeHoursData(data) {
        data = data[0];
        return parseInt(data.main.temp - 273.15);
    }

    render() {
        const name = this.props.cityData.city.name;
        const data = this.props.cityData.list;

        console.log(this.props.cityData);
        console.log(data[0], 'test');

        return (
            <div className="card">
                <div className="cityName text-left">{name}</div>
                <div>
                    {setIcon(data)}
                </div>
                <div>
                    <Forecast data={data}/>
                </div>
                <div className="inThreeHours">
                   {this.inThreeHoursData(data)} ˚C
                </div>
            </div>
        );
    }
}

class WeatherList extends React.Component {
	renderWeather(cityData) {
		if(cityData.cod === '404') {
			return;
		}

		return (
           <CityCard
               cityData={cityData}
               key={cityData.city.id}/>
		);

	}

	render() {
		return (
			<div>
				{this.props.weather.reverse().map(this.renderWeather)}
			</div>
		);
	}
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        weather: []
    }

    this.getCurrentLocation();

    this.fetchWeather = this.fetchWeather.bind(this);
  }

  getCurrentLocation() {
      const city = geoplugin_city();
      this.fetchWeather(city);
  }

  fetchWeather(term) {
    const API_KEY = '0816556fcf2cfb397c9a76a1cc873966';
    const ROOT_URL = `http://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`;

    const url = `${ROOT_URL}&q=${term},us`;
    console.log(url);
	axios.get(url)
                 .then((res) => {
                     const data = this.state.weather;
                     this.setState({ weather: data.concat([res.data])});
                 });
  }

  render() {
    return (
        <div className="container-fluid">
            <SearchBar fetchWeather={this.fetchWeather}/>
            <WeatherList weather={this.state.weather}/>
        </div>
    );
  }
}

render(<App />, document.getElementById('app'));