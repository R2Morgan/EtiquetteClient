import {Component, inject, Input, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
  imports: [
    RouterLink
  ]
})
export class SuccessComponent  implements OnInit {

  private route = inject(ActivatedRoute);

  successMessage: string | undefined;

  constructor() { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.successMessage = params['successMessage'];
    });
  }

}
