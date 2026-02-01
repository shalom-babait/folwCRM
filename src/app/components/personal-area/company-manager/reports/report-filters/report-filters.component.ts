
import { Component, OnInit } from '@angular/core';

// Preset types for quick date filters
enum ReportPresetType {
  CurrentMonth = 'CurrentMonth',
  LastQuarter = 'LastQuarter',
  CurrentYear = 'CurrentYear',
  CompareLastYear = 'CompareLastYear',
}

interface DateRange {
  dateFrom: Date;
  dateTo: Date;
}

// Utility function to get date range for each preset
function getDateRangeForPreset(preset: ReportPresetType): DateRange {
  const now = new Date();
  let from: Date, to: Date;
  switch (preset) {
    case ReportPresetType.CurrentMonth:
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case ReportPresetType.LastQuarter: {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
      const year = currentQuarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
      from = new Date(year, lastQuarter * 3, 1);
      to = new Date(year, lastQuarter * 3 + 3, 0);
      break;
    }
    case ReportPresetType.CurrentYear:
      from = new Date(now.getFullYear(), 0, 1);
      to = new Date(now.getFullYear(), 11, 31);
      break;
    case ReportPresetType.CompareLastYear:
      from = new Date(now.getFullYear() - 1, 0, 1);
      to = new Date(now.getFullYear() - 1, 11, 31);
      break;
    default:
      from = to = now;
  }
  return { dateFrom: from, dateTo: to };
}

@Component({
  selector: 'app-report-filters',
  templateUrl: './report-filters.component.html',
  styleUrls: ['./report-filters.component.css']
})
export class ReportFiltersComponent implements OnInit {
  ReportPresetType = ReportPresetType;
  presets = [
    ReportPresetType.CurrentMonth,
    ReportPresetType.LastQuarter,
    ReportPresetType.CurrentYear,
    ReportPresetType.CompareLastYear
  ];
  presetLabels = {
    [ReportPresetType.CurrentMonth]: 'החודש הנוכחי',
    [ReportPresetType.LastQuarter]: 'רבעון קודם',
    [ReportPresetType.CurrentYear]: 'שנה נוכחית',
    [ReportPresetType.CompareLastYear]: 'השוואה לשנה שעברה'
  };
  selectedPreset: ReportPresetType = ReportPresetType.CurrentMonth;

  ngOnInit() {
    this.applyPreset(this.selectedPreset);
  }

  onPresetClick(preset: ReportPresetType) {
    this.selectedPreset = preset;
    this.applyPreset(preset);
  }

  dateFrom: Date | null = null;
  dateTo: Date | null = null;

  applyPreset(preset: ReportPresetType) {
    const { dateFrom, dateTo } = getDateRangeForPreset(preset);
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.fetchReports();
  }

  fetchReports() {
    // כאן תבצע את קריאת ה-API בפועל לפי dateFrom/dateTo
    // דוגמה:
    // this.reportsService.getReports(this.dateFrom, this.dateTo).subscribe(...)
    console.log('Fetching reports for:', this.dateFrom, this.dateTo);
  }
}
