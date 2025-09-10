import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuestPage } from './guest.page';

describe('GuestPage', () => {
  let component: GuestPage;
  let fixture: ComponentFixture<GuestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
