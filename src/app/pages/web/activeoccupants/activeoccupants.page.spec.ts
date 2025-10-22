import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveoccupantsPage } from './activeoccupants.page';

describe('ActiveoccupantsPage', () => {
  let component: ActiveoccupantsPage;
  let fixture: ComponentFixture<ActiveoccupantsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveoccupantsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
