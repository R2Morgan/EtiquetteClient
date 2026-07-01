import { Component, inject, OnInit } from '@angular/core';
import {IonContent, IonIcon, IonSpinner} from '@ionic/angular/standalone';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { locationOutline, peopleOutline, lockClosedOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api-service';
import {EtiquetteEvent} from '../../models/EtiquetteEvent';
import { HeaderComponentComponent } from '../shared/header/header-component.component';
import { FooterComponent } from '../shared/footer/footer.component';
import {User} from "../../models/User";

interface EventGroup {
  label: string;
  events: EtiquetteEvent[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [IonContent, IonIcon, NgIf, NgFor, NgClass, DatePipe, HeaderComponentComponent, FooterComponent, IonSpinner]
})
export class CalendarComponent implements OnInit {
  private apiService = inject(ApiService);

  events: EtiquetteEvent[] = [];
  user: User | null = null;
  groupedEvents: EventGroup[] = [];
  selectedEvent: EtiquetteEvent | null = null;
  booking = false;
  headerDateRange = '';
  loading = false;

  get hasWhiteTie(): boolean {
    return this.user?.membershipType === 2;
  }

  constructor() {
    addIcons({ locationOutline, peopleOutline, lockClosedOutline });
  }

  ngOnInit() {
    this.loading = true;
    this.apiService.getMe().subscribe(user => {
      this.user = user;
    });

    this.apiService.getEvents().subscribe(events => {
      console.log('events received:', events);
      this.events = events;
      this.groupEvents(events);
      this.setHeaderDateRange(events);
      this.loading = false;
    });
  }

  groupEvents(events: EtiquetteEvent[]) {
    const now = new Date();
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);

    const thisMonth = events.filter(e => new Date(e.date) <= thisMonthEnd);
    const nextMonth = events.filter(e => {
      const d = new Date(e.date);
      return d > thisMonthEnd && d <= nextMonthEnd;
    });
    const later = events.filter(e => new Date(e.date) > nextMonthEnd);

    this.groupedEvents = [
      ...(thisMonth.length ? [{ label: 'This month', events: thisMonth }] : []),
      ...(nextMonth.length ? [{ label: 'Next month', events: nextMonth }] : []),
      ...(later.length ? [{ label: 'Later', events: later }] : [])
    ];
  }

  setHeaderDateRange(events: EtiquetteEvent[]) {
    if (!events.length) return;
    const first = new Date(events[0].date);
    const last = new Date(events[events.length - 1].date);
    const fmt = (d: Date) => d.toLocaleString('default', { month: 'long', year: 'numeric' });
    this.headerDateRange = first.getMonth() === last.getMonth()
      ? fmt(first)
      : `${fmt(first)} – ${fmt(last)}`;
  }

  eventTypeName(type: number): string {
    switch (type) {
      case 0: return '☕ Coffee meetup';
      case 1: return '★ Monthly event';
      case 2: return '◆ Exclusive · White Tie';
      default: return 'Event';
    }
  }

  badgeClass(type: number): string {
    switch (type) {
      case 0: return 'badge-coffee';
      case 1: return 'badge-monthly';
      case 2: return 'badge-exclusive';
      default: return '';
    }
  }

  spotsLeft(event: EtiquetteEvent): number {
    return event.totalSpots - event.bookedSpots;
  }

  openDetail(event: EtiquetteEvent) {
    this.selectedEvent = event;
  }

  closeDetail() {
    this.selectedEvent = null;
  }

  book(event: EtiquetteEvent) {
    this.booking = true;
    this.apiService.bookEvent(event.id).subscribe({
      next: (updated) => {
        this.booking = false;
        const index = this.events.findIndex(e => e.id === event.id);
        if (index !== -1) {
          this.events[index] = updated;
          this.groupEvents(this.events);
          this.selectedEvent = this.events[index];
        }
      },
      error: (err) => {
        this.booking = false;
        if (err.status === 400) {
          this.ngOnInit();
          this.closeDetail();
        }
      }
    });
  }
}
