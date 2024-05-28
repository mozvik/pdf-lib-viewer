import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxExtendedPdfViewerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'pdf-edit';
  url: any;

  constructor() {}

  ngOnInit(): void {
    const pdfBlob = this.createPdfForm();
  }

  pdfDownloaded(e: any) {
    console.log('pdf downloaded', e);
  }

  urlChanged(e: any) {
    console.log('url changed', e);
  }

  async createPdfForm() {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();

    // Add a blank page to the document
    const page = pdfDoc.addPage([550, 750]);

    // Get the form so we can add fields to it
    const form = pdfDoc.getForm();

    // Add the superhero text field and description
    page.drawText('Enter your favorite superhero:', {
      x: 50,
      y: 700,
      size: 20,
    });

    const superheroField = form.createTextField('favorite.superhero');
    superheroField.setText('One Punch Man');
    superheroField.addToPage(page, { x: 55, y: 640 });

    // Add the rocket radio group, labels, and description
    page.drawText('Select your favorite rocket:', { x: 50, y: 600, size: 20 });

    page.drawText('Falcon Heavy', { x: 120, y: 560, size: 18 });
    page.drawText('Saturn IV', { x: 120, y: 500, size: 18 });
    page.drawText('Delta IV Heavy', { x: 340, y: 560, size: 18 });
    page.drawText('Space Launch System', { x: 340, y: 500, size: 18 });

    const rocketField = form.createRadioGroup('favorite.rocket');
    rocketField.addOptionToPage('Falcon Heavy', page, { x: 55, y: 540 });
    rocketField.addOptionToPage('Saturn IV', page, { x: 55, y: 480 });
    rocketField.addOptionToPage('Delta IV Heavy', page, { x: 275, y: 540 });
    rocketField.addOptionToPage('Space Launch System', page, {
      x: 275,
      y: 480,
    });
    rocketField.select('Saturn IV');

    // Add the gundam check boxes, labels, and description
    page.drawText('Select your favorite gundams:', { x: 50, y: 440, size: 20 });

    page.drawText('Exia', { x: 120, y: 400, size: 18 });
    page.drawText('Kyrios', { x: 120, y: 340, size: 18 });
    page.drawText('Virtue', { x: 340, y: 400, size: 18 });
    page.drawText('Dynames', { x: 340, y: 340, size: 18 });

    const exiaField = form.createCheckBox('gundam.exia');
    const kyriosField = form.createCheckBox('gundam.kyrios');
    const virtueField = form.createCheckBox('gundam.virtue');
    const dynamesField = form.createCheckBox('gundam.dynames');

    exiaField.addToPage(page, { x: 55, y: 380 });
    kyriosField.addToPage(page, { x: 55, y: 320 });
    virtueField.addToPage(page, { x: 275, y: 380 });
    dynamesField.addToPage(page, { x: 275, y: 320 });

    exiaField.check();
    dynamesField.check();

    // Add the planet dropdown and description
    page.drawText('Select your favorite planet*:', { x: 50, y: 280, size: 20 });

    const planetsField = form.createDropdown('favorite.planet');
    planetsField.addOptions(['Venus', 'Earth', 'Mars', 'Pluto']);
    planetsField.select('Pluto');
    planetsField.addToPage(page, { x: 55, y: 220 });

    // Add the person option list and description
    page.drawText('Select your favorite person:', { x: 50, y: 180, size: 18 });

    const personField = form.createOptionList('favorite.person');
    personField.addOptions([
      'Julius Caesar',
      'Ada Lovelace',
      'Cleopatra',
      'Aaron Burr',
      'Mark Antony',
    ]);
    personField.select('Ada Lovelace');
    personField.addToPage(page, { x: 55, y: 70 });

    // Just saying...
    page.drawText(`* Pluto should be a planet too!`, {
      x: 15,
      y: 15,
      size: 15,
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // this.url = URL.createObjectURL(
    //   new Blob([pdfBytes], { type: 'application/pdf' })
    // );
    // this.url = URL.createObjectURL(
    this.url = new Blob([pdfBytes], { type: 'application/pdf' });
    // );
    console.log('url :>> ', this.url);
    // For example, `pdfBytes` can be:
    //   • Written to a file in Node
    //   • Downloaded from the browser
    //   • Rendered in an <iframe>
  }

  async registerFontkit() {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
  }
}
