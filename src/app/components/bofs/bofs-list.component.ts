import {FavoritesComponent} from "../events_partials/favorites.component";
import {OnInit, Component, OnDestroy} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {FilterComponent} from "../events_partials/filter.component";
import {EventService} from "../../services/event.service";
import {ListDetailsComponent} from "../events_partials/list-details.component";
import {Event} from "../../models/event";

declare var jQuery:any;

@Component({
    selector: 'events-list',
    templateUrl: '../../views/events_partials/menu.html',
    directives: [ROUTER_DIRECTIVES, FavoritesComponent, FilterComponent, ListDetailsComponent],
    providers: [EventService],
})


export class BofsListComponent implements OnInit, OnDestroy {

    public bofs:Event[] = [];
    public activeEvents:any = [];
    public hours:string[] = [];
    public noMatches:boolean = false;
    public dates:string[] = [];
    public activeDate:string;

    public title:string = 'BOFs';
    public router:string = '/bofs/';
    public event_type:string = 'bof';

    constructor(private _eventService:EventService) {
    }

    ngOnInit():void {
        this._eventService.getEventsByType('bof').then((bofs:Event[]) => {
            this.activeEvents = this._eventService.activeEvents;
            this.hours = this.getKeys(this._eventService.activeEvents);
            this.dates = this._eventService.dates;
            this.activeDate = this._eventService.activeDate || this.dates[0];
        })

        this._eventService.eventsChanged$.subscribe((data:Event[]|string) => {
            console.log('CHANGED');
            this.noMatches = false;
            if (!this.getKeys(this._eventService.activeEvents).length && data === 'filtered') {
                this.noMatches = true;
            }
            this.activeEvents = this._eventService.activeEvents;
            this.hours = this.getKeys(this._eventService.activeEvents);
            this.dates = this._eventService.dates;
            this.activeDate = this._eventService.activeDate || this.dates[0];
        })

        jQuery('body').addClass('view');
    }

    ngOnDestroy():void {
        jQuery('body').removeClass('view');
    }

    public setActiveDate(date:string) {
        this._eventService.setActiveDate(date, true);
        this.activeDate = date;
    }

    public getKeys(obj:Object) {
        return Object.keys(obj)
    }
}
