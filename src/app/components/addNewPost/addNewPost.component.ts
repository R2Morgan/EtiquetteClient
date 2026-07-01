import { Component, inject, OnInit } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  NavController
} from '@ionic/angular/standalone';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { imageOutline, closeOutline, chevronBackOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ApiService } from '../../services/api-service';
import { slideAnimation } from '../../animations/fade-right.animation';
import {PushNotifications} from "@capacitor/push-notifications";

@Component({
  selector: 'app-add-post',
  templateUrl: './addNewPost.component.html',
  styleUrls: ['./addNewPost.component.scss'],
  imports: [IonContent, IonIcon, NgIf, NgFor, FormsModule, IonTitle, IonToolbar, IonHeader, IonButton]
})
export class AddNewPostComponent implements OnInit {
  private apiService = inject(ApiService);
  private navCtrl = inject(NavController);

  title = '';
  content = '';
  imageUrl: string | null = null;
  selectedType: number = 3;
  eventId: string | null = null;
  submitting = false;
  errorMessage = '';

  postTypes = [
    { value: 0, label: 'Event Media' },
    { value: 1, label: 'Member Spotlight' },
    { value: 2, label: 'Upcoming Event' },
    { value: 3, label: 'News & Updates' },
    { value: 4, label: 'Others' }
  ];

  constructor() {
    addIcons({ imageOutline, closeOutline, chevronBackOutline });
  }

  ngOnInit() {}

  async pickImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });

      if (image.webPath) {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        this.apiService.uploadImage(blob).subscribe({
          next: (res) => this.imageUrl = res.url,
          error: (err) => console.error(err)
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  removeImage() {
    this.imageUrl = null;
  }

  get isValid(): boolean {
    return this.content.trim().length > 0;
  }

  submit() {
    if (!this.isValid || this.submitting) return;
    this.submitting = true;
    this.errorMessage = '';

    this.apiService.createPost({
      title: this.title.trim() || undefined,
      content: this.content.trim(),
      imageUrl: this.imageUrl,
      type: this.selectedType,
      eventId: this.eventId
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.navCtrl.navigateBack('/feed', { animation: slideAnimation('back') });
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = 'Something went wrong. Please try again.';
        console.error(err);
      }
    });
  }

  goBack() {
    this.navCtrl.navigateBack('/feed', { animation: slideAnimation('back') });
  }
}
