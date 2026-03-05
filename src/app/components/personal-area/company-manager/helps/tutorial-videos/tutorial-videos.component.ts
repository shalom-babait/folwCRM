// tutorial-videos.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
}

@Component({
  selector: 'app-tutorial-videos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutorial-videos.component.html',
  styleUrls: ['./tutorial-videos.component.css']
})
export class TutorialVideosComponent {
  selectedVideo: Video | null = null;
  
  videos: Video[] = [
    {
      id: '1',
      title: 'מבוא למערכת',
      description: 'למד את יסודות העבודה במערכת וההתחלה המהירה',
      duration: '5:30',
      thumbnailUrl: 'assets/photoes/tutorials/placeholder.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: '2',
      title: 'ניהול משתמשים',
      description: 'כיצד להוסיף, לערוך ולנהל משתמשים במערכת',
      duration: '8:15',
      thumbnailUrl: 'assets/photoes/tutorials/placeholder.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: '3',
      title: 'דוחות ותצוגות',
      description: 'יצירת דוחות מותאמים אישית ותצוגות מידע',
      duration: '6:45',
      thumbnailUrl: 'assets/photoes/tutorials/placeholder.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: '4',
      title: 'הגדרות מתקדמות',
      description: 'התאמה אישית והגדרות מתקדמות של המערכת',
      duration: '10:20',
      thumbnailUrl: 'assets/photoes/tutorials/placeholder.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: '5',
      title: 'פתרון בעיות נפוצות',
      description: 'מדריך לפתרון בעיות ותקלות נפוצות',
      duration: '7:00',
      thumbnailUrl: 'assets/photoes/tutorials/placeholder.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: '6',
      title: 'טיפים ועצות',
      description: 'שיפור יעילות העבודה במערכת עם טיפים מועילים',
      duration: '4:50',
      thumbnailUrl: 'assets/photoes/tutorials/placeholder.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  selectVideo(video: Video): void {
    this.selectedVideo = video;
  }

  closeVideo(): void {
    this.selectedVideo = null;
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
