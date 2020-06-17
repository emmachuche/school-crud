import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlumnosPage } from './alumnos.page';

describe('AlumnosPage', () => {
  let component: AlumnosPage;
  let fixture: ComponentFixture<AlumnosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlumnosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
