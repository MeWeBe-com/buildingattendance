import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EdituserPage } from './edituser.page';

describe('EdituserPage', () => {
  let component: EdituserPage;
  let fixture: ComponentFixture<EdituserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EdituserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
