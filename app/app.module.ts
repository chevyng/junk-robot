import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { AppComponent }  from './app.component';

import { HeroFormComponent } from './hero-form.component';
import { TestGraphComponent } from './graph.component'
import { HeaderComponent } from './header.component';

import { CodemirrorModule } from 'ng2-codemirror';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CodemirrorModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AppComponent,
    HeroFormComponent,
    TestGraphComponent,
    HeaderComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
