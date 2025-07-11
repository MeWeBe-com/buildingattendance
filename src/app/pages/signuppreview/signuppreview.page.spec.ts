import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignuppreviewPage } from './signuppreview.page';

describe('SignuppreviewPage', () => {
  let component: SignuppreviewPage;
  let fixture: ComponentFixture<SignuppreviewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SignuppreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
