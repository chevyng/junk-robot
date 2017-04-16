import { NgModule }                         from '@angular/core';
import { BrowserModule }                    from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule }                      from '@angular/http';
import { RouterModule, Routes }             from '@angular/router';

import { AppComponent }                     from './app.component';
import { MainComponent }                    from './main.component';
import { GraphComponent }                   from './graph.component'
import { HeaderComponent }                  from './header.component';
import { TutorialComponent }                from './tutorial.component';
import { FooterComponent }                  from './footer.component';

import { CodemirrorModule }                 from 'ng2-codemirror';
import { NgbModule }                        from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
  { path: '', component: MainComponent, pathMatch: 'full'},
  { path: 'tutorials', component: TutorialComponent },
  { path: 'maze/:id', component: MainComponent },
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    CodemirrorModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AppComponent,
    MainComponent,
    GraphComponent,
    HeaderComponent,
    TutorialComponent,
    FooterComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
