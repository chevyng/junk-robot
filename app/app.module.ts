import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { AppComponent }  from './app.component';

import { HeroFormComponent } from './hero-form.component';
import { TestGraphComponent } from './graph.component'

import { CodemirrorModule } from 'ng2-codemirror';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CodemirrorModule
  ],
  declarations: [
    AppComponent,
    HeroFormComponent,
    TestGraphComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
