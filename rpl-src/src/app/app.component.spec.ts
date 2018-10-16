import { TestBed, async } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';

import { UtilsService } from './utils.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent,
        NavigationComponent,
        FooterComponent
      ],
      imports: [
        RouterModule.forRoot([]),
        FormsModule
      ],
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        },
        UtilsService
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  }));
});
