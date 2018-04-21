type WeatherIcon = 'clear-day'|'clear-night'|'rain'|'snow'|'sleet'|'wind'|'fog'|'cloudy'|'partly-cloudy-day'|'partly-cloudy-night';

class DataPoint {
    apparentTemperature?:number;
    cloudCover?:number;
    dewPoint?:number;
    humidity?:number;
    icon?:WeatherIcon;
    precipIntensity?:number;
    precipProbability?:number;
    precipType?:'rain'|'snow'|'sleet';
    temperature?:number;
    time:number = 0;
    visibility:number = 0;
    windBearing?:number;
    windGust?:number;
    windSpeed?:number;
    summary?:string;
}

class DataPointDaily extends DataPoint {
    apparentTemperatureHigh?:number;
    apparentTemperatureLow?:number;
    moonPhase?:number;
    precipIntensityMax?:number;
    temperatureHigh?:number;
    temperatureLow?:number;
}

class DataBlock {
    data:DataPoint[] = [];
    summary?:string;
    icon?:WeatherIcon;
}

interface DataBlockDaily extends DataBlock {
    data:DataPointDaily[];
}

export { WeatherIcon , DataPoint, DataPointDaily , DataBlock, DataBlockDaily }