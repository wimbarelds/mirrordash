interface Point {
    x:number;
    y:number;
}

interface PrecipitationPoint extends Point {
    h:number;
}

interface RangePoint {
    value:number;
    text:string;
    pos:number;
}

interface Range {
    min:number;
    max:number;
    range:RangePoint[];
}

class Scaler {
    private size:Point;
    private margins:Point;

    public constructor(size:Point, margins:Point) {
        this.size = size;
        this.margins = margins;
    }

    public setSize(size:Point) {
        this.size = size;
    }

    public setMargins(margins:Point) {
        this.margins = margins;
    }

    public x(pct:number):number {
        return Math.round(this.margins.x + ((this.size.x - (this.margins.x * 2)) * pct));
    }

    public y(pct:number):number {
        return this.size.y - Math.round(this.margins.y + ((this.size.y - (this.margins.y * 2)) * pct));
    }
}

export { Scaler, Point, PrecipitationPoint, RangePoint, Range }