import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    }
  ]
})
export class TextEditorComponent implements ControlValueAccessor, OnInit {
  content = '';
  activeInput: 'text' | 'list' | 'bullet' | null = null;
  textValue = '';
  listValue = '';
  bulletValue = '';

  modules = {
    toolbar: [
  [{ 'size': ['small', false, 'large', 'huge'] }], // שורת גדלי פונט באנגלית (ערך תקני)
      ['bold', 'italic', 'underline'],       // כפתורי טקסט
      [{ color: [] }, { background: [] }], // שורת צבעים
      [{ list: 'ordered' }, { list: 'bullet' }], // רשימות
      [{ direction: 'rtl' }, { direction: 'ltr' }], // הוספת כפתור ימין-לשמאל ושמאל-לימין
      ['clean']
    ]
  };

  defaultDirection: 'rtl' | 'ltr' = 'rtl';
  isFullHeight = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.content = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit() {
    // קבע ברירת מחדל לימין לשמאל
    setTimeout(() => {
      const editor = document.querySelector('.ql-editor') as HTMLElement;
      if (editor) {
        editor.setAttribute('dir', this.defaultDirection);
        editor.style.textAlign = this.defaultDirection === 'rtl' ? 'right' : 'left';
      }
    }, 0);
  }

  // אפשר גם לעדכן את onChange כשמשתמשים ב-ngModel
  onContentChanged(event: any) {
    this.onChange(this.content);
    // עדכן כיוון ברירת מחדל אם המשתמש שינה
    if (event && event.source === 'user' && event.delta && event.delta.ops) {
      const editor = document.querySelector('.ql-editor') as HTMLElement;
      if (editor) {
        if (event.delta.ops.some((op: any) => op.insert && op.attributes && op.attributes.direction === 'ltr')) {
          editor.setAttribute('dir', 'ltr');
          editor.style.textAlign = 'left';
        } else if (event.delta.ops.some((op: any) => op.insert && op.attributes && op.attributes.direction === 'rtl')) {
          editor.setAttribute('dir', 'rtl');
          editor.style.textAlign = 'right';
        }
      }
    }
  }

  openInput(type: 'text' | 'list' | 'bullet') {
    this.activeInput = type;
  }

  saveInput(type: 'text' | 'list' | 'bullet') {
    this.activeInput = null;
    if (type === 'text') {
      this.content = this.textValue;
    } else if (type === 'list') {
      this.content = this.listValue.split('\n').map(item => `- ${item}`).join('\n');
    } else if (type === 'bullet') {
      this.content = this.bulletValue.split('\n').map(item => `• ${item}`).join('\n');
    }
    this.onChange(this.content);
  }

  toggleFullHeight() {
    this.isFullHeight = !this.isFullHeight;
  }
}
