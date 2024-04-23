import { Component, ElementRef, ViewChild  } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('contentToRecord') contentToRecord!: ElementRef;
  @ViewChild('recordedVideo') recordedVideo!: ElementRef;

  mediaRecorder!: MediaRecorder;
  recordedChunks: Blob[] = [];
  canvas!: HTMLCanvasElement;

  startRecording() {
    this.canvas = document.createElement('canvas');
    const contentToRecord = this.contentToRecord.nativeElement;
  
    this.canvas.width = contentToRecord.offsetWidth;
    this.canvas.height = contentToRecord.offsetHeight;
  
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to obtain 2D rendering context');
      return;
    }
  
    const data = new XMLSerializer().serializeToString(contentToRecord);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const stream = this.canvas.captureStream();
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
  
      this.mediaRecorder.start();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(data);
  }
  
  

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  exportVideo() {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    (this.recordedVideo.nativeElement as HTMLVideoElement).src = url;
  }

  

}
