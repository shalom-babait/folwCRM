import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenseCategoriesComponent } from './add-expense-categories.component';

describe('AddExpenseCategoriesComponent', () => {
  let component: AddExpenseCategoriesComponent;
  let fixture: ComponentFixture<AddExpenseCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddExpenseCategoriesComponent]
    });
    fixture = TestBed.createComponent(AddExpenseCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
