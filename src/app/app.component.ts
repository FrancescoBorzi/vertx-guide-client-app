import { Component, OnInit, Sanitizer, SecurityContext } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { ErrorResponse, Page, PagePayload } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  readonly DEFAULT_PAGENAME = 'Example page';
  readonly DEFAULT_MARKDOWN = '# Example page\n\nSome text _here_.\n';

  alertMessage: string;
  alertShown = false;
  alertSuccess: boolean;

  pages: Page[];
  renderedHtml: SafeHtml;
  keyUp = new Subject<any>();

  pageId: number;
  pageName: string;
  pageMarkdown: string;

  constructor(
    private apiService: ApiService,
    private sanitizer: Sanitizer,
  ) {}

  ngOnInit() {
    this.reload();
    this.newPage();
    this.initLiveRendering();
  }

  reload() {
    this.apiService.getAllPages().subscribe((response) => {
      this.pages = response.pages;
    });
  }

  initLiveRendering() {
    this.keyUp.pipe(
      map(event => event.target.value),
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((newMarkdown: string) => {
      this.updateMarkdown(newMarkdown);
    });
  }

  updateMarkdown(newMarkdown: string) {
    this.apiService.getMarkdown(newMarkdown).subscribe((newHtml) => {
      this.updateRendering(newHtml);
    });
  }

  newPage() {
    this.pageId = undefined;
    this.pageName = this.DEFAULT_PAGENAME;
    this.pageMarkdown = this.DEFAULT_MARKDOWN;
    this.updateMarkdown(this.pageMarkdown);
  }

  pageExists(): boolean {
    return this.pageId !== undefined;
  }

  load(id: number) {
    this.apiService.getPage(id).subscribe((response) => {
      const page = response.page;
      this.pageId = page.id;
      this.pageName = page.name;
      this.pageMarkdown = page.markdown;
      this.updateRendering(page.html);
    });
  }

  updateRendering(html: string) {
    this.renderedHtml = this.sanitizer.sanitize(SecurityContext.HTML, html);
  }

  reloadPage() {
    this.apiService.getAllPages().subscribe((response) => {
      this.pages = response.pages;
      const guessMaxId = Math.max(...this.pages.map(page => page.id));
      this.load(guessMaxId || 0);
    });
  }

  save() {
    let payload: PagePayload;
    if (this.pageId === undefined) {
      payload = {
        'name': this.pageName,
        'markdown': this.pageMarkdown
      };
      this.apiService.addPage(payload).subscribe(() => {
        this.reloadPage();
        this.success('Page created');
      }, (response: ErrorResponse) => {
        this.error(response.error.error);
      });
    } else {
      payload = {
        'markdown': this.pageMarkdown,
      };
      this.apiService.editPage(this.pageId, payload).subscribe(() => {
        this.success('Page saved');
      }, (response: ErrorResponse) => {
        this.error(response.error.error);
      });
    }
  }

  delete() {
    this.apiService.deletePage(this.pageId).subscribe(() => {
      this.reload();
      this.newPage();
      this.success('Page deleted');
    }, (response: ErrorResponse) => {
      this.error(response.error.error);
    });
  }

  success(message: string) {
    this.alert(message, true);
  }

  error(message: string) {
    this.alert(message, false);
  }

  alert(message: string, success: boolean) {
    this.alertMessage = message;
    this.alertSuccess = success;
    this.alertShown = true;

    setInterval(() => {
      this.alertShown = false;
    }, 5000);
  }
}
