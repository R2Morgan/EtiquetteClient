import {Component, inject, OnInit} from '@angular/core';
import {FooterComponent} from "../shared/footer/footer.component";
import {HeaderComponentComponent} from "../shared/header/header-component.component";
import {
  IonChip,
  IonContent,
  IonIcon,
  IonLabel,
  IonRefresher, IonRefresherContent, IonSpinner,
  NavController,
  ViewWillEnter
} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {personCircleOutline} from "ionicons/icons";
import {slideAnimation} from "../../animations/fade-right.animation";
import {NgIf, NgFor, NgClass, DatePipe} from "@angular/common";
import {ApiService} from "../../services/api-service";
import {Post} from "../../models/Post";
import {RefresherCustomEvent} from "@ionic/angular";

enum EMFilterType {
  EVENT_MEDIA = 'Event Media',
  MEMBER_SPOTLIGHT = 'Member Spotlight',
  UPCOMING_EVENT = 'Upcoming Events',
  NEWS_AND_UPDATES = 'News & Updates',
  OTHERS = 'Others',
  DEFAULT = 'Filter Posts'
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  imports: [
    FooterComponent,
    HeaderComponentComponent,
    IonChip,
    IonContent,
    NgIf,
    NgFor,
    NgClass,
    DatePipe,
    IonIcon,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
    IonSpinner
  ]
})
export class FeedComponent implements OnInit, ViewWillEnter {

  private navCtrl = inject(NavController);
  private apiService = inject(ApiService);

  posts: Post[] = [];
  activeFilter: number | null = null;
  filterType: EMFilterType = EMFilterType.DEFAULT;
  loading = false;

  constructor() {
    addIcons({ personCircleOutline });
  }

  ngOnInit() {
    this.loadPosts();
  }

  ionViewWillEnter() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.apiService.getPosts(this.activeFilter ?? undefined).subscribe(posts => {
      this.posts = posts;
      this.loading = false;
    });
  }

  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.loadPosts();
      event.target.complete();
    }, 2000);
  }

  setFilter(type: number | null) {
    this.activeFilter = type;
    this.loadPosts();
  }

  goToMembers() {
    this.navCtrl.navigateForward('/members', {
      animation: slideAnimation('forward')
    });
  }

  typeName(type: number): string {
    switch (type) {
      case 0: return 'Event Media';
      case 1: return 'Spotlight';
      case 2: return 'Upcoming Event';
      case 3: return 'News';
      case 4: return 'Others';
      default: return '';
    }
  }

  badgeClass(type: number): string {
    switch (type) {
      case 0: return 'badge-media';
      case 1: return 'badge-spotlight';
      case 2: return 'badge-event';
      case 3: return 'badge-news';
      case 4: return 'badge-other';
      default: return '';
    }
  }

  protected onSetFilter() {
    this.changeFilterType();
    switch (this.filterType) {
      case EMFilterType.EVENT_MEDIA: this.setFilter(0); break;
      case EMFilterType.MEMBER_SPOTLIGHT: this.setFilter(1); break;
      case EMFilterType.UPCOMING_EVENT: this.setFilter(2); break;
      case EMFilterType.NEWS_AND_UPDATES: this.setFilter(3); break;
      case EMFilterType.OTHERS: this.setFilter(4); break;
      case EMFilterType.DEFAULT: this.setFilter(null); break;
    }
  }

  private changeFilterType() {
    switch (this.filterType) {
      case EMFilterType.DEFAULT: this.filterType = EMFilterType.EVENT_MEDIA; break;
      case EMFilterType.EVENT_MEDIA: this.filterType = EMFilterType.MEMBER_SPOTLIGHT; break;
      case EMFilterType.MEMBER_SPOTLIGHT: this.filterType = EMFilterType.UPCOMING_EVENT; break;
      case EMFilterType.UPCOMING_EVENT: this.filterType = EMFilterType.NEWS_AND_UPDATES; break;
      case EMFilterType.NEWS_AND_UPDATES: this.filterType = EMFilterType.OTHERS; break;
      case EMFilterType.OTHERS: this.filterType = EMFilterType.DEFAULT; break;
    }
  }
}
