import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-secretary-list',
  templateUrl: './secretary-list.component.html',
  styleUrls: ['./secretary-list.component.css']
})
export class SecretaryListComponent {

}