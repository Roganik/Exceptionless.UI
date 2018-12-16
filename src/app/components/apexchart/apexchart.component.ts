import {Component, Input, OnInit, SimpleChanges, OnChanges} from '@angular/core';

@Component({
    selector: 'app-apexchart',
    templateUrl: './apexchart.component.html',
    styleUrls: ['./apexchart.component.less']
})
export class ApexchartComponent implements OnInit, OnChanges {

    @Input() options;
    @Input() seriesData;

    chart: any;

    constructor() {
    }

    ngOnInit() {
        this.chart = new ApexCharts(document.querySelector('#apexchart'), this.options);
        this.chart.render();
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('apexchart-on-changes');
        console.log(changes);
        if (this.chart) {
            this.chart.updateSeries(changes.seriesData.currentValue);
        }
    }
}