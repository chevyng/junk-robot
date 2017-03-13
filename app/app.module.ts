import { NgModule }                         from '@angular/core';
import { BrowserModule }                    from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule }                      from '@angular/http';
import { RouterModule, Routes }             from '@angular/router';

import { AppComponent }                     from './app.component';
import { HeroFormComponent }                from './hero-form.component';
import { TestGraphComponent }               from './graph.component'
import { HeaderComponent }                  from './header.component';
import { AboutComponent }                   from './about.component';

import { CodemirrorModule }                 from 'ng2-codemirror';
import { NgbModule }                        from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
  { path: '', component: HeroFormComponent, pathMatch: 'full'},
  { path: 'about', component: AboutComponent },
  { path: 'maze/:id', component: HeroFormComponent },
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
    CodemirrorModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AppComponent,
    HeroFormComponent,
    TestGraphComponent,
    HeaderComponent,
    AboutComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
