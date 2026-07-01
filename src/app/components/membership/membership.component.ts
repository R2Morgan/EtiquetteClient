import { Component, inject, OnInit } from '@angular/core';
import {IonContent, IonIcon, IonSpinner, NavController} from '@ionic/angular/standalone';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { HeaderComponentComponent } from '../shared/header/header-component.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ApiService } from '../../services/api-service';
import { User } from '../../models/User';
import {Browser} from "@capacitor/browser";
import {environment} from "../../../environments/environment";
import {TokenService} from "../../services/token-service";
import {HttpClient} from "@angular/common/http";

interface Partner {
  name: string;
  discount: string;
  revealed: boolean;
}

interface Tier {
  name: string;
  badge: string;
  price: string;
  perks: string[];
  featured: boolean;
  type: number;
}

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss'],
  imports: [IonContent, NgIf, NgFor, DatePipe, HeaderComponentComponent, FooterComponent, IonIcon, IonSpinner]
})
export class MembershipComponent implements OnInit {
  private apiService = inject(ApiService);
  private navCtrl = inject(NavController);
  private tokenService = inject(TokenService);
  private http = inject(HttpClient);

  user: User | null = null;

  tiers: Tier[] = [
    {
      name: 'Neck Tie', badge: 'Entry membership', price: '150 RON',
      type: 0, featured: false,
      perks: ['Access to digital community', 'Event photos & videos', '1 members-only event/month', '5 partner discounts']
    },
    {
      name: 'Black Tie', badge: 'Full membership', price: '300 RON',
      type: 1, featured: true,
      perks: ['Everything in Neck Tie', 'All monthly formal dinners', 'Priority RSVP & event influence', 'Patron status', '10 partner discounts']
    },
    {
      name: 'White Tie', badge: 'Prestige membership', price: '500 RON',
      type: 2, featured: false,
      perks: ['Everything in Black Tie', 'White Tie VIP events', 'Bring a guest to events', 'Voting rights', '15+ partner discounts']
    }
  ];

  compareRows = [
    { feature: 'Digital community', vals: ['✦', '✦', '✦'] },
    { feature: 'Event media', vals: ['✦', '✦', '✦'] },
    { feature: 'Monthly events', vals: ['1', '✦', '✦'] },
    { feature: 'Partner discounts', vals: ['5', '10', '15+'] },
    { feature: 'Patron status', vals: ['—', '✦', '✦'] },
    { feature: 'Voting rights', vals: ['—', '—', '✦'] },
    { feature: 'VIP events', vals: ['—', '—', '✦'] },
  ];

  neckTiePartners: Partner[] = [
    { name: 'Tudor Tailor', discount: '5%', revealed: false },
    { name: 'Popantofaria', discount: '10%', revealed: false },
    { name: 'DOT', discount: '5%', revealed: false },
    { name: 'Meron', discount: '10%', revealed: false },
    { name: 'Mezum', discount: '5%', revealed: false },
  ];

  blackTiePartners: Partner[] = [
    { name: 'Tudor Tailor', discount: '10%', revealed: false },
    { name: 'Artizan', discount: '10%', revealed: false },
    { name: 'Popantofaria', discount: '15%', revealed: false },
    { name: 'Tell a Story', discount: '10%', revealed: false },
    { name: 'Meron', discount: '10%', revealed: false },
    { name: 'DOT', discount: '10%', revealed: false },
    { name: 'Mezum', discount: '10%', revealed: false },
    { name: 'To Be Announced', discount: '10%', revealed: false },
    { name: 'To Be Announced', discount: '10%', revealed: false },
    { name: 'To Be Announced', discount: '15%', revealed: false },
  ];

  whiteTiePartners: Partner[] = [
    { name: 'Tudor Tailor', discount: '15%', revealed: false },
    { name: 'Mezum', discount: '15%', revealed: false },
    { name: 'Artizan', discount: '25%', revealed: false },
    { name: 'Zesso', discount: '10%', revealed: false },
    { name: 'Popantofaria', discount: '20%', revealed: false },
    { name: 'Tell a Story', discount: '15%', revealed: false },
    { name: 'Meron', discount: '10%', revealed: false },
    { name: 'DOT', discount: '15%', revealed: false },
    { name: 'To Be Announced', discount: '10%', revealed: false },
    { name: 'To Be Announced', discount: '10%', revealed: false },
    { name: 'To Be Announced', discount: '15%', revealed: false },
    { name: 'To Be Announced', discount: '20%', revealed: false },
    { name: 'To Be Announced', discount: '20%', revealed: false },
    { name: 'To Be Announced', discount: '20%', revealed: false },
    { name: 'To Be Announced', discount: '15%', revealed: false },
  ];
  loading = false;

  get hasActiveMembership(): boolean {
    return this.user !== null && this.user.isActiveMember;
  }

  get activePartners(): Partner[] {
    switch (this.user?.membershipType) {
      case 0: return this.neckTiePartners;
      case 1: return this.blackTiePartners;
      case 2: return this.whiteTiePartners;
      default: return [];
    }
  }

  get activeTierName(): string {
    switch (this.user?.membershipType) {
      case 0: return 'Neck Tie';
      case 1: return 'Black Tie';
      case 2: return 'White Tie';
      default: return '';
    }
  }

  get activeTierBadge(): string {
    switch (this.user?.membershipType) {
      case 0: return 'Entry membership';
      case 1: return 'Full membership';
      case 2: return 'Prestige membership';
      default: return '';
    }
  }

  get activeBenefits(): string[] {
    return this.tiers.find(t => t.type === this.user?.membershipType)?.perks ?? [];
  }

  ngOnInit() {
    this.loading = true;
    this.apiService.getMe().subscribe(user => {
      this.user = user;
      this.loading = false;
    });
  }

  togglePartner(partner: Partner) {
    partner.revealed = !partner.revealed;
  }

  selectTier(tier: Tier) {
    const paymentLinks = [
      'https://buy.stripe.com/test_5kQ7sEdUr8gvfen2BbgUM02',
      'https://buy.stripe.com/test_fZubIUaIffIXaY72BbgUM01',
      'https://buy.stripe.com/test_00w00ceYv68nfenfnXgUM00'
    ];

    const url = `${paymentLinks[tier.type]}?client_reference_id=${this.user?.id}`;
    Browser.open({ url });
  }

  addToWallet() {
    const token = this.tokenService.getAccessToken();
    const url = `${environment.apiUrl}/wallet-pass?token=${token}`;
    Browser.open({ url });
  }
  cancelMembership() {
    this.apiService.createPortalSession().subscribe({
      next: (res) => {
        Browser.open({ url: res.url });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
