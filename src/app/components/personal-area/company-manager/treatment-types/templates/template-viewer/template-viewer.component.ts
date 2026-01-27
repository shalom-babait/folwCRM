import { Component, Input, OnInit } from '@angular/core';
import { TemplateServiceService } from 'src/app/services/template-service.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-template-viewer',
  templateUrl: './template-viewer.component.html',
  styleUrls: ['./template-viewer.component.css']
})
export class TemplateViewerComponent implements OnInit {
  @Input() templateId!: number;

  template: any;
  questions: any[] = [];
  files: any[] = [];
  form: FormGroup = new FormGroup({});

  constructor(private templateService: TemplateServiceService) {}

  ngOnInit() {
  this.templateService.getTemplate(this.templateId).subscribe((t: any) => {
      this.template = t;
      this.questions = t.questions || [];
      this.files = t.files || [];
      // Build form controls for non-static_text questions
      const group: { [key: string]: FormControl } = {};
      this.questions.forEach(q => {
        if (q.question_type !== 'static_text') {
          group[q.question_id.toString()] = new FormControl('');
        }
      });
      this.form = new FormGroup(group);
    });
  }

  submitAnswers() {
    const payload = this.questions
      .filter(q => q.question_type !== 'static_text')
      .map(q => ({
        question_id: q.question_id,
        answer_text: this.form.get(q.question_id.toString())?.value
      }));
  this.templateService.saveAnswers(this.templateId, payload).subscribe({
      next: () => alert('תשובות נשמרו בהצלחה!'),
      error: () => alert('שגיאה בשמירת התשובות')
    });
  }
}