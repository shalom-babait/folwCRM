import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    }
  ]
})
export class TextEditorComponent implements ControlValueAccessor {
  fullscreen = false;
  public editorInit: any = {
    height: 300,
    menubar: false,
    plugins: [
      'link',
      'lists',
      'table',
      'wordcount'
    ],
    toolbar:
      'undo redo | bold italic underline | bullist numlist | link table | removeformat',
    language: 'he',
    language_url: '/assets/tinymce/langs/he_IL.js'
  };

  private _value: string = '';
  onChange: (_: any) => void = () => {};
  onTouched: () => void = () => {};

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this._value = value || '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    // Optionally handle disabled state
  }

  get content(): string {
    return this._value;
  }
  set content(val: string) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  // Called by the editor (template)
  onContentChange(value: string) {
    this.content = value;
  }
}
