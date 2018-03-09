type WeatherIcon = 'clear-day'|'clear-night'|'rain'|'snow'|'sleet'|'wind'|'fog'|'cloudy'|'partly-cloudy-day'|'partly-cloudy-night';

class DataPoint {
    public apparentTemperature?:number;
    public cloudCover?:number;
    public dewPoint?:number;
    public humidity?:number;
    public icon?:WeatherIcon;
    public precipIntensity?:number;
    public precipProbability?:number;
    public precipType?:'rain'|'snow'|'sleet';
    public temperature?:number;
    public time:number = 0;
    public visibility:number = 10;
    public windBearing?:number;
    public windGust?:number;
    public windSpeed?:number;
    public summary?:string;
}

class DataPointDaily extends DataPoint {
    public apparentTemperatureHigh?:number;
    public apparentTemperatureLow?:number;
    public moonPhase?:number;
    public precipIntensityMax?:number;
    public temperatureHigh?:number;
    public temperatureLow?:number;
}

class DataBlock {
    public data:DataPoint[] = [];
    public summary?:string;
    public icon?:WeatherIcon;
}

class DataBlockDaily extends DataBlock {
    public data:DataPointDaily[] = [];
}

export { WeatherIcon , DataPoint, DataPointDaily , DataBlock, DataBlockDaily }