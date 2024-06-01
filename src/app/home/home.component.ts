import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormDataType,
  NgxExtendedPdfViewerComponent,
  NgxExtendedPdfViewerModule,
  NgxExtendedPdfViewerService,
  PdfDocumentInfo,
  PdfDocumentPropertiesExtractor,
  ProgressBarEvent,
} from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('pdfViewer', { static: true }) pdfViewer:
    | NgxExtendedPdfViewerComponent
    | undefined;
  files: string[] = [
    'assets/autofin.pdf',
    'assets/editable.pdf',
    'assets/RadioCheckBox_AcroForm.pdf',
  ];
  public fileInfo: PdfDocumentInfo | undefined;
  public formData: FormDataType | undefined;
  url!: string;
  arrayBuffer!: ArrayBuffer | Uint8Array;
  blob!: Blob;
  uint8Array!: Uint8Array;
  base64!: string;
  savedBlobSize!: number;
  showToolbar = false;
  showToolbarButton = true;
  showSidebarButton = true;
  showPagination = true;
  customCSS = false;

  constructor(private pdfViewerService: NgxExtendedPdfViewerService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.pdfViewer) {
        console.log('pdfViewer component instance:', this.pdfViewer);
      } else {
        console.log('pdfViewer is undefined');
      }
    }, 0);
  }

  async downloadPDF(url: string) {
    this.formData = undefined;
    this.fileInfo = undefined;
    this.savedBlobSize = 0;

    //[src] variants:
    this.arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());

    this.uint8Array = new Uint8Array(this.arrayBuffer);

    this.blob = new Blob([new Uint8Array(this.arrayBuffer)], {
      type: 'application/octet-stream',
    });

    this.url = URL.createObjectURL(this.blob);

    //[base64src]
    // this.base64 = btoa(
    //   String.fromCharCode.apply(null, Array.from(this.uint8Array))
    // );
  }

  onChange(e: FormDataType) {
    this.formData = e;
  }

  public async export(): Promise<void> {
    if (!this.arrayBuffer) {
      return;
    }
    this.pdfViewerService
      .getCurrentDocumentAsBlob()
      .then((blob) => {
        this.savedBlobSize = blob.size;
        this.url = URL.createObjectURL(blob);

        // Create an anchor element
        const a = document.createElement('a');
        a.href = this.url;
        a.download = 'document.pdf'; // Set the file name for the download
        // Append the anchor to the body (necessary for Firefox)
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(this.url);
      })
      .catch((error) => {
        console.error('Error getting the document as a Blob:', error);
      });
  }

  onPagesLoaded() {
    new PdfDocumentPropertiesExtractor()
      .getDocumentProperties()
      .then((info) => (this.fileInfo = info));
  }

  onProgress(progress: ProgressBarEvent) {
    console.log('progress:', progress);
  }
}
