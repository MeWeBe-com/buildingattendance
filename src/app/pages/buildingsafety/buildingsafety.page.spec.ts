import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildingsafetyPage } from './buildingsafety.page';

describe('BuildingsafetyPage', () => {
  let component: BuildingsafetyPage;
  let fixture: ComponentFixture<BuildingsafetyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingsafetyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
